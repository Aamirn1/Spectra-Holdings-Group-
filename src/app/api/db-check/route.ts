import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase-db'

export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasPublishableKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'MISSING',
    },
    checks: {} as Record<string, unknown>,
  }

  // Test 1: Check if anon client can read from User table
  try {
    const { data: anonRead, error: anonReadError } = await supabase
      .from('User')
      .select('id')
      .limit(1)

    results.checks = {
      ...results.checks,
      anonRead: {
        success: !anonReadError,
        error: anonReadError ? { message: anonReadError.message, code: anonReadError.code } : null,
        count: anonRead?.length || 0,
      },
    }
  } catch (err) {
    results.checks = {
      ...results.checks,
      anonRead: { success: false, error: String(err) },
    }
  }

  // Test 2: Check if admin client can read from User table
  try {
    const { data: adminRead, error: adminReadError } = await supabaseAdmin
      .from('User')
      .select('id')
      .limit(1)

    results.checks = {
      ...results.checks,
      adminRead: {
        success: !adminReadError,
        error: adminReadError ? { message: adminReadError.message, code: adminReadError.code } : null,
        count: adminRead?.length || 0,
      },
    }
  } catch (err) {
    results.checks = {
      ...results.checks,
      adminRead: { success: false, error: String(err) },
    }
  }

  // Test 3: Check if admin client can insert (test with rollback)
  try {
    const testEmail = `test_${Date.now()}@spectra-check.com`
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('User')
      .insert({
        name: 'DB Check Test',
        email: testEmail,
        passwordHash: 'test_hash_only',
        role: 'RESIDENT',
      })
      .select('id')
      .maybeSingle()

    if (insertData?.id) {
      // Clean up the test user
      await supabaseAdmin.from('User').delete().eq('id', insertData.id)
    }

    results.checks = {
      ...results.checks,
      adminInsert: {
        success: !insertError,
        error: insertError ? { message: insertError.message, code: insertError.code, details: insertError.details, hint: insertError.hint } : null,
      },
    }
  } catch (err) {
    results.checks = {
      ...results.checks,
      adminInsert: { success: false, error: String(err) },
    }
  }

  // Test 4: Check if anon client can insert (test with rollback)
  try {
    const testEmail = `test_anon_${Date.now()}@spectra-check.com`
    const { data: insertData, error: insertError } = await supabase
      .from('User')
      .insert({
        name: 'DB Check Anon Test',
        email: testEmail,
        passwordHash: 'test_hash_only',
        role: 'RESIDENT',
      })
      .select('id')
      .maybeSingle()

    if (insertData?.id) {
      // Clean up the test user
      await supabase.from('User').delete().eq('id', insertData.id)
    }

    results.checks = {
      ...results.checks,
      anonInsert: {
        success: !insertError,
        error: insertError ? { message: insertError.message, code: insertError.code, details: insertError.details, hint: insertError.hint } : null,
      },
    }
  } catch (err) {
    results.checks = {
      ...results.checks,
      anonInsert: { success: false, error: String(err) },
    }
  }

  // Test 5: Check RLS policies on User table
  try {
    const { data: policies, error: policyError } = await supabaseAdmin
      .from('pg_policies' as any)
      .select('policyname, cmd, qual, with_check')
      .eq('tablename', 'User')

    results.checks = {
      ...results.checks,
      rlsPolicies: {
        success: !policyError,
        error: policyError ? { message: policyError.message } : null,
        policies: policies || 'Could not query pg_policies (requires direct database access)',
      },
    }
  } catch (err) {
    results.checks = {
      ...results.checks,
      rlsPolicies: { success: false, error: String(err), note: 'Cannot query RLS policies via API — check Supabase Dashboard instead' },
    }
  }

  // Determine overall status
  const allChecks = results.checks as Record<string, { success: boolean }>
  const criticalChecks = ['adminRead', 'adminInsert']
  const criticalPassed = criticalChecks.every(k => allChecks[k]?.success)

  return NextResponse.json({
    ...results,
    overall: criticalPassed ? 'HEALTHY' : 'ISSUES_DETECTED',
    recommendation: !criticalPassed
      ? 'If adminInsert fails, add SUPABASE_SERVICE_ROLE_KEY to your environment variables. Get it from Supabase Dashboard > Settings > API > service_role key.'
      : 'Database connection is working properly.',
  })
}
