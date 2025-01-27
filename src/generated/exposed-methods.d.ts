// Auto-generated by rpc-nats-alvamind

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
