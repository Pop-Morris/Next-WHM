'use client';

import { useState } from 'react';
import { WebhookFormData, Webhook } from '../types/types';
import { createWebhook } from '../utils/bigcommerce';

interface WebhookFormProps {
  onWebhookCreated: (webhook: Webhook) => void;
}

export default function WebhookForm({ onWebhookCreated }: WebhookFormProps) {
  const [formData, setFormData] = useState<WebhookFormData>({
    scope: '',
    destination: '',
    events: [],
    headers: {},
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const storeHash = 'your-store-hash';
      const accessToken = 'your-access-token';

      const webhook = await createWebhook(storeHash, accessToken, formData);
      onWebhookCreated(webhook);
      setFormData({ scope: '', destination: '', events: [], headers: {} });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create webhook');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Scope
        </label>
        <input
          type="text"
          value={formData.scope}
          onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          placeholder="Enter scope"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Destination URL
        </label>
        <input
          type="url"
          value={formData.destination}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          placeholder="https://your-webhook-url.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Events
        </label>
        <input
          type="text"
          value={formData.events.join(', ')}
          onChange={(e) => setFormData({ ...formData, events: e.target.value.split(',').map(s => s.trim()) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          placeholder="Enter events separated by commas"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors font-medium"
      >
        {loading ? 'Creating...' : 'Create Webhook'}
      </button>
    </form>
  );
} 