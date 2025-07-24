/**
 * Authentication and Authorization Tests
 * 
 * Tests the complete auth system including:
 * - Database RLS policies
 * - Role-based access control
 * - Permission boundaries
 * - Cross-firm data isolation
 */

import { createClient } from '@supabase/supabase-js'

// Test configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create clients for different contexts
const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Test user data
const TEST_USERS = {
  siteAdmin: {
    email: 'test-site-admin@the-bradley-group.com',
    password: 'testpassword123',
    role: 'site_admin'
  },
  firmAdmin1: {
    email: 'admin@lawfirm1.com',
    password: 'testpassword123',
    role: 'firm_admin',
    firmDomain: 'lawfirm1.com'
  },
  firmAdmin2: {
    email: 'admin@lawfirm2.com', 
    password: 'testpassword123',
    role: 'firm_admin',
    firmDomain: 'lawfirm2.com'
  },
  user1: {
    email: 'user@lawfirm1.com',
    password: 'testpassword123',
    role: 'user',
    firmDomain: 'lawfirm1.com'
  },
  user2: {
    email: 'user@lawfirm2.com',
    password: 'testpassword123', 
    role: 'user',
    firmDomain: 'lawfirm2.com'
  }
}

describe('Authentication System Tests', () => {
  let testFirm1Id: string
  let testFirm2Id: string
  let testUserIds: Record<string, string> = {}

  beforeAll(async () => {
    // Setup test data using service role
    await setupTestData()
  })

  afterAll(async () => {
    // Cleanup test data
    await cleanupTestData()
  })

  async function setupTestData() {
    // Create test firms
    const { data: firm1 } = await adminClient
      .from('firms')
      .insert({
        name: 'Test Law Firm 1',
        domain: 'lawfirm1.com'
      })
      .select('id')
      .single()

    const { data: firm2 } = await adminClient
      .from('firms')
      .insert({
        name: 'Test Law Firm 2', 
        domain: 'lawfirm2.com'
      })
      .select('id')
      .single()

    testFirm1Id = firm1!.id
    testFirm2Id = firm2!.id

    // Create test users
    for (const [key, userData] of Object.entries(TEST_USERS)) {
      const { data: user } = await adminClient.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      })

      if (user.user) {
        testUserIds[key] = user.user.id

        // Create user profiles
        const firmId = userData.firmDomain === 'lawfirm1.com' ? testFirm1Id : 
                      userData.firmDomain === 'lawfirm2.com' ? testFirm2Id : null

        await adminClient
          .from('user_profiles')
          .insert({
            user_id: user.user.id,
            firm_id: firmId,
            role: userData.role,
            first_name: `Test ${userData.role}`,
            last_name: key
          })
      }
    }
  }

  async function cleanupTestData() {
    // Delete test users and associated data
    for (const userId of Object.values(testUserIds)) {
      await adminClient.auth.admin.deleteUser(userId)
    }

    // Delete test firms
    if (testFirm1Id) await adminClient.from('firms').delete().eq('id', testFirm1Id)
    if (testFirm2Id) await adminClient.from('firms').delete().eq('id', testFirm2Id)
  }

  describe('Site Admin Permissions', () => {
    let siteAdminClient: any

    beforeEach(async () => {
      siteAdminClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      await siteAdminClient.auth.signInWithPassword({
        email: TEST_USERS.siteAdmin.email,
        password: TEST_USERS.siteAdmin.password
      })
    })

    afterEach(async () => {
      await siteAdminClient.auth.signOut()
    })

    test('can view all firms', async () => {
      const { data, error } = await siteAdminClient
        .from('firms')
        .select('*')

      expect(error).toBeNull()
      expect(data).toHaveLength(2) // Both test firms
    })

    test('can manage all firms', async () => {
      const { data, error } = await siteAdminClient
        .from('firms')
        .update({ name: 'Updated Firm Name' })
        .eq('id', testFirm1Id)
        .select()

      expect(error).toBeNull()
      expect(data?.[0]?.name).toBe('Updated Firm Name')
    })

    test('can view all user profiles', async () => {
      const { data, error } = await siteAdminClient
        .from('user_profiles')
        .select('*')

      expect(error).toBeNull()
      expect(data?.length).toBeGreaterThanOrEqual(5) // All test users
    })

    test('can view all forms across firms', async () => {
      // First create test forms
      await createTestForms()

      const { data, error } = await siteAdminClient
        .from('personal_injury_forms')
        .select('*')

      expect(error).toBeNull()
      expect(data?.length).toBeGreaterThanOrEqual(2) // Forms from both firms
    })
  })

  describe('Firm Admin Permissions', () => {
    let firmAdmin1Client: any
    let firmAdmin2Client: any

    beforeEach(async () => {
      firmAdmin1Client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      firmAdmin2Client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

      await firmAdmin1Client.auth.signInWithPassword({
        email: TEST_USERS.firmAdmin1.email,
        password: TEST_USERS.firmAdmin1.password
      })

      await firmAdmin2Client.auth.signInWithPassword({
        email: TEST_USERS.firmAdmin2.email,
        password: TEST_USERS.firmAdmin2.password
      })
    })

    afterEach(async () => {
      await firmAdmin1Client.auth.signOut()
      await firmAdmin2Client.auth.signOut()
    })

    test('can only view their own firm', async () => {
      const { data: firm1Data, error: firm1Error } = await firmAdmin1Client
        .from('firms')
        .select('*')

      expect(firm1Error).toBeNull()
      expect(firm1Data).toHaveLength(1)
      expect(firm1Data?.[0]?.id).toBe(testFirm1Id)

      const { data: firm2Data, error: firm2Error } = await firmAdmin2Client
        .from('firms')
        .select('*')

      expect(firm2Error).toBeNull()
      expect(firm2Data).toHaveLength(1)
      expect(firm2Data?.[0]?.id).toBe(testFirm2Id)
    })

    test('can only view users in their firm', async () => {
      const { data, error } = await firmAdmin1Client
        .from('user_profiles')
        .select('*')

      expect(error).toBeNull()
      
      // Should only see users from firm 1
      const firmIds = data?.map(profile => profile.firm_id)
      expect(firmIds?.every(id => id === testFirm1Id)).toBe(true)
    })

    test('cannot view other firms data', async () => {
      await createTestForms()

      const { data, error } = await firmAdmin1Client
        .from('personal_injury_forms')
        .select('*')

      expect(error).toBeNull()
      
      // Should only see forms from their firm
      const firmIds = data?.map(form => form.firm_id)
      expect(firmIds?.every(id => id === testFirm1Id)).toBe(true)
    })

    test('cannot modify other firms', async () => {
      const { data, error } = await firmAdmin1Client
        .from('firms')
        .update({ name: 'Hacked Firm' })
        .eq('id', testFirm2Id)

      expect(error).not.toBeNull() // Should fail due to RLS
    })
  })

  describe('User Permissions', () => {
    let user1Client: any
    let user2Client: any

    beforeEach(async () => {
      user1Client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      user2Client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

      await user1Client.auth.signInWithPassword({
        email: TEST_USERS.user1.email,
        password: TEST_USERS.user1.password
      })

      await user2Client.auth.signInWithPassword({
        email: TEST_USERS.user2.email,
        password: TEST_USERS.user2.password
      })
    })

    afterEach(async () => {
      await user1Client.auth.signOut()
      await user2Client.auth.signOut()
    })

    test('can view their own profile', async () => {
      const { data, error } = await user1Client
        .from('user_profiles')
        .select('*')
        .eq('user_id', testUserIds.user1)

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data?.[0]?.user_id).toBe(testUserIds.user1)
    })

    test('can create their own forms', async () => {
      const testFormData = {
        contact: { name: 'Test User', email: TEST_USERS.user1.email },
        demographics: { age: 30 }
      }

      const { data, error } = await user1Client
        .from('personal_injury_forms')
        .insert({
          form_data: testFormData,
          submitted_by: testUserIds.user1,
          firm_id: testFirm1Id
        })
        .select()

      expect(error).toBeNull()
      expect(data?.[0]?.submitted_by).toBe(testUserIds.user1)
    })

    test('can view forms from their firm', async () => {
      await createTestForms()

      const { data, error } = await user1Client
        .from('personal_injury_forms')
        .select('*')

      expect(error).toBeNull()
      
      // Should see forms from their firm
      const firmIds = data?.map(form => form.firm_id)
      expect(firmIds?.every(id => id === testFirm1Id)).toBe(true)
    })

    test('cannot view other firms forms', async () => {
      await createTestForms()

      const { data, error } = await user1Client
        .from('personal_injury_forms')
        .select('*')

      expect(error).toBeNull()
      
      // Should not see any forms from firm 2
      const hasOtherFirmForms = data?.some(form => form.firm_id === testFirm2Id)
      expect(hasOtherFirmForms).toBe(false)
    })

    test('cannot modify other users forms', async () => {
      // Create form as user2
      const { data: createdForm } = await user2Client
        .from('personal_injury_forms')
        .insert({
          form_data: { test: 'data' },
          submitted_by: testUserIds.user2,
          firm_id: testFirm2Id
        })
        .select()
        .single()

      // Try to modify as user1
      const { data, error } = await user1Client
        .from('personal_injury_forms')
        .update({ form_data: { hacked: true } })
        .eq('id', createdForm!.id)

      expect(error).not.toBeNull() // Should fail due to RLS
    })
  })

  describe('Cross-Firm Data Isolation', () => {
    test('firm 1 users cannot access firm 2 data', async () => {
      const user1Client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      await user1Client.auth.signInWithPassword({
        email: TEST_USERS.user1.email,
        password: TEST_USERS.user1.password
      })

      // Try to access firm 2 profiles
      const { data, error } = await user1Client
        .from('user_profiles')
        .select('*')
        .eq('firm_id', testFirm2Id)

      expect(data).toHaveLength(0) // Should not see any profiles from firm 2

      await user1Client.auth.signOut()
    })

    test('forms are properly isolated by firm', async () => {
      await createTestForms()

      // Test user 1 access
      const user1Client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      await user1Client.auth.signInWithPassword({
        email: TEST_USERS.user1.email,
        password: TEST_USERS.user1.password
      })

      const { data: user1Forms } = await user1Client
        .from('personal_injury_forms')
        .select('*')

      const user1FirmIds = user1Forms?.map(form => form.firm_id)
      expect(user1FirmIds?.every(id => id === testFirm1Id)).toBe(true)

      await user1Client.auth.signOut()

      // Test user 2 access
      const user2Client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      await user2Client.auth.signInWithPassword({
        email: TEST_USERS.user2.email,
        password: TEST_USERS.user2.password
      })

      const { data: user2Forms } = await user2Client
        .from('personal_injury_forms')
        .select('*')

      const user2FirmIds = user2Forms?.map(form => form.firm_id)
      expect(user2FirmIds?.every(id => id === testFirm2Id)).toBe(true)

      await user2Client.auth.signOut()
    })
  })

  describe('Anonymous User Access', () => {
    test('anonymous users cannot access any protected data', async () => {
      const { data: firms, error: firmsError } = await anonClient
        .from('firms')
        .select('*')

      expect(firmsError).not.toBeNull()

      const { data: profiles, error: profilesError } = await anonClient
        .from('user_profiles')
        .select('*')

      expect(profilesError).not.toBeNull()

      const { data: forms, error: formsError } = await anonClient
        .from('personal_injury_forms')
        .select('*')

      expect(formsError).not.toBeNull()
    })
  })

  // Helper function to create test forms
  async function createTestForms() {
    const testForms = [
      {
        form_data: { contact: { name: 'User 1 Form' } },
        submitted_by: testUserIds.user1,
        firm_id: testFirm1Id
      },
      {
        form_data: { contact: { name: 'Admin 1 Form' } },
        submitted_by: testUserIds.firmAdmin1,
        firm_id: testFirm1Id
      },
      {
        form_data: { contact: { name: 'User 2 Form' } },
        submitted_by: testUserIds.user2,
        firm_id: testFirm2Id
      },
      {
        form_data: { contact: { name: 'Admin 2 Form' } },
        submitted_by: testUserIds.firmAdmin2,
        firm_id: testFirm2Id
      }
    ]

    for (const form of testForms) {
      await adminClient
        .from('personal_injury_forms')
        .insert(form)
    }
  }
})