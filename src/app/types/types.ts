export interface Store {
    id: string;
    storeHash: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ActiveStore extends Store {
    accessToken: string;
  }
  
  export interface Webhook {
    id: number;
    scope: WebhookScope;
    destination: string;
    headers?: Record<string, string>;
    events?: string[];
    is_active: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface WebhookFormData {
    scope: WebhookScope;
    destination: string;
    events: string[];
    headers?: Record<string, string>;
    is_active: boolean;
  } 
  
  // BigCommerce supported scopes
  export const WEBHOOK_SCOPES = [
    // Cart
    'store/cart/created',
    'store/cart/updated',
    'store/cart/deleted',
    // Order
    'store/order/created',
    'store/order/updated',
    'store/order/statusUpdated',
    'store/order/archived',
    // Customer
    'store/customer/created',
    'store/customer/updated',
    'store/customer/deleted',
    // Product
    'store/product/created',
    'store/product/updated',
    'store/product/deleted',
    'store/product/inventory/updated',
    'store/product/inventory/order/updated',
    // Category
    'store/category/created',
    'store/category/updated',
    'store/category/deleted',
    // SKU
    'store/sku/created',
    'store/sku/updated',
    'store/sku/deleted',
  ] as const;
  
  export type WebhookScope = typeof WEBHOOK_SCOPES[number];
  
  // Group scopes by category for better organization in UI
  export const WEBHOOK_SCOPE_GROUPS = {
    Cart: WEBHOOK_SCOPES.filter(scope => scope.includes('/cart/')),
    Order: WEBHOOK_SCOPES.filter(scope => scope.includes('/order/')),
    Customer: WEBHOOK_SCOPES.filter(scope => scope.includes('/customer/')),
    Product: WEBHOOK_SCOPES.filter(scope => scope.includes('/product/')),
    Category: WEBHOOK_SCOPES.filter(scope => scope.includes('/category/')),
    SKU: WEBHOOK_SCOPES.filter(scope => scope.includes('/sku/')),
  } as const; 