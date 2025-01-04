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
