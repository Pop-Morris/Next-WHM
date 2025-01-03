'use client';

import { useState } from 'react';
import { Webhook, WebhookScope, WEBHOOK_SCOPE_GROUPS } from '../types/types';

interface HeaderInput {
  key: string;
  value: string;
}

interface WebhookListProps {
  webhooks: Webhook[];
  credentials: { storeHash: string; accessToken: string };
  onWebhookDeleted: (webhookId: number) => void;
  onWebhookUpdated: (webhook: Webhook) => void;
}

export default function WebhookList({ webhooks, credentials, onWebhookDeleted, onWebhookUpdated }: WebhookListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Webhook>>({});
  const [headers, setHeaders] = useState<HeaderInput[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async (webhookId: number) => {
    setDeletingId(webhookId);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(`/api/webhooks/${deletingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Store-Hash': credentials.storeHash,
          'X-Access-Token': credentials.accessToken,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete webhook');
      }

      onWebhookDeleted(deletingId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete webhook');
    } finally {
      setIsDeleting(false);
      setShowConfirmation(false);
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (webhook: Webhook) => {
    try {
      setError(null);
      setUpdatingId(webhook.id);

      const response = await fetch(`/api/webhooks/${webhook.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Store-Hash': credentials.storeHash,
          'X-Access-Token': credentials.accessToken,
        },
        body: JSON.stringify({
          is_active: !webhook.is_active
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update webhook');
      }

      const updatedWebhook = await response.json();
      onWebhookUpdated(updatedWebhook);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update webhook');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleEdit = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setEditFormData({
      scope: webhook.scope,
      destination: webhook.destination,
      headers: webhook.headers || {},
    });
    // Convert headers object to array format for editing
    setHeaders(
      webhook.headers
        ? Object.entries(webhook.headers).map(([key, value]) => ({ key, value }))
        : [{ key: '', value: '' }]
    );
  };

  const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);

    // Update editFormData.headers
    const headerObject = newHeaders.reduce((acc, { key, value }) => {
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    setEditFormData(prev => ({ ...prev, headers: headerObject }));
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
    
    const headerObject = newHeaders.reduce((acc, { key, value }) => {
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    setEditFormData(prev => ({ ...prev, headers: headerObject }));
  };

  const handleSaveEdit = async () => {
    if (!editingWebhook) return;

    try {
      setIsEditing(true);
      setError(null);

      const response = await fetch(`/api/webhooks/${editingWebhook.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Store-Hash': credentials.storeHash,
          'X-Access-Token': credentials.accessToken,
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update webhook');
      }

      const updatedWebhook = await response.json();
      onWebhookUpdated(updatedWebhook);
      setEditingWebhook(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update webhook');
    } finally {
      setIsEditing(false);
    }
  };

  if (webhooks.length === 0) {
    return <p className="text-gray-500">No webhooks found.</p>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {webhooks.map((webhook) => (
        <div
          key={webhook.id}
          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0 flex-1">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm font-medium">
                    {webhook.scope}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    ID: {webhook.id}
                  </span>
                </div>
                <p className="text-gray-700 break-all text-sm line-clamp-2 hover:line-clamp-none transition-all">
                  {webhook.destination}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <button
                type="button"
                onClick={() => handleToggleActive(webhook)}
                disabled={updatingId === webhook.id}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${webhook.is_active ? 'bg-blue-600' : 'bg-gray-300'}
                  ${updatingId === webhook.id ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                title={webhook.is_active ? 'Deactivate webhook' : 'Activate webhook'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
                    ${webhook.is_active ? 'translate-x-6' : 'translate-x-1'}
                    ${updatingId === webhook.id ? 'animate-pulse' : ''}`}
                />
              </button>
              <button
                onClick={() => handleEdit(webhook)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-50 transition-colors"
                title="Edit webhook"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(webhook.id)}
                className="text-gray-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                title="Delete webhook"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editingWebhook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit Webhook</h3>
              <button
                onClick={() => setEditingWebhook(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scope
                </label>
                <select
                  value={editFormData.scope}
                  onChange={(e) => setEditFormData({ ...editFormData, scope: e.target.value as WebhookScope })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           text-gray-900 text-base bg-white"
                  disabled={isEditing}
                >
                  {Object.entries(WEBHOOK_SCOPE_GROUPS).map(([group, scopes]) => (
                    <optgroup key={group} label={group}>
                      {scopes.map((scope) => (
                        <option key={scope} value={scope}>
                          {scope}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination URL
                </label>
                <input
                  type="url"
                  value={editFormData.destination}
                  onChange={(e) => setEditFormData({ ...editFormData, destination: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           text-gray-900 text-base"
                  disabled={isEditing}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Custom Headers
                  </label>
                  <button
                    type="button"
                    onClick={addHeader}
                    disabled={isEditing}
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
                        disabled={isEditing}
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
                        disabled={isEditing}
                      />
                    </div>
                    {headers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHeader(index)}
                        disabled={isEditing}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 
                                 transition-colors disabled:opacity-50"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingWebhook(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                         hover:bg-gray-200 rounded-md transition-colors"
                disabled={isEditing}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isEditing}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                         hover:bg-blue-700 rounded-md transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center gap-2"
              >
                {isEditing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this webhook? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800
                         bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 
                         hover:bg-red-700 rounded-md transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete Webhook'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 