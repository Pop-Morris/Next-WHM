import { NextResponse } from 'next/server';
import type { WebhookFormData } from '@/app/types/types';

export async function POST(request: Request) {
  try {
    const { storeHash, accessToken, ...webhookData } = await request.json() as WebhookFormData & {
      storeHash: string;
      accessToken: string;
    };

    // Create webhook in BigCommerce
    const bcResponse = await fetch(
      `https://api.bigcommerce.com/stores/${storeHash}/v3/hooks`,
      {
        method: 'POST',
        headers: {
          'X-Auth-Token': accessToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          scope: webhookData.scope,
          destination: webhookData.destination,
          is_active: webhookData.is_active,
          events: [webhookData.scope] // Use scope as the event
        })
      }
    );

    if (!bcResponse.ok) {
      const responseText = await bcResponse.text();
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create webhook in BigCommerce',
          details: responseText
        }),
        { 
          status: bcResponse.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const webhook = await bcResponse.json();
    return new Response(
      JSON.stringify(webhook.data),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Webhook creation error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to create webhook',
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Get store credentials from headers
    const storeHash = request.headers.get('X-Store-Hash');
    const accessToken = request.headers.get('X-Access-Token');

    if (!storeHash || !accessToken) {
      return new Response(
        JSON.stringify({ error: 'Store credentials are required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Fetch webhooks from BigCommerce
    const bcResponse = await fetch(
      `https://api.bigcommerce.com/stores/${storeHash}/v3/hooks`,
      {
        method: 'GET',
        headers: {
          'X-Auth-Token': accessToken,
          'Accept': 'application/json'
        }
      }
    );

    if (!bcResponse.ok) {
      const responseText = await bcResponse.text();
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch webhooks from BigCommerce',
          details: responseText
        }),
        { 
          status: bcResponse.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const webhooks = await bcResponse.json();
    return new Response(
      JSON.stringify(webhooks.data),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Webhook fetch error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch webhooks',
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 