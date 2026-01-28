import { useState, useEffect, useCallback } from 'react';
import { 
  searchPrompts, 
  getFeaturedPrompts, 
  getSimilarPrompts,
  updatePromptStats,
  type SearchPromptsRequest,
  type SearchPromptsResponse,
} from '@/lib/api/prompts';
import type { PromptPayload } from '@/lib/qdrant';

export interface UsePromptsOptions {
  query?: string;
  category?: string;
  tags?: string[];
  difficulty?: string;
  featured?: boolean;
  contributor?: string;
  limit?: number;
  autoSearch?: boolean;
}

export interface UsePromptsReturn {
  prompts: PromptPayload[];
  featuredPrompts: PromptPayload[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  
  // Actions
  search: (newQuery?: string) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  getSimilar: (promptId: string) => Promise<PromptPayload[]>;
  trackUsage: (promptId: string, action: 'star' | 'use' | 'copy') => Promise<void>;
}

export function usePrompts(options: UsePromptsOptions = {}): UsePromptsReturn {
  const {
    query = '',
    category,
    tags,
    difficulty,
    featured,
    contributor,
    limit = 20,
    autoSearch = true,
  } = options;

  const [prompts, setPrompts] = useState<PromptPayload[]>([]);
  const [featuredPrompts, setFeaturedPrompts] = useState<PromptPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);

  // Search function
  const search = useCallback(async (newQuery?: string) => {
    setLoading(true);
    setError(null);
    setOffset(0);

    try {
      const searchParams: SearchPromptsRequest = {
        query: newQuery !== undefined ? newQuery : query,
        category,
        tags,
        difficulty,
        featured,
        contributor,
        limit,
        offset: 0,
      };

      const result: SearchPromptsResponse = await searchPrompts(searchParams);
      
      setPrompts(result.prompts);
      setTotal(result.total);
      setHasMore(result.hasMore);
      setOffset(result.prompts.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search prompts';
      console.error('Search error:', err);
      setError(errorMessage);
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  }, [query, category, tags, difficulty, featured, contributor, limit]);

  // Load more function for pagination
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const searchParams: SearchPromptsRequest = {
        query,
        category,
        tags,
        difficulty,
        featured,
        contributor,
        limit,
        offset,
      };

      const result: SearchPromptsResponse = await searchPrompts(searchParams);
      
      setPrompts(prev => [...prev, ...result.prompts]);
      setHasMore(result.hasMore);
      setOffset(prev => prev + result.prompts.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more prompts');
    } finally {
      setLoading(false);
    }
  }, [query, category, tags, difficulty, featured, contributor, limit, offset, loading, hasMore]);

  // Refresh function
  const refresh = useCallback(async () => {
    await search();
  }, [search]);

  // Get similar prompts
  const getSimilar = useCallback(async (promptId: string): Promise<PromptPayload[]> => {
    try {
      return await getSimilarPrompts(promptId);
    } catch (err) {
      console.error('Failed to get similar prompts:', err);
      return [];
    }
  }, []);

  // Track usage analytics
  const trackUsage = useCallback(async (promptId: string, action: 'star' | 'use' | 'copy') => {
    try {
      await updatePromptStats(promptId, action);
      
      // Optimistically update local state
      setPrompts(prev => prev.map(prompt => {
        if (prompt.id === promptId) {
          const updated = { ...prompt };
          if (action === 'use') updated.uses += 1;
          if (action === 'star') updated.stars += 1;
          return updated;
        }
        return prompt;
      }));
    } catch (err) {
      console.error('Failed to track usage:', err);
    }
  }, []);

  // Load featured prompts
  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const featured = await getFeaturedPrompts(10);
        setFeaturedPrompts(featured);
      } catch (err) {
        console.error('Failed to load featured prompts:', err);
      }
    };

    loadFeatured();
  }, []);

  // Auto-search on options change with debouncing for search queries
  useEffect(() => {
    if (!autoSearch) return;

    // Debounce search queries to avoid too many API calls
    if (query && query.trim()) {
      const timeoutId = setTimeout(() => {
        search();
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    } else {
      // For non-search queries (category changes, etc.), search immediately
      search();
    }
  }, [query, category, tags, difficulty, featured, contributor, autoSearch]);

  return {
    prompts,
    featuredPrompts,
    loading,
    error,
    hasMore,
    total,
    search,
    loadMore,
    refresh,
    getSimilar,
    trackUsage,
  };
}

// Specialized hook for featured prompts only
export function useFeaturedPrompts(limit: number = 10) {
  const [prompts, setPrompts] = useState<PromptPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        setLoading(true);
        const featured = await getFeaturedPrompts(limit);
        setPrompts(featured);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load featured prompts');
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, [limit]);

  return { prompts, loading, error };
}

// Hook for similar prompts
export function useSimilarPrompts(promptId: string | null, limit: number = 5) {
  const [prompts, setPrompts] = useState<PromptPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!promptId) {
      setPrompts([]);
      return;
    }

    const loadSimilar = async () => {
      try {
        setLoading(true);
        const similar = await getSimilarPrompts(promptId, limit);
        setPrompts(similar);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load similar prompts');
      } finally {
        setLoading(false);
      }
    };

    loadSimilar();
  }, [promptId, limit]);

  return { prompts, loading, error };
}