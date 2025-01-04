# Project: rpc-nats-alvamind-test-project

dist
src
src/generated
src/services
src/types
====================
// package.json
{
  "name": "rpc-nats-alvamind-test-project",
  "version": "1.0.0",
  "devDependencies": {
    "bun-types": "latest",
    "typescript": "latest"
  },
  "scripts": {
    "commit": "commit",
    "source": "generate-source output=source.md exclude=dist/,README.md,nats-rpc.test.ts,rpc-nats-alvamind-1.0.0.tgz,.gitignore",
    "dev": "bun run src/index.ts",
    "build": "tsc",
    "reinstall": "rm -rf node_modules bun.lockb src/generated && bun install",
    "generate-types": "bun run rpc-nats-alvamind generate ./src/services ./src/generated/exposed-methods.d.ts"
  },
  "type": "module",
  "dependencies": {
    "alvamind-tools": "^1.0.2",
    "rpc-nats-alvamind": "/home/realme-book/Project/code/rpc-nats-alvamind/rpc-nats-alvamind-1.0.0.tgz"
  }
}

// src/generated/exposed-methods.d.ts
import { User } from '../types/prisma-types';
import { UserCreateInput } from '../types/prisma-types';
import { UserUpdateInput } from '../types/prisma-types';
import { PostCreateInput } from '../types/prisma-types';
import { Post } from '../types/prisma-types';
import { PostUpdateInput } from '../types/prisma-types';
import { abc } from '../services/math-service';
export interface ExposedMethods {
  UserService: {
    getUser(id: number): Promise<User>;
    createUser(data: UserCreateInput): Promise<User>;
    updateUser(id: number, data: UserUpdateInput): Promise<User>;
    createPost(data: PostCreateInput): Promise<Post>;
    updatePost(id: number, data: PostUpdateInput): Promise<Post>;
  };
  MathService: {
    add(data: abc): Promise<{ result: number; }>;
    subtract(data: { a: number; b: number }): Promise<{ result: number; }>;
    complexType(user: User): Promise<User>;
  };
}

// src/index.ts
import { NatsClient, type NatsOptions } from 'rpc-nats-alvamind';
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
    console.log('\n=== Testing MathService ===');
    const addResult = await services.MathService.add({ a: 5, b: 3 });
    console.log('Add result:', addResult);
    const subtractResult = await services.MathService.subtract({ a: 10, b: 4 });
    console.log('Subtract result:', subtractResult);
    console.log('\n=== Testing UserService ===');
    const newUser = await services.UserService.createUser({
      name: 'Jane Smith',
      email: 'jane.smith@example.com'
    });
    console.log('Created user:', newUser);
    const user = await services.UserService.getUser(newUser.id);
    console.log('Retrieved user:', user);
    const updatedUser = await services.UserService.updateUser(user.id, {
      name: 'Jane Wilson'
    });
    console.log('Updated user:', updatedUser);
    const newPost = await services.UserService.createPost({
      title: 'My First Post',
      content: 'Hello World!',
      authorId: user.id
    });
    console.log('Created post:', newPost);
    const updatedPost = await services.UserService.updatePost(newPost.id, {
      content: 'Updated content!'
    });
    console.log('Updated post:', updatedPost);
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

// src/services/math-service.ts
import { Post, User } from "../types/prisma-types";
export type abc = { a: number; b: number };
export class MathService {
  async add(data: abc): Promise<{ result: number }> {
    console.log("Processing add request:", data);
    return { result: data.a + data.b };
  }
  async subtract(data: { a: number; b: number }): Promise<{ result: number }> {
    console.log("Processing subtract request:", data);
    return { result: data.a - data.b };
  }
  async complexType(user: User): Promise<User> {
    console.log("Processing complex type request:", user);
    return user;
  }
}

// src/services/user-service.ts
import { Post, User, UserCreateInput, UserUpdateInput, PostCreateInput, PostUpdateInput } from "../types/prisma-types";
export class UserService {
  async getUser(id: number): Promise<User> {
    console.log("Getting user by ID:", id);
    return {
      id,
      name: "John Doe",
      email: "john.doe@example.com",
      posts: [],
    };
  }
  async createUser(data: UserCreateInput): Promise<User> {
    console.log("Creating user with data:", data);
    return {
      id: 1,
      ...data,
      posts: [],
    };
  }
  async updateUser(id: number, data: UserUpdateInput): Promise<User> {
    console.log("Updating user with id:", id, data);
    return {
      id,
      name: "John Doe",
      email: "john.doe@example.com",
      posts: [],
    };
  }
  async createPost(data: PostCreateInput): Promise<Post> {
    console.log("Creating post with data:", data);
    return {
      id: 1,
      title: "test post",
      content: "this is test",
      author: {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        posts: [],
      },
    };
  }
  async updatePost(id: number, data: PostUpdateInput): Promise<Post> {
    console.log("Updating post with id:", id, data);
    return {
      id,
      title: "test post",
      content: "this is test",
      author: {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        posts: [],
      },
    };
  }
}

// src/types/prisma-types.ts
export interface User {
  id: number;
  name: string;
  email: string;
  posts: Post[];
}
export interface Post {
  id: number;
  title: string;
  content: string;
  author: User;
}
export interface UserCreateInput {
  name: string;
  email: string;
}
export interface UserUpdateInput {
  name?: string;
  email?: string;
}
export interface PostCreateInput {
  title: string;
  content: string;
  authorId: number;
}
export interface PostUpdateInput {
  title?: string;
  content?: string;
}

// src/types/rpc-nats-alvamind.d.ts
declare module 'rpc-nats-alvamind' {
  export * from 'rpc-nats-alvamind/dist/index';
}

// tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "types": ["bun-types"],
    "typeRoots": ["./node_modules/@types", "./node_modules/rpc-nats-alvamind"]
  },
  "include": ["src*"],
  "exclude": ["node_modules", "dist"]
}

