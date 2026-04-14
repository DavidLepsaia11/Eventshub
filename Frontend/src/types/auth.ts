// src/types/auth.ts

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  userName: string;
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  userId: string;
  userName: string;
  email: string;
  roles: string[];
}

export interface AuthUser {
  userId: string;
  userName: string;
  email: string;
  roles: string[];
}
