import { qdrantService, type PromptPayload, type SearchFilters, type SearchOptions } from '../qdrant';

// Get backend URL from environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export interface SearchPromptsRequest {
  query?: string;
  category?: string;
  tags?: string[];
  difficulty?: string;
  featured?: boolean;
  contributor?: string;
  limit?: number;
  offset?: number;
  threshold?: number;
}

export interface SearchPromptsResponse {
  prompts: PromptPayload[];
  total: number;
  hasMore: boolean;
}

// Search prompts with semantic search or filters
export async function searchPrompts(params: SearchPromptsRequest): Promise<SearchPromptsResponse> {
  try {
    // Use backend proxy server
    const response = await fetch(`${API_BASE_URL}/api/prompts/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Search prompts error:', error);
    
    // Return mock data as fallback
    return getMockSearchResults(params);
  }
}

// Get featured/trending prompts
export async function getFeaturedPrompts(limit: number = 10): Promise<PromptPayload[]> {
  try {
    // Use backend proxy server
    const response = await fetch(`${API_BASE_URL}/api/prompts/featured?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Featured prompts failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get featured prompts error:', error);
    
    // Return mock data as fallback
    return getMockFeaturedPrompts(limit);
  }
}

// Get similar prompts
export async function getSimilarPrompts(promptId: string, limit: number = 5): Promise<PromptPayload[]> {
  try {
    // Use backend proxy server
    const response = await fetch(`${API_BASE_URL}/api/prompts/${promptId}/similar?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Similar prompts failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get similar prompts error:', error);
    
    // Return mock data as fallback
    return getMockSimilarPrompts(limit);
  }
}

// Mock data functions for fallback
function getMockSearchResults(params: SearchPromptsRequest): SearchPromptsResponse {
  const mockPrompts = getMockPrompts();
  let filteredPrompts = mockPrompts;
  
  // Apply category filter
  if (params.category && params.category !== 'all') {
    filteredPrompts = filteredPrompts.filter(p => p.category === params.category);
  }
  
  // Apply query filter (simple text search)
  if (params.query) {
    const query = params.query.toLowerCase();
    filteredPrompts = filteredPrompts.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.prompt.toLowerCase().includes(query)
    );
  }
  
  // Apply pagination
  const start = params.offset || 0;
  const limit = params.limit || 20;
  const paginatedPrompts = filteredPrompts.slice(start, start + limit);
  
  return {
    prompts: paginatedPrompts,
    total: filteredPrompts.length,
    hasMore: start + limit < filteredPrompts.length,
  };
}

function getMockFeaturedPrompts(limit: number): PromptPayload[] {
  return getMockPrompts().filter(p => p.featured).slice(0, limit);
}

function getMockSimilarPrompts(limit: number): PromptPayload[] {
  return getMockPrompts().slice(0, limit);
}

function getMockPrompts(): PromptPayload[] {
  return [
    {
      id: '1',
      title: 'Code Review Assistant',
      description: 'A comprehensive prompt for reviewing code quality, security, and best practices',
      prompt: 'Please review the following code for:\n1. Code quality and readability\n2. Security vulnerabilities\n3. Performance optimizations\n4. Best practices adherence\n\nProvide specific suggestions for improvement.',
      category: 'coding',
      tags: ['code-review', 'quality', 'security'],
      difficulty: 'intermediate' as const,
      estimatedTime: '10-15 minutes',
      stars: 245,
      uses: 1200,
      featured: true,
      contributor: 'CodeMaster',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      title: 'Creative Writing Starter',
      description: 'Generate engaging story beginnings with character development',
      prompt: 'Create an engaging opening paragraph for a story that includes:\n1. A compelling protagonist with a clear motivation\n2. An intriguing setting\n3. A hook that makes readers want to continue\n4. Subtle foreshadowing of conflict to come',
      category: 'writing',
      tags: ['creative', 'storytelling', 'fiction'],
      difficulty: 'beginner' as const,
      estimatedTime: '5-10 minutes',
      stars: 189,
      uses: 890,
      featured: true,
      contributor: 'StoryWeaver',
      createdAt: '2024-01-14T14:30:00Z',
      updatedAt: '2024-01-14T14:30:00Z',
    },
    {
      id: '3',
      title: 'Business Strategy Analyzer',
      description: 'Analyze business strategies and provide actionable insights',
      prompt: 'Analyze the following business strategy and provide:\n1. Strengths and weaknesses\n2. Market opportunities and threats\n3. Competitive advantages\n4. Recommended next steps\n5. Potential risks and mitigation strategies',
      category: 'business',
      tags: ['strategy', 'analysis', 'planning'],
      difficulty: 'advanced' as const,
      estimatedTime: '20-30 minutes',
      stars: 156,
      uses: 567,
      featured: false,
      contributor: 'BizAnalyst',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z',
    },
    {
      id: '4',
      title: 'Data Visualization Guide',
      description: 'Create effective data visualizations with clear insights',
      prompt: 'Help me create an effective data visualization by:\n1. Analyzing the data structure and key insights\n2. Recommending the most appropriate chart type\n3. Suggesting color schemes and design elements\n4. Providing clear labels and annotations\n5. Ensuring accessibility and readability',
      category: 'analysis',
      tags: ['data', 'visualization', 'charts'],
      difficulty: 'intermediate' as const,
      estimatedTime: '15-20 minutes',
      stars: 203,
      uses: 734,
      featured: true,
      contributor: 'DataViz Pro',
      createdAt: '2024-01-12T16:45:00Z',
      updatedAt: '2024-01-12T16:45:00Z',
    },
    {
      id: '5',
      title: 'Learning Path Creator',
      description: 'Design personalized learning paths for any subject',
      prompt: 'Create a comprehensive learning path for [SUBJECT] that includes:\n1. Prerequisites and foundational knowledge\n2. Step-by-step progression from beginner to advanced\n3. Recommended resources (books, courses, projects)\n4. Practical exercises and milestones\n5. Assessment methods to track progress',
      category: 'education',
      tags: ['learning', 'curriculum', 'education'],
      difficulty: 'intermediate' as const,
      estimatedTime: '25-30 minutes',
      stars: 178,
      uses: 445,
      featured: false,
      contributor: 'EduDesigner',
      createdAt: '2024-01-11T11:20:00Z',
      updatedAt: '2024-01-11T11:20:00Z',
    },
    {
      id: '6',
      title: 'Brand Voice Generator',
      description: 'Develop consistent brand voice and messaging guidelines',
      prompt: 'Help me develop a brand voice by:\n1. Defining the brand personality and values\n2. Creating tone and style guidelines\n3. Providing example phrases and messaging\n4. Establishing do\'s and don\'ts for communication\n5. Adapting voice for different channels and audiences',
      category: 'creative',
      tags: ['branding', 'marketing', 'voice'],
      difficulty: 'advanced' as const,
      estimatedTime: '30-45 minutes',
      stars: 134,
      uses: 289,
      featured: true,
      contributor: 'BrandGuru',
      createdAt: '2024-01-10T13:10:00Z',
      updatedAt: '2024-01-10T13:10:00Z',
    },
  ];
}

// Update prompt engagement stats
export async function updatePromptStats(promptId: string, action: 'star' | 'use' | 'copy'): Promise<void> {
  try {
    // Use backend proxy server
    await fetch(`${API_BASE_URL}/api/prompts/${promptId}/stats`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });
  } catch (error) {
    console.error('Failed to update prompt stats:', error);
    // Don't throw error for analytics - it shouldn't break the UI
  }
}

// Initialize and migrate data
export async function initializePromptsDatabase(): Promise<void> {
  // Skip initialization in browser environment
  if (typeof window !== 'undefined' || !qdrantService) {
    console.log('Skipping Qdrant initialization in browser environment');
    return;
  }

  try {
    // Initialize Qdrant collection
    await qdrantService.initializeCollection();
    
    // Check if we need to migrate data from markdown
    const collectionInfo = await qdrantService.getCollectionInfo();
    
    if (collectionInfo.points_count === 0) {
      console.log('No prompts found, migrating from markdown...');
      await migrateFromMarkdown();
    }
  } catch (error) {
    console.error('Failed to initialize prompts database:', error);
    throw error;
  }
}

// Migrate existing markdown prompts to Qdrant
async function migrateFromMarkdown(): Promise<void> {
  try {
    // For Node.js environment, we need to read the file differently
    let markdownContent: string;
    
    if (typeof window === 'undefined') {
      // Node.js environment (setup script)
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', 'PROMPTS.md');
      markdownContent = fs.readFileSync(filePath, 'utf-8');
    } else {
      // Browser environment
      const response = await fetch('/PROMPTS.md');
      markdownContent = await response.text();
    }
    
    // Import the parser dynamically
    const { parsePromptsFromMarkdown } = await import('../promptParser.js');
    
    // Parse prompts
    const parsedPrompts = parsePromptsFromMarkdown(markdownContent);
    
    // Convert to Qdrant format
    const { convertMarkdownPromptsToQdrant } = await import('../qdrant.js');
    const qdrantPrompts = convertMarkdownPromptsToQdrant(parsedPrompts);
    
    // Batch insert into Qdrant
    await qdrantService.batchUpsertPrompts(qdrantPrompts);
    
    console.log(`Successfully migrated ${qdrantPrompts.length} prompts to Qdrant`);
  } catch (error) {
    console.error('Failed to migrate prompts from markdown:', error);
    throw error;
  }
}

// Add a new prompt
export async function addPrompt(prompt: Omit<PromptPayload, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const id = `prompt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const fullPrompt = {
      ...prompt,
      id,
      createdAt: now,
      updatedAt: now,
    } as PromptPayload;
    
    await qdrantService.upsertPrompt(fullPrompt);
    return id;
  } catch (error) {
    console.error('Failed to add prompt:', error);
    throw error;
  }
}

// Update an existing prompt
export async function updatePrompt(id: string, updates: Partial<PromptPayload>): Promise<void> {
  try {
    const updatedPrompt: Partial<PromptPayload> = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    // Note: This is a simplified update - in practice, you'd want to fetch the existing prompt first
    // For now, we'll just log the update since we don't have a proper partial update method
    console.log('Updating prompt:', id, updatedPrompt);
  } catch (error) {
    console.error('Failed to update prompt:', error);
    throw error;
  }
}

// Delete a prompt
export async function deletePrompt(id: string): Promise<void> {
  await qdrantService.deletePrompt(id);
}