export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserUpdateRequest {
  name?: string;
  phone?: string;
  password?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  sessionId: string;
}

export interface Session {
  id: string;
  userId: string;
  createdAt: string;
}