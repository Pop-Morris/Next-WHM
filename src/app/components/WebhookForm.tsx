'use client';

import { useState } from 'react';
import { WebhookFormData, Webhook, WEBHOOK_SCOPE_GROUPS, WebhookScope } from '../types/types';

interface HeaderInput {
  key: string;
  value: string;
}

interface WebhookFormProps {
  credentials: { storeHash: string; accessToken: string };
  onWebhookCreated: (webhook: Webhook) => void;
}

export default function WebhookForm({ credentials, onWebhookCreated }: WebhookFormProps) {
  const [formData, setFormData] = useState<Omit<WebhookFormData, 'events'>>({
    scope: 'store/cart/created',
    destination: '',
    headers: {},
    is_active: true,
  });
  
  const [headers, setHeaders] = useState<HeaderInput[]>([{ key: '', value: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);

    // Update formData.headers
    const headerObject = newHeaders.reduce((acc, { key, value }) => {
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    setFormData(prev => ({ ...prev, headers: headerObject }));
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
    
    // Update formData.headers
    const headerObject = newHeaders.reduce((acc, { key, value }) => {
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    setFormData(prev => ({ ...prev, headers: headerObject }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          storeHash: credentials.storeHash,
          accessToken: credentials.accessToken,
          events: [formData.scope]
        }),
      });

      if (response.status === 401) {
        throw new Error('Invalid credentials. Please check your store hash and access token.');
      }

      if (response.status === 400) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid webhook configuration. Please check your inputs.');
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.details || 'Failed to create webhook');
      }

      const webhook = await response.json();
      onWebhookCreated(webhook);
      
      // Reset form
      setFormData({
        scope: 'store/cart/created',
        destination: '',
        headers: {},
        is_active: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create webhook');
    } finally {
      setLoading(false);
    }
  };

  const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ErrorDisplay message={error} />}

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">
          Scope
        </label>
        <select
          value={formData.scope}
          onChange={(e) => setFormData({ ...formData, scope: e.target.value as WebhookScope })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   text-gray-900 text-base bg-white"
          disabled={loading}
          required
        >
          {Object.entries(WEBHOOK_SCOPE_GROUPS).map(([group, scopes]) => (
            <optgroup key={group} label={group} className="font-medium">
              {scopes.map((scope) => (
                <option key={scope} value={scope} className="text-gray-900">
                  {scope}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">
          Destination URL
        </label>
        <input
          type="url"
          value={formData.destination}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          placeholder="https://your-webhook-url.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   text-gray-900 text-base"
          disabled={loading}
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-bold text-gray-900">
            Custom Headers (Optional)
          </label>
          <button
            type="button"
            onClick={addHeader}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            + Add Header
          </button>
        </div>
        
        {headers.map((header, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                type="text"
                value={header.key}
                onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                placeholder="Header name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         text-gray-900 text-sm"
                disabled={loading}
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={header.value}
                onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                placeholder="Header value"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         text-gray-900 text-sm"
                disabled={loading}
              />
            </div>
            {headers.length > 1 && (
              <button
                type="button"
                onClick={() => removeHeader(index)}
                disabled={loading}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 
                         transition-colors disabled:opacity-50"
                title="Remove header"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between py-2">
        <label className="text-sm font-bold text-gray-900">
          Active Status
        </label>
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${formData.is_active ? 'bg-blue-600' : 'bg-gray-300'}
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
              ${formData.is_active ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 text-base font-medium text-white bg-blue-600 
                 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none 
                 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                 disabled:bg-blue-300 disabled:cursor-not-allowed
                 transition-colors duration-200"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </span>
        ) : (
          'Create Webhook'
        )}
      </button>
    </form>
  );
} 