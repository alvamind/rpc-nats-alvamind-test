// src/index.ts
import { NatsClient } from 'rpc-nats-alvamind';
import type { NatsOptions } from 'rpc-nats-alvamind';
import { ExposedMethods } from './generated/exposed-methods';

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
      serviceName: 'test-service',
    },
  };

  const client = new NatsClient<ExposedMethods>();
  await client.connect(options);
  console.log('Connected to NATS');

  const services = client.getExposedMethods();
  console.log('Available services:', Object.keys(services));

  try {
    // Test MathService
    console.log('\n=== Testing MathService ===');
    const addResult = await services.MathService.add({ a: 5, b: 3 });
    console.log('Add result:', addResult);

    const subtractResult = await services.MathService.subtract({ a: 10, b: 4 });
    console.log('Subtract result:', subtractResult);

    // Test UserService
    console.log('\n=== Testing UserService ===');

    // Create a new user
    const newUser = await services.UserService.createUser({
      name: 'Jane Smith',
      email: 'jane.smith@example.com'
    });
    console.log('Created user:', newUser);

    // Get user by ID
    const user = await services.UserService.getUser(newUser.id);
    console.log('Retrieved user:', user);

    // Update user
    const updatedUser = await services.UserService.updateUser(user.id, {
      name: 'Jane Wilson'
    });
    console.log('Updated user:', updatedUser);

    // Create a post for the user
    const newPost = await services.UserService.createPost({
      title: 'My First Post',
      content: 'Hello World!',
      authorId: user.id
    });
    console.log('Created post:', newPost);

    // Update the post
    const updatedPost = await services.UserService.updatePost(newPost.id, {
      content: 'Updated content!'
    });
    console.log('Updated post:', updatedPost);

    // Test complex type
    const complexTypeResult = await services.MathService.complexType(user);
    console.log('Complex type result:', complexTypeResult);

  } catch (error) {
    console.error('Error during service calls:', error);
  } finally {
    await client.disconnect();
    console.log('\nDisconnected from NATS');
  }
}

main().catch((error) => console.error('Fatal error:', error));
