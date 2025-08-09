/**
 * Middleware Authorization Tests
 *
 * Verifies:
 * - Redirect to / when unauthenticated for protected routes
 * - 403 for role mismatches (admin, firm-admin)
 * - 200 (Next) for authorized users
 */

import { NextRequest } from 'next/server'
import { middleware } from '../middleware'

// Mock @supabase/ssr createServerClient used by middleware
jest.mock('@supabase/ssr', () => {
  return {
    createServerClient: jest.fn((url: string, key: string, opts: any) => {
      return mockSupabaseClient
    }),
  }
})

// Minimal mock supabase client for middleware needs
const mockSupabaseClient: any = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        single: jest.fn(),
      }),
    }),
  }),
}

function makeRequest(path: string) {
  return new NextRequest(new URL(path, 'http://localhost'))
}

describe('Middleware route and role enforcement', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('redirects unauthenticated user from protected route /forms to /', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: null } })

    const req = makeRequest('/forms')
    const res = await middleware(req)

    // Redirect to /
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('/')
  })

  test('allows authenticated user to access /profile (no role required)', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const req = makeRequest('/profile')
    const res = await middleware(req)

    // NextResponse.next()
    expect(res.status).toBe(200)
  })

  test('blocks regular user from /admin (403)', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    // Mock profile role lookup -> user
    mockSupabaseClient.from().select().eq().single.mockResolvedValue({ data: { role: 'user' }, error: null })

    const req = makeRequest('/admin')
    const res = await middleware(req)

    expect(res.status).toBe(403)
  })

  test('allows site_admin to access /admin', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } })
    mockSupabaseClient.from().select().eq().single.mockResolvedValue({ data: { role: 'site_admin' }, error: null })

    const req = makeRequest('/admin')
    const res = await middleware(req)

    expect(res.status).toBe(200)
  })

  test('allows firm_admin to access /firm-admin and /firms/abc/admin', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: { id: 'fa-1' } } })
    mockSupabaseClient.from().select().eq().single.mockResolvedValue({ data: { role: 'firm_admin' }, error: null })

    let req = makeRequest('/firm-admin')
    let res = await middleware(req)
    expect(res.status).toBe(200)

    req = makeRequest('/firms/acme-law/admin')
    res = await middleware(req)
    expect(res.status).toBe(200)
  })

  test('blocks regular user from /firms/abc/admin (403)', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-2' } } })
    mockSupabaseClient.from().select().eq().single.mockResolvedValue({ data: { role: 'user' }, error: null })

    const req = makeRequest('/firms/acme-law/admin')
    const res = await middleware(req)

    expect(res.status).toBe(403)
  })
})

