export interface Store {
    id: string;
    name: string;
    domain: string;
    accessToken: string;
  }
  
  export interface Webhook {
    id: number;
    scope: string;
    destination: string;
    headers?: Record<string, string>;
    events: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface WebhookFormData {
    scope: string;
    destination: string;
    events: string[];
    headers?: Record<string, string>;
  } 