import { fetchApi } from './api'

export interface AuthUser {
  id: number
  email: string
  display_name: string | null
  avatar_url: string | null
  role: 'student' | 'admin'
}

interface TokenResponse {
  access_token: string
  token_type: string
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  return fetchApi<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function register(
  email: string,
  password: string,
  display_name?: string,
): Promise<AuthUser> {
  return fetchApi<AuthUser>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, display_name }),
  })
}

export async function getMe(): Promise<AuthUser> {
  return fetchApi<AuthUser>('/auth/me')
}
