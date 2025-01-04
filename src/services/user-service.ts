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
