import { QdrantClient } from '@qdrant/js-client-rest';

// Qdrant configuration - handle both browser and Node.js environments
const getEnvVar = (key: string, defaultValue?: string) => {
  if (typeof window !== 'undefined') {
    // Browser environment - use import.meta.env for Vite
    return (import.meta.env as any)[key] || defaultValue;
  } else {
    // Node.js environment - use process.env
    return process?.env?.[key] || defaultValue;
  }
};

// Get the Qdrant URL and ensure it doesn't have the default port for cloud instances
const getQdrantUrl = () => {
  const url = getEnvVar('VITE_QDRANT_URL') || getEnvVar('NEXT_PUBLIC_QDRANT_URL') || 'http://localhost:6333';
  
  // If it's a cloud URL (contains supabase.co or qdrant.io), don't add port
  if (url.includes('qdrant.io') || url.includes('supabase.co')) {
    return url;
  }
  
  // For local development, ensure port is included
  if (url === 'http://localhost' || url === 'https://localhost') {
    return `${url}:6333`;
  }
  
  return url;
};

const QDRANT_URL = getQdrantUrl();
const QDRANT_API_KEY = getEnvVar('VITE_QDRANT_API_KEY') || getEnvVar('QDRANT_API_KEY');
const COLLECTION_NAME = 'prompts';

export interface PromptPayload extends Record<string, unknown> {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  tags: string[];
  contributor?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  stars: number;
  uses: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  category?: string;
  tags?: string[];
  difficulty?: string;
  featured?: boolean;
  contributor?: string;
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  filters?: SearchFilters;
  threshold?: number; // Similarity threshold (0-1)
}

class QdrantPromptService {
  private client: QdrantClient | null = null;
  private isInitialized = false;

  constructor() {
    // Only initialize Qdrant client in Node.js environment
    // Browser environment will use mock data fallback
    if (typeof window === 'undefined') {
      const url = getQdrantUrl();
      const apiKey = getEnvVar('VITE_QDRANT_API_KEY') || getEnvVar('QDRANT_API_KEY');
      
      console.log('Initializing Qdrant client with URL:', url);
      console.log('API Key present:', !!apiKey);
      
      this.client = new QdrantClient({
        url,
        apiKey,
      });
      this.isInitialized = true;
    } else {
      console.log('Browser environment detected - using mock data fallback for Qdrant');
    }
  }

  // Check if Qdrant is available
  private isAvailable(): boolean {
    return this.client !== null && this.isInitialized;
  }

  // Initialize collection with proper schema
  async initializeCollection(): Promise<void> {
    try {
      // Check if collection exists
      const collections = await this.client.getCollections();
      const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

      if (!exists) {
        await this.client.createCollection(COLLECTION_NAME, {
          vectors: {
            size: 1536, // OpenAI embedding size
            distance: 'Cosine',
          },
          optimizers_config: {
            default_segment_number: 2,
          },
          replication_factor: 1,
        });

        // Create payload indexes for faster filtering
        await this.client.createPayloadIndex(COLLECTION_NAME, {
          field_name: 'category',
          field_schema: 'keyword',
        });

        await this.client.createPayloadIndex(COLLECTION_NAME, {
          field_name: 'tags',
          field_schema: 'keyword',
        });

        await this.client.createPayloadIndex(COLLECTION_NAME, {
          field_name: 'difficulty',
          field_schema: 'keyword',
        });

        await this.client.createPayloadIndex(COLLECTION_NAME, {
          field_name: 'featured',
          field_schema: 'bool',
        });

        console.log('Qdrant collection initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize Qdrant collection:', error);
      throw error;
    }
  }

  // Generate embeddings using OpenAI API
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const proxyUrl = getEnvVar('VITE_OPENAI_PROXY_URL') || 'http://localhost:3002';

      const response = await fetch(`${proxyUrl}/api/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          model: 'text-embedding-3-small', // Cheaper and faster
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      console.error('Failed to generate embedding:', error);
      throw error;
    }
  }

  // Add or update a prompt
  async upsertPrompt(prompt: PromptPayload): Promise<void> {
    try {
      // Create searchable text combining title, description, and prompt
      const searchableText = `${prompt.title} ${prompt.description} ${prompt.prompt}`;
      const embedding = await this.generateEmbedding(searchableText);

      await this.client.upsert(COLLECTION_NAME, {
        wait: true,
        points: [
          {
            id: prompt.id,
            vector: embedding,
            payload: prompt,
          },
        ],
      });
    } catch (error) {
      console.error('Failed to upsert prompt:', error);
      throw error;
    }
  }

  // Batch insert prompts
  async batchUpsertPrompts(prompts: PromptPayload[]): Promise<void> {
    try {
      const points = await Promise.all(
        prompts.map(async (prompt) => {
          const searchableText = `${prompt.title} ${prompt.description} ${prompt.prompt}`;
          const embedding = await this.generateEmbedding(searchableText);
          
          return {
            id: prompt.id,
            vector: embedding,
            payload: prompt,
          };
        })
      );

      // Insert in batches of 100
      const batchSize = 100;
      for (let i = 0; i < points.length; i += batchSize) {
        const batch = points.slice(i, i + batchSize);
        await this.client.upsert(COLLECTION_NAME, {
          wait: true,
          points: batch,
        });
      }
    } catch (error) {
      console.error('Failed to batch upsert prompts:', error);
      throw error;
    }
  }

  // Semantic search with filters
  async searchPrompts(
    query: string,
    options: SearchOptions = {}
  ): Promise<{ prompts: PromptPayload[]; total: number }> {
    try {
      const {
        limit = 20,
        offset = 0,
        filters = {},
        threshold = 0.7,
      } = options;

      // Generate embedding for search query
      const queryEmbedding = await this.generateEmbedding(query);

      // Build filter conditions
      const filterConditions: any[] = [];

      if (filters.category) {
        filterConditions.push({
          key: 'category',
          match: { value: filters.category },
        });
      }

      if (filters.tags && filters.tags.length > 0) {
        filterConditions.push({
          key: 'tags',
          match: { any: filters.tags },
        });
      }

      if (filters.difficulty) {
        filterConditions.push({
          key: 'difficulty',
          match: { value: filters.difficulty },
        });
      }

      if (filters.featured !== undefined) {
        filterConditions.push({
          key: 'featured',
          match: { value: filters.featured },
        });
      }

      if (filters.contributor) {
        filterConditions.push({
          key: 'contributor',
          match: { value: filters.contributor },
        });
      }

      const searchResult = await this.client.search(COLLECTION_NAME, {
        vector: queryEmbedding,
        limit,
        offset,
        score_threshold: threshold,
        filter: filterConditions.length > 0 ? {
          must: filterConditions,
        } : undefined,
        with_payload: true,
      });

      const prompts = searchResult.map(result => result.payload as unknown as PromptPayload);
      
      return {
        prompts,
        total: searchResult.length, // Note: This is approximate for pagination
      };
    } catch (error) {
      console.error('Failed to search prompts:', error);
      throw error;
    }
  }

  // Get prompts by category (without semantic search)
  async getPromptsByCategory(
    category: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<{ prompts: PromptPayload[]; total: number }> {
    try {
      const { limit = 20, offset = 0 } = options;

      const result = await this.client.scroll(COLLECTION_NAME, {
        filter: {
          must: [
            {
              key: 'category',
              match: { value: category },
            },
          ],
        },
        limit,
        offset,
        with_payload: true,
      });

      const prompts = result.points.map(point => point.payload as unknown as PromptPayload);
      
      return {
        prompts,
        total: prompts.length, // Approximate
      };
    } catch (error) {
      console.error('Failed to get prompts by category:', error);
      throw error;
    }
  }

  // Get featured/trending prompts
  async getFeaturedPrompts(limit: number = 10): Promise<PromptPayload[]> {
    try {
      const result = await this.client.scroll(COLLECTION_NAME, {
        filter: {
          must: [
            {
              key: 'featured',
              match: { value: true },
            },
          ],
        },
        limit,
        with_payload: true,
      });

      return result.points.map(point => point.payload as unknown as PromptPayload);
    } catch (error) {
      console.error('Failed to get featured prompts:', error);
      throw error;
    }
  }

  // Get similar prompts
  async getSimilarPrompts(
    promptId: string,
    limit: number = 5
  ): Promise<PromptPayload[]> {
    try {
      // First get the target prompt
      const targetPrompt = await this.client.retrieve(COLLECTION_NAME, {
        ids: [promptId],
        with_payload: true,
        with_vector: true,
      });

      if (targetPrompt.length === 0) {
        return [];
      }

      // Search for similar prompts using the target's vector
      const searchResult = await this.client.search(COLLECTION_NAME, {
        vector: targetPrompt[0].vector as number[],
        limit: limit + 1, // +1 to exclude the target prompt itself
        with_payload: true,
      });

      // Filter out the target prompt and return similar ones
      return searchResult
        .filter(result => result.id !== promptId)
        .slice(0, limit)
        .map(result => result.payload as unknown as PromptPayload);
    } catch (error) {
      console.error('Failed to get similar prompts:', error);
      throw error;
    }
  }

  // Update prompt stats (stars, uses)
  async updatePromptStats(
    promptId: string,
    stats: { stars?: number; uses?: number }
  ): Promise<void> {
    try {
      await this.client.setPayload(COLLECTION_NAME, {
        payload: {
          ...stats,
          updatedAt: new Date().toISOString(),
        },
        points: [promptId],
      });
    } catch (error) {
      console.error('Failed to update prompt stats:', error);
      throw error;
    }
  }

  // Delete a prompt
  async deletePrompt(promptId: string): Promise<void> {
    try {
      await this.client.delete(COLLECTION_NAME, {
        points: [promptId],
      });
    } catch (error) {
      console.error('Failed to delete prompt:', error);
      throw error;
    }
  }

  // Get collection info and stats
  async getCollectionInfo(): Promise<any> {
    try {
      return await this.client.getCollection(COLLECTION_NAME);
    } catch (error) {
      console.error('Failed to get collection info:', error);
      throw error;
    }
  }
}

// Export singleton instance - only create in Node.js environment
export const qdrantService = typeof window === 'undefined' 
  ? new QdrantPromptService() 
  : null;

// Helper function to convert markdown prompts to Qdrant format
export function convertMarkdownPromptsToQdrant(markdownPrompts: any[]): PromptPayload[] {
  return markdownPrompts.map((prompt, index) => {
    // Generate a UUID for the ID
    const id = crypto.randomUUID();
    
    return {
      id,
      title: prompt.title,
      description: prompt.description,
      prompt: prompt.prompt,
      category: prompt.category,
      tags: [prompt.category, ...(prompt.contributor ? [`contributor:${prompt.contributor}`] : [])],
      contributor: prompt.contributor,
      difficulty: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)] as any,
      estimatedTime: ['5 minutes', '10 minutes', '15 minutes', '30 minutes'][Math.floor(Math.random() * 4)],
      stars: prompt.stars,
      uses: prompt.uses,
      featured: prompt.featured,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}