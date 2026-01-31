import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export default function TestSupabase() {
  const { user } = useAuth();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const configured = isSupabaseConfigured();
      const hasClient = !!supabase;
      const hasAdmin = !!supabaseAdmin;
      
      // Try a simple query with admin client
      const client = supabaseAdmin || supabase;
      if (client) {
        const { data, error: queryError } = await client
          .from('users')
          .select('count')
          .limit(1);
        
        setResult({ 
          configured, 
          hasClient,
          hasAdmin,
          usingAdmin: !!supabaseAdmin,
          canQuery: !queryError,
          queryError: queryError?.message,
          message: configured ? 'Supabase is configured!' : 'Supabase NOT configured' 
        });
      } else {
        setResult({ configured, hasClient, hasAdmin, message: 'Supabase client not created' });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testDirectInsert = async () => {
    if (!user) {
      setError('No user logged in');
      return;
    }

    const client = supabaseAdmin || supabase;
    if (!client) {
      setError('Supabase client not initialized');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // Add timeout
    const timeoutId = setTimeout(() => {
      setError({ message: 'Request timed out after 10 seconds', timeout: true });
      setLoading(false);
    }, 10000);

    try {
      console.log('=== Starting Test ===');
      console.log('User ID:', user.id);
      console.log('User ID type:', typeof user.id);
      console.log('Using admin client:', !!supabaseAdmin);
      console.log('Client exists:', !!client);
      
      const insertData = {
        user_id: user.id,
        points: 100,
        transaction_type: 'earned',
        source_type: 'challenge',
        source_id: null,
        title: 'Test Challenge Completion',
        description: 'This is a test transaction',
        metadata: {
          test: true,
          timestamp: new Date().toISOString()
        }
      };

      console.log('Insert data prepared:', insertData);
      console.log('About to call Supabase insert...');

      const startTime = Date.now();
      const { data, error: insertError } = await client
        .from('point_transactions')
        .insert([insertData])
        .select()
        .single();
      
      const endTime = Date.now();
      console.log(`Insert completed in ${endTime - startTime}ms`);

      clearTimeout(timeoutId);

      if (insertError) {
        console.error('Insert error:', insertError);
        setError({
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code
        });
      } else {
        setResult({ success: true, data, usedAdmin: !!supabaseAdmin, duration: endTime - startTime });
        console.log('Insert successful:', data);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('Test failed with exception:', err);
      setError({
        message: err.message,
        name: err.name,
        stack: err.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const testGetActivity = async () => {
    if (!user) {
      setError('No user logged in');
      return;
    }

    const client = supabaseAdmin || supabase;
    if (!client) {
      setError('Supabase client not initialized');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error: queryError } = await client
        .from('point_transactions')
        .select('*')
        .eq('user_id', user.id)
        .gt('points', 0)
        .order('created_at', { ascending: false })
        .limit(10);

      if (queryError) {
        setError({
          message: queryError.message,
          details: queryError.details,
          hint: queryError.hint,
          code: queryError.code
        });
      } else {
        setResult({ activities: data, count: data?.length || 0, usedAdmin: !!supabaseAdmin });
      }
    } catch (err: any) {
      setError({
        message: err.message,
        stack: err.stack
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>

        {!user && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
            <p className="text-amber-400">Please sign in to test database operations</p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          <Button onClick={testConnection} disabled={loading} className="w-full">
            Test Connection
          </Button>
          
          <Button onClick={testDirectInsert} disabled={loading || !user} className="w-full">
            Test Direct Insert (point_transactions)
          </Button>

          <Button onClick={testGetActivity} disabled={loading || !user} className="w-full">
            Test Get Activity (point_transactions)
          </Button>
        </div>

        {loading && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <p className="text-blue-400">Loading...</p>
            <p className="text-sm text-muted-foreground mt-2">Check browser console (F12) for detailed logs</p>
          </div>
        )}

        {result && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-6">
            <h3 className="text-emerald-400 font-semibold mb-2">Success!</h3>
            <pre className="text-sm text-foreground overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <h3 className="text-red-400 font-semibold mb-2">Error</h3>
            <pre className="text-sm text-foreground overflow-auto max-h-96">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-muted/30 rounded-lg p-6">
          <h3 className="font-semibold mb-4">Debug Info:</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Supabase Configured:</strong> {isSupabaseConfigured() ? 'Yes' : 'No'}</p>
            <p><strong>Supabase Client:</strong> {supabase ? 'Created' : 'Not Created'}</p>
            <p><strong>Supabase Admin:</strong> {supabaseAdmin ? 'Created' : 'Not Created'}</p>
            <p><strong>User Logged In:</strong> {user ? 'Yes' : 'No'}</p>
            {user && (
              <div className="mt-4">
                <p><strong>User Info:</strong></p>
                <pre className="text-xs overflow-auto mt-2 bg-muted/50 p-2 rounded">
                  {JSON.stringify({ id: user.id, email: user.email, username: user.username }, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
