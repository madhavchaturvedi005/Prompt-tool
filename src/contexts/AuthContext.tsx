import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, type AuthUser } from '@/lib/auth';
import { supabase, SupabaseService } from '@/lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, username: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  savePrompt: (promptData: {
    prompt_id: string;
    prompt_title: string;
    prompt_text: string;
    prompt_description?: string;
    category?: string;
    tags?: string[];
  }) => Promise<boolean>;
  unsavePrompt: (promptId: string) => Promise<boolean>;
  isPromptSaved: (promptId: string) => boolean;
  refreshSavedPrompts: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        // Check if user is coming from email confirmation
        const urlParams = new URLSearchParams(window.location.search);
        const isConfirmed = urlParams.get('confirmed');
        
        if (isConfirmed) {
          // Clear the URL parameter
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        const userData = await authService.getCurrentSession();
        if (userData) {
          // Load saved prompts
          const savedPrompts = await authService.getUserSavedPrompts(userData.id);
          setUser({ ...userData, savedPrompts });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes (for email confirmation)
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        // Always set loading to false when auth state changes
        setLoading(false);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // User confirmed email or signed in
          const userData: AuthUser = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
            username: session.user.user_metadata?.username || session.user.email!.split('@')[0],
            avatar_url: session.user.user_metadata?.avatar_url,
            savedPrompts: []
          };
          
          // Set user immediately
          setUser(userData);
          
          // Load saved prompts in background (don't block)
          authService.getUserSavedPrompts(userData.id)
            .then(savedPrompts => {
              setUser(prev => prev ? { ...prev, savedPrompts } : null);
            })
            .catch(error => {
              console.error('Error loading saved prompts:', error);
            });
          
          // Create user profile if it doesn't exist (for email confirmed users)
          if (event === 'SIGNED_IN' && session.user.email_confirmed_at) {
            try {
              await SupabaseService.createUser({
                email: userData.email,
                username: userData.username,
                full_name: userData.name,
                password_hash: 'supabase_auth'
              });

              // Award welcome points
              await SupabaseService.addPoints({
                user_id: userData.id,
                  points: 50,
                  transaction_type: 'earned',
                  source_type: 'admin',
                  title: 'Welcome to PromptLab!',
                  description: 'Welcome bonus for joining PromptLab'
                });
              } catch (profileError) {
                console.log('Profile creation skipped (may already exist)');
              }
            }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.user) {
        // Set user immediately without waiting for saved prompts
        setUser({ ...response.user, savedPrompts: [] });
        
        // Load saved prompts in background (don't block login)
        authService.getUserSavedPrompts(response.user.id)
          .then(savedPrompts => {
            setUser(prev => prev ? { ...prev, savedPrompts } : null);
          })
          .catch(error => {
            console.error('Failed to load saved prompts:', error);
            // Continue anyway - user is still logged in
          });
        
        return true;
      }
      
      // Don't return false for email verification issues - let the UI handle it
      if (response.requiresConfirmation) {
        return false; // UI will check the specific error
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string, username: string): Promise<boolean> => {
    try {
      const response = await authService.register({
        email,
        password,
        full_name: name,
        username
      });
      
      if (response.success && response.user) {
        // Check if email confirmation is required
        if (response.requiresConfirmation) {
          // Email confirmation required - don't set user yet
          // The signup page will handle showing the confirmation message
          return true; // Return true to indicate successful signup (even if confirmation needed)
        } else {
          // Email confirmation disabled, user is immediately active
          const savedPrompts = await authService.getUserSavedPrompts(response.user.id);
          const userWithPrompts = { ...response.user, savedPrompts };
          setUser(userWithPrompts);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const savePrompt = async (promptData: {
    prompt_id: string;
    prompt_title: string;
    prompt_text: string;
    prompt_description?: string;
    category?: string;
    tags?: string[];
  }): Promise<boolean> => {
    if (!user) return false;

    try {
      const success = await authService.savePrompt(user.id, promptData);
      if (success) {
        // Update local state
        const updatedUser = {
          ...user,
          savedPrompts: [...user.savedPrompts, promptData.prompt_id]
        };
        setUser(updatedUser);
      }
      return success;
    } catch (error) {
      console.error('Save prompt error:', error);
      return false;
    }
  };

  const unsavePrompt = async (promptId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const success = await authService.unsavePrompt(user.id, promptId);
      if (success) {
        // Update local state
        const updatedUser = {
          ...user,
          savedPrompts: user.savedPrompts.filter(id => id !== promptId)
        };
        setUser(updatedUser);
      }
      return success;
    } catch (error) {
      console.error('Unsave prompt error:', error);
      return false;
    }
  };

  const isPromptSaved = (promptId: string): boolean => {
    return user?.savedPrompts.includes(promptId) || false;
  };

  const refreshSavedPrompts = async (): Promise<void> => {
    if (!user) return;

    try {
      const savedPrompts = await authService.getUserSavedPrompts(user.id);
      setUser({ ...user, savedPrompts });
    } catch (error) {
      console.error('Refresh saved prompts error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    loading,
    savePrompt,
    unsavePrompt,
    isPromptSaved,
    refreshSavedPrompts
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};