'use client';

import { useState } from 'react';
import WebhookForm from './WebhookForm';
import WebhookList from './WebhookList';
import type { Webhook } from '../types/types';

interface StoreCredentials {
  storeHash: string;
  accessToken: string;
}

export default function DashboardContent() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [credentials, setCredentials] = useState<StoreCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleStoreConnect = (newCredentials: StoreCredentials) => {
    setCredentials(newCredentials);
    setError(null);
  };

  const handleWebhookCreated = (webhook: Webhook) => {
    setWebhooks([...webhooks, webhook]);
  };

  const handleWebhookDeleted = (webhookId: number) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== webhookId));
  };

  const handleWebhookUpdated = (updatedWebhook: Webhook) => {
    setWebhooks(webhooks.map(webhook => 
      webhook.id === updatedWebhook.id ? updatedWebhook : webhook
    ));
  };

  const syncWebhooks = async (credentials: StoreCredentials) => {
    try {
      setError(null);
      setIsSyncing(true);

      const response = await fetch('/api/webhooks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Store-Hash': credentials.storeHash,
          'X-Access-Token': credentials.accessToken
        }
      });

      if (response.status === 401) {
        setError('Invalid credentials. Please check your store hash and access token.');
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.details || 'Failed to fetch webhooks');
      }

      const webhooks = await response.json();
      setWebhooks(webhooks);
    } catch (error) {
      console.error('Error syncing webhooks:', error);
      setError(error instanceof Error ? error.message : 'Failed to sync webhooks');
    } finally {
      setIsSyncing(false);
    }
  };

  const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            {message}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {!credentials ? (
        // When no credentials, show single centered panel
        <div className="max-w-md mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Credentials</h2>
            <StoreCredentialsForm onConnect={handleStoreConnect} />
          </div>
        </div>
      ) : (
        // When credentials provided, show two-column layout
        <div className="space-y-4">
          {error && <ErrorDisplay message={error} />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Create Webhook</h2>
                  <button
                    onClick={() => {
                      setCredentials(null);
                      setWebhooks([]);
                      setError(null);
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Change Store
                  </button>
                </div>
                <WebhookForm 
                  credentials={credentials}
                  onWebhookCreated={handleWebhookCreated}
                />
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Active Webhooks</h2>
                <button
                  onClick={() => syncWebhooks(credentials)}
                  disabled={isSyncing}
                  className={`px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800
                           bg-blue-50 hover:bg-blue-100 rounded-md transition-colors
                           flex items-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSyncing ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Syncing...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Sync Webhooks
                    </>
                  )}
                </button>
              </div>
              <WebhookList 
                webhooks={webhooks} 
                credentials={credentials}
                onWebhookDeleted={handleWebhookDeleted}
                onWebhookUpdated={handleWebhookUpdated}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// New component for store credentials
function StoreCredentialsForm({ onConnect }: { onConnect: (creds: StoreCredentials) => void }) {
  const [formData, setFormData] = useState<StoreCredentials>({
    storeHash: '',
    accessToken: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clean up store hash (remove 'stores/' prefix if present)
    const cleanStoreHash = formData.storeHash.replace('stores/', '');
    onConnect({ ...formData, storeHash: cleanStoreHash });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">
          Store Hash
        </label>
        <input
          type="text"
          value={formData.storeHash}
          onChange={(e) => setFormData({ ...formData, storeHash: e.target.value })}
          placeholder="Enter your store hash"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   text-gray-900 text-base"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">
          Access Token
        </label>
        <input
          type="password"
          value={formData.accessToken}
          onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   text-gray-900 text-base"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-base font-medium text-white bg-blue-600 
                 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none 
                 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Connect Store
      </button>
    </form>
  );
} 