import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Delete webhook from BigCommerce
    const bcResponse = await fetch(
      `https://api.bigcommerce.com/stores/${storeHash}/v3/hooks/${params.id}`,
      {
        method: 'DELETE',
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
          error: 'Failed to delete webhook from BigCommerce',
          details: responseText
        }),
        { 
          status: bcResponse.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Webhook deletion error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to delete webhook',
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storeHash = request.headers.get('X-Store-Hash');
    const accessToken = request.headers.get('X-Access-Token');
    const body = await request.json();

    if (!storeHash || !accessToken) {
      return new Response(
        JSON.stringify({ error: 'Store credentials are required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Update webhook in BigCommerce
    const bcResponse = await fetch(
      `https://api.bigcommerce.com/stores/${storeHash}/v3/hooks/${params.id}`,
      {
        method: 'PUT',
        headers: {
          'X-Auth-Token': accessToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );

    if (!bcResponse.ok) {
      const responseText = await bcResponse.text();
      return new Response(
        JSON.stringify({ 
          error: 'Failed to update webhook in BigCommerce',
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
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Webhook update error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to update webhook',
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 
