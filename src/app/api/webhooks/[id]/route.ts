import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  id: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams }
): Promise<NextResponse> {
  try {
    const storeHash = request.headers.get('X-Store-Hash');
    const accessToken = request.headers.get('X-Access-Token');

    if (!storeHash || !accessToken) {
      return NextResponse.json(
        { error: 'Store credentials are required' },
        { status: 400 }
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
      return NextResponse.json(
        { 
          error: 'Failed to delete webhook from BigCommerce',
          details: responseText
        },
        { status: bcResponse.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Webhook deletion error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete webhook',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams }
): Promise<NextResponse> {
  try {
    const storeHash = request.headers.get('X-Store-Hash');
    const accessToken = request.headers.get('X-Access-Token');
    const body = await request.json();

    if (!storeHash || !accessToken) {
      return NextResponse.json(
        { error: 'Store credentials are required' },
        { status: 400 }
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
      return NextResponse.json(
        { 
          error: 'Failed to update webhook in BigCommerce',
          details: responseText
        },
        { status: bcResponse.status }
      );
    }

    const webhook = await bcResponse.json();
    return NextResponse.json(webhook.data, { status: 200 });
  } catch (error) {
    console.error('Webhook update error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update webhook',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 