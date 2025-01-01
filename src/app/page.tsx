'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Credentials {
  storeHash: string;
  accessToken: string;
}

interface UserForm {
  email: string;
  password: string;
}

export default function Home() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [storeHash, setStoreHash] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [user, setUser] = useState(null);
  const [userForm, setUserForm] = useState<UserForm>({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `${isLogin ? 'Login' : 'Registration'} failed`);
      }

      setUser(data);
      setError('');
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : `${isLogin ? 'Login' : 'Registration'} failed`);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Sending password reset request for:', userForm.email); // Debug log

      const response = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userForm.email }),
      });

      // Debug logs
      console.log('Response status:', response.status);
      const text = await response.text();
      console.log('Response text:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Password reset request failed');
      }

      setResetSuccess(true);
      setError('');
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err instanceof Error ? err.message : 'Password reset request failed');
    }
  };

  const handleStoreConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setCredentials({ storeHash, accessToken });
    localStorage.setItem('bigcommerce_credentials', JSON.stringify({ storeHash, accessToken }));
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              {isResetMode ? 'Reset Password' : (isLogin ? 'Login' : 'Register')}
            </h1>
            
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {resetSuccess && (
              <p className="text-green-500 mb-4">
                If an account exists with this email, you will receive password reset instructions.
              </p>
            )}

            <form onSubmit={isResetMode ? handlePasswordReset : handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900"
                  required
                />
              </div>

              {!isResetMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900"
                    required={!isResetMode}
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                {isResetMode ? 'Send Reset Link' : (isLogin ? 'Login' : 'Register')}
              </button>
            </form>

            <div className="mt-4 text-center text-gray-600">
              {isResetMode ? (
                <button
                  onClick={() => {
                    setIsResetMode(false);
                    setResetSuccess(false);
                    setError('');
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Back to Login
                </button>
              ) : (
                <>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                    }}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    {isLogin ? 'Register' : 'Login'}
                  </button>
                  <br />
                  <button
                    onClick={() => {
                      setIsResetMode(true);
                      setError('');
                    }}
                    className="text-blue-500 hover:text-blue-600 mt-2"
                  >
                    Forgot Password?
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            BigCommerce Webhook Manager
          </h1>
          <p className="text-gray-600 mb-8">
            Create and manage your BigCommerce webhooks with ease
          </p>

          {!credentials ? (
            <form onSubmit={handleStoreConnect} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Hash
                </label>
                <input
                  type="text"
                  value={storeHash}
                  onChange={(e) => setStoreHash(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900"
                  placeholder="Enter your store hash"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Token
                </label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900"
                  placeholder="Enter your access token"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Connect to Store
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-green-600">Successfully connected to store!</p>
              <Link 
                href="/dashboard" 
                className="inline-block bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 