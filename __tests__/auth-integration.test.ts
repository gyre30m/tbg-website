/**
 * Authentication Integration Tests
 * 
 * Tests the complete authentication flow including:
 * - Login/logout processes
 * - Auth context state management
 * - Role-based UI component rendering
 * - Route protection
 */

import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { AuthProvider, useAuth } from '../lib/auth-context'
import { createClient } from '@supabase/supabase-js'

// Mock Next.js router
const mockPush = jest.fn()
const mockReplace = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: jest.fn()
  })
}))

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn()
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn()
      }))
    }))
  }))
}

jest.mock('../lib/supabase', () => ({
  supabase: mockSupabaseClient
}))

// Test component that uses auth
const TestComponent = ({ requiredRole }: { requiredRole?: string }) => {
  const { user, userProfile, loading, isSiteAdmin, isFirmAdmin } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>

  if (requiredRole === 'site_admin' && !isSiteAdmin) {
    return <div>Access denied - Site admin required</div>
  }

  if (requiredRole === 'firm_admin' && !isFirmAdmin && !isSiteAdmin) {
    return <div>Access denied - Firm admin required</div>
  }

  return (
    <div>
      <div data-testid="user-email">{user.email}</div>
      <div data-testid="user-role">{userProfile?.role}</div>
      <div data-testid="is-site-admin">{isSiteAdmin ? 'true' : 'false'}</div>
      <div data-testid="is-firm-admin">{isFirmAdmin ? 'true' : 'false'}</div>
    </div>
  )
}

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPush.mockClear()
    mockReplace.mockClear()
  })

  describe('Auth Context Provider', () => {
    test('shows loading state initially', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
      })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    test('shows not authenticated when no user', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
        setTimeout(() => callback('SIGNED_OUT', null), 0)
        return { data: { subscription: { unsubscribe: jest.fn() } } }
      })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('Not authenticated')).toBeInTheDocument()
      })
    })

    test('loads user profile for authenticated user', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@lawfirm.com'
      }

      const mockProfile = {
        id: 'profile-id',
        user_id: 'test-user-id',
        role: 'user',
        first_name: 'Test',
        last_name: 'User',
        firm_id: 'firm-id'
      }

      const mockSession = {
        user: mockUser,
        access_token: 'test-token'
      }

      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      })

      mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
        setTimeout(() => callback('SIGNED_IN', mockSession), 0)
        return { data: { subscription: { unsubscribe: jest.fn() } } }
      })

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: mockProfile,
              error: null
            })
          }))
        }))
      })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@lawfirm.com')
        expect(screen.getByTestId('user-role')).toHaveTextContent('user')
        expect(screen.getByTestId('is-site-admin')).toHaveTextContent('false')
        expect(screen.getByTestId('is-firm-admin')).toHaveTextContent('false')
      })
    })
  })

  describe('Role-based Access Control', () => {
    test('site admin has full access', async () => {
      const mockUser = {
        id: 'admin-id',
        email: 'bradley@the-bradley-group.com'
      }

      const mockProfile = {
        id: 'admin-profile-id',
        user_id: 'admin-id',
        role: 'site_admin',
        first_name: 'Bradley',
        last_name: 'Gibbs'
      }

      const mockSession = {
        user: mockUser,
        access_token: 'admin-token'
      }

      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      })

      mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
        setTimeout(() => callback('SIGNED_IN', mockSession), 0)
        return { data: { subscription: { unsubscribe: jest.fn() } } }
      })

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: mockProfile,
              error: null
            })
          }))
        }))
      })

      render(
        <AuthProvider>
          <TestComponent requiredRole="site_admin" />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('bradley@the-bradley-group.com')
        expect(screen.getByTestId('user-role')).toHaveTextContent('site_admin')
        expect(screen.getByTestId('is-site-admin')).toHaveTextContent('true')
        expect(screen.getByTestId('is-firm-admin')).toHaveTextContent('false')
      })
    })

    test('firm admin access works correctly', async () => {
      const mockUser = {
        id: 'firm-admin-id',
        email: 'admin@lawfirm.com'
      }

      const mockProfile = {
        id: 'firm-admin-profile-id',
        user_id: 'firm-admin-id',
        role: 'firm_admin',
        first_name: 'Firm',
        last_name: 'Admin',
        firm_id: 'firm-id'
      }

      const mockSession = {
        user: mockUser,
        access_token: 'firm-admin-token'
      }

      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      })

      mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
        setTimeout(() => callback('SIGNED_IN', mockSession), 0)
        return { data: { subscription: { unsubscribe: jest.fn() } } }
      })

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: mockProfile,
              error: null
            })
          }))
        }))
      })

      render(
        <AuthProvider>
          <TestComponent requiredRole="firm_admin" />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('admin@lawfirm.com')
        expect(screen.getByTestId('user-role')).toHaveTextContent('firm_admin')
        expect(screen.getByTestId('is-site-admin')).toHaveTextContent('false')
        expect(screen.getByTestId('is-firm-admin')).toHaveTextContent('true')
      })
    })

    test('regular user denied admin access', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'user@lawfirm.com'
      }

      const mockProfile = {
        id: 'user-profile-id',
        user_id: 'user-id',
        role: 'user',
        first_name: 'Regular',
        last_name: 'User',
        firm_id: 'firm-id'
      }

      const mockSession = {
        user: mockUser,
        access_token: 'user-token'
      }

      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      })

      mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
        setTimeout(() => callback('SIGNED_IN', mockSession), 0)
        return { data: { subscription: { unsubscribe: jest.fn() } } }
      })

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: mockProfile,
              error: null
            })
          }))
        }))
      })

      render(
        <AuthProvider>
          <TestComponent requiredRole="site_admin" />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('Access denied - Site admin required')).toBeInTheDocument()
      })
    })
  })

  describe('Profile Loading Edge Cases', () => {
    test('handles missing profile gracefully', async () => {
      const mockUser = {
        id: 'no-profile-user',
        email: 'newuser@lawfirm.com'
      }

      const mockSession = {
        user: mockUser,
        access_token: 'no-profile-token'
      }

      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      })

      mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
        setTimeout(() => callback('SIGNED_IN', mockSession), 0)
        return { data: { subscription: { unsubscribe: jest.fn() } } }
      })

      // Simulate profile not found
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116', message: 'Profile not found' }
            })
          }))
        }))
      })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('newuser@lawfirm.com')
        expect(screen.getByTestId('user-role')).toHaveTextContent('')
        expect(screen.getByTestId('is-site-admin')).toHaveTextContent('false')
        expect(screen.getByTestId('is-firm-admin')).toHaveTextContent('false')
      })
    })

    test('handles database errors during profile fetch', async () => {
      const mockUser = {
        id: 'error-user',
        email: 'error@lawfirm.com'
      }

      const mockSession = {
        user: mockUser,
        access_token: 'error-token'
      }

      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      })

      mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
        setTimeout(() => callback('SIGNED_IN', mockSession), 0)
        return { data: { subscription: { unsubscribe: jest.fn() } } }
      })

      // Simulate database error
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'INTERNAL_ERROR', message: 'Database connection failed' }
            })
          }))
        }))
      })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('error@lawfirm.com')
        // Should still render but without profile data
        expect(screen.getByTestId('user-role')).toHaveTextContent('')
      })
    })
  })

  describe('Auth State Changes', () => {
    test('handles sign out correctly', async () => {
      const mockUser = {
        id: 'test-user',
        email: 'test@lawfirm.com'
      }

      const mockSession = {
        user: mockUser,
        access_token: 'test-token'
      }

      let authCallback: Function

      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      })

      mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: { unsubscribe: jest.fn() } } }
      })

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { role: 'user' },
              error: null
            })
          }))
        }))
      })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      // Initially signed in
      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@lawfirm.com')
      })

      // Simulate sign out
      act(() => {
        authCallback('SIGNED_OUT', null)
      })

      await waitFor(() => {
        expect(screen.getByText('Not authenticated')).toBeInTheDocument()
      })
    })
  })
})