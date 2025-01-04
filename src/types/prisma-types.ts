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
