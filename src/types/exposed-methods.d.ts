// src/types/exposed-methods.d.ts
declare module 'rpc-nats-alvamind' {
  export interface NatsOptions {
    natsUrl: string;
    scanPath?: string;
    streaming?: boolean;
    retryConfig?: {
      maxRetries?: number;
      initialDelay?: number;
      maxDelay?: number;
      factor?: number;
    };
    context?: Record<string, any>;
  }

  export class NatsClient<T = any> {
    connect(options: NatsOptions): Promise<void>;
    disconnect(): Promise<void>;
    getExposedMethods(): T;
  }
}
