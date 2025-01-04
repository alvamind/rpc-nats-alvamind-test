import { NatsClient, type NatsOptions } from 'rpc-nats-alvamind';

interface ExposedMethods {
  MathService: {
    add(data: { a: number; b: number }): Promise<{ result: number }>;
    subtract(data: { a: number; b: number }): Promise<{ result: number }>;
  };
}

async function main() {
  const options: NatsOptions = {
    natsUrl: 'nats://localhost:4222',
    scanPath: './src/services',
    streaming: false,
    retryConfig: {
      maxRetries: 3,
      initialDelay: 100,
      maxDelay: 1000,
      factor: 2,
    },
    context: {
      serviceName: 'math-service',
    },
  };

  const client = new NatsClient<ExposedMethods>();
  await client.connect(options);
  console.log('Connected to NATS');

  const exposedMethods = client.getExposedMethods();
  console.log('Exposed methods:', exposedMethods);

  try {
    const addResult = await exposedMethods.MathService.add({ a: 5, b: 3 });
    console.log('Add result:', addResult);
  } catch (error) {
    console.error('Error calling add method:', error);
  }

  await client.disconnect();
}

main().catch((error) => console.error('Error running main:', error));
