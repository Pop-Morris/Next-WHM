'use client';

import { useState } from 'react';
import WebhookForm from './WebhookForm';
import WebhookList from './WebhookList';
import type { Webhook } from '../types/types';

export default function DashboardContent() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create Webhook</h2>
        <WebhookForm onWebhookCreated={(webhook) => setWebhooks([...webhooks, webhook])} />
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Active Webhooks</h2>
        <WebhookList webhooks={webhooks} />
      </div>
    </div>
  );
} 