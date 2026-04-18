const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export async function fetchApi<T = unknown>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token = localStorage.getItem('access_token')
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })

  if (res.status === 401) {
    // Password change endpoint returns 401 for wrong old password — treat as business error
    const isPasswordChange = path === '/auth/me/password' && options?.method?.toUpperCase() === 'PUT'
    if (!isPasswordChange) {
      localStorage.removeItem('access_token')
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      throw new Error('Unauthorized')
    }
    // Fall through to generic error handling for business-logic 401s
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.detail ?? 'Unauthorized')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.detail ?? `API Error: ${res.status}`)
  }

  return res.json()
}

export class ApiError extends Error {
  status: number
  detail: string

  constructor(status: number, detail: string) {
    super(detail)
    this.status = status
    this.detail = detail
  }
}
