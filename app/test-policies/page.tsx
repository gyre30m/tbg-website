'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface TestResult {
  test: string
  status: 'success' | 'error' | 'pending'
  message: string
  data?: unknown
}

export default function TestPoliciesPage() {
  const { user, userProfile, isSiteAdmin, isFirmAdmin } = useAuth()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result])
  }

  const clearResults = () => {
    setTestResults([])
  }

  const testSiteAdminPolicies = async () => {
    if (!isSiteAdmin) {
      addTestResult({
        test: 'Site Admin Policies',
        status: 'error',
        message: 'Must be site admin to test these policies'
      })
      return
    }

    try {
      // Test viewing all forms
      const { data: forms, error: formsError } = await supabase
        .from('personal_injury_forms')
        .select('id, submitted_by, created_at')
        .limit(5)

      if (formsError) {
        addTestResult({
          test: 'Site Admin - View All Forms',
          status: 'error',
          message: `Error: ${formsError.message}`
        })
      } else {
        addTestResult({
          test: 'Site Admin - View All Forms',
          status: 'success',
          message: `Successfully viewed ${forms.length} forms`,
          data: forms
        })
      }

      // Test viewing all drafts
      const { data: drafts, error: draftsError } = await supabase
        .from('personal_injury_drafts')
        .select('id, submitted_by, created_at')
        .limit(5)

      if (draftsError) {
        addTestResult({
          test: 'Site Admin - View All Drafts',
          status: 'error',
          message: `Error: ${draftsError.message}`
        })
      } else {
        addTestResult({
          test: 'Site Admin - View All Drafts',
          status: 'success',
          message: `Successfully viewed ${drafts.length} drafts`,
          data: drafts
        })
      }

      // Test creating a test form (we'll delete it immediately)
      const testFormData = {
        form_data: { test: 'Site admin test form' },
        submitted_by: user?.id,
        status: 'submitted'
      }

      const { data: newForm, error: createError } = await supabase
        .from('personal_injury_forms')
        .insert([testFormData])
        .select()
        .single()

      if (createError) {
        addTestResult({
          test: 'Site Admin - Create Form',
          status: 'error',
          message: `Create error: ${createError.message}`
        })
      } else {
        addTestResult({
          test: 'Site Admin - Create Form',
          status: 'success',
          message: 'Successfully created test form'
        })

        // Clean up - delete the test form
        const { error: deleteError } = await supabase
          .from('personal_injury_forms')
          .delete()
          .eq('id', newForm.id)

        if (deleteError) {
          addTestResult({
            test: 'Site Admin - Delete Form',
            status: 'error',
            message: `Delete error: ${deleteError.message}`
          })
        } else {
          addTestResult({
            test: 'Site Admin - Delete Form',
            status: 'success',
            message: 'Successfully deleted test form'
          })
        }
      }

    } catch (error) {
      addTestResult({
        test: 'Site Admin Policies',
        status: 'error',
        message: `Unexpected error: ${error}`
      })
    }
  }

  const testFirmUserFunction = async () => {
    if (!userProfile?.firm_id) {
      addTestResult({
        test: 'Firm User Function',
        status: 'error',
        message: 'No firm_id available for testing'
      })
      return
    }

    try {
      // Test the firm user function
      const { data, error } = await supabase
        .rpc('get_firm_users_with_details', { 
          firm_id_param: userProfile.firm_id 
        })

      if (error) {
        addTestResult({
          test: 'Firm User Function',
          status: 'error',
          message: `Function error: ${error.message}`
        })
      } else {
        addTestResult({
          test: 'Firm User Function',
          status: 'success',
          message: `Successfully retrieved ${data?.length || 0} users`,
          data: data
        })
      }
    } catch (error) {
      addTestResult({
        test: 'Firm User Function',
        status: 'error',
        message: `Unexpected error: ${error}`
      })
    }
  }

  const testBasicAccess = async () => {
    try {
      // Test basic profile access
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (profileError) {
        addTestResult({
          test: 'Basic Profile Access',
          status: 'error',
          message: `Profile error: ${profileError.message}`
        })
      } else {
        addTestResult({
          test: 'Basic Profile Access',
          status: 'success',
          message: 'Successfully accessed own profile',
          data: profile
        })
      }

      // Test firm access if user has a firm
      if (userProfile?.firm_id) {
        const { data: firm, error: firmError } = await supabase
          .from('firms')
          .select('*')
          .eq('id', userProfile.firm_id)
          .single()

        if (firmError) {
          addTestResult({
            test: 'Firm Access',
            status: 'error',
            message: `Firm error: ${firmError.message}`
          })
        } else {
          addTestResult({
            test: 'Firm Access',
            status: 'success',
            message: 'Successfully accessed firm data',
            data: firm
          })
        }
      }
    } catch (error) {
      addTestResult({
        test: 'Basic Access',
        status: 'error',
        message: `Unexpected error: ${error}`
      })
    }
  }

  const runAllTests = async () => {
    setTesting(true)
    clearResults()
    
    toast.info('Running database policy tests...')
    
    await testBasicAccess()
    
    if (isFirmAdmin || isSiteAdmin) {
      await testFirmUserFunction()
    }
    
    if (isSiteAdmin) {
      await testSiteAdminPolicies()
    }
    
    setTesting(false)
    toast.success('Tests completed!')
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Please log in to test policies</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Database Policy Tests</h1>
        <p className="text-muted-foreground">
          Test the new database policies and functions
        </p>
        <div className="flex gap-2 mt-2">
          <Badge variant={isSiteAdmin ? 'default' : 'outline'}>
            {isSiteAdmin ? 'Site Admin' : 'Not Site Admin'}
          </Badge>
          <Badge variant={isFirmAdmin ? 'default' : 'outline'}>
            {isFirmAdmin ? 'Firm Admin' : 'Not Firm Admin'}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Test Runner</CardTitle>
            <CardDescription>
              Run tests to verify database policies and functions work correctly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={runAllTests} disabled={testing}>
                {testing ? 'Running Tests...' : 'Run All Tests'}
              </Button>
              <Button variant="outline" onClick={clearResults}>
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="border rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{result.test}</span>
                      <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                        {result.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {result.message}
                    </p>
                    {result.data != null && (
                      <details className="text-xs">
                        <summary className="cursor-pointer">View Data</summary>
                        <pre className="mt-2 bg-muted p-2 rounded overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}