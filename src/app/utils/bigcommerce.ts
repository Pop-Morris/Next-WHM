import type { Webhook, WebhookFormData } from '../types/types';

const BIGCOMMERCE_API_URL = 'https://api.bigcommerce.com/stores';

export async function fetchWebhooks(storeHash: string, accessToken: string): Promise<Webhook[]> {
  const response = await fetch(
    `${BIGCOMMERCE_API_URL}/${storeHash}/v3/hooks`,
    {
      headers: {
        'X-Auth-Token': accessToken,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch webhooks');
  }

  const data = await response.json();
  return data.data;
}

export async function createWebhook(
  storeHash: string,
  accessToken: string,
  webhookData: WebhookFormData
): Promise<Webhook> {
  const response = await fetch(
    `${BIGCOMMERCE_API_URL}/${storeHash}/v3/hooks`,
    {
      method: 'POST',
      headers: {
        'X-Auth-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create webhook');
  }

  const data = await response.json();
  return data.data;
} 