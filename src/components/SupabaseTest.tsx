import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const SupabaseTest: React.FC = () => {
  const { user, signIn, signOut } = useAuth();
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    // Test Supabase connection
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (error) {
          setTestResult(`Connection Error: ${error.message}`);
        } else {
          setTestResult('✅ Supabase connection successful!');
        }
      } catch (err) {
        setTestResult(`❌ Connection failed: ${err}`);
      }
    };

    testConnection();
  }, []);

  const handleTestSignIn = async () => {
    const { error } = await signIn('test@example.com', 'password123');
    if (error) {
      setTestResult(`Auth Error: ${error.message}`);
    } else {
      setTestResult('✅ Authentication working!');
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Supabase Connection Test</h3>
      <p className="mb-2">{testResult}</p>
      <p className="mb-2">User: {user ? user.email : 'Not signed in'}</p>
      <div className="space-x-2">
        <button
          onClick={handleTestSignIn}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Sign In
        </button>
        <button
          onClick={signOut}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default SupabaseTest;
