'use client';

import { Webhook } from '../types/types';

interface WebhookListProps {
  webhooks: Webhook[];
}

export default function WebhookList({ webhooks }: WebhookListProps) {
  if (webhooks.length === 0) {
    return <p className="text-gray-500">No webhooks found.</p>;
  }

  return (
    <div className="space-y-4">
      {webhooks.map((webhook) => (
        <div
          key={webhook.id}
          className="border rounded-lg p-4 hover:bg-gray-50"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{webhook.scope}</h3>
              <p className="text-sm text-gray-600">{webhook.destination}</p>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                webhook.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {webhook.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="mt-2">
            <h4 className="text-sm font-medium">Events:</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {webhook.events.map((event, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {event}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 