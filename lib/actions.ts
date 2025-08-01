'use server'

import { createClient } from './supabase/server-client'
import { createAdminClient } from './supabase/admin-client'

// Generic function to extract normalized form data for Personal Injury forms
function extractPersonalInjuryData(formData: FormData) {
  // Helper function to handle required fields - returns "N/A" if empty, as per form instructions
  const getRequiredField = (field: string | null | undefined): string => {
    const value = field?.trim()
    return value && value.length > 0 ? value : 'N/A'
  }

  // Helper function for optional fields
  const getOptionalField = (field: string | null | undefined): string | null => {
    const value = field?.trim()
    return value && value.length > 0 ? value : null
  }

  return {
    // Contact Information (all required except address2)
    first_name: getRequiredField(formData.get('firstName') as string),
    last_name: getRequiredField(formData.get('lastName') as string),
    address1: getRequiredField(formData.get('address1') as string),
    address2: getOptionalField(formData.get('address2') as string),
    city: getRequiredField(formData.get('city') as string),
    state: getRequiredField(formData.get('state') as string),
    zip_code: getRequiredField(formData.get('zipCode') as string),
    email: getRequiredField(formData.get('email') as string),
    phone: getRequiredField(formData.get('phone') as string),
    phone_type: getRequiredField(formData.get('phoneType') as string),
    
    // Demographics (all required)
    gender: getRequiredField(formData.get('gender') as string),
    marital_status: getRequiredField(formData.get('maritalStatus') as string),
    ethnicity: getRequiredField(formData.get('ethnicity') as string),
    date_of_birth: formData.get('dateOfBirth') ? new Date(formData.get('dateOfBirth') as string).toISOString() : null,
    
    // Medical Information (all required)
    incident_date: formData.get('incidentDate') ? new Date(formData.get('incidentDate') as string).toISOString() : null,
    injury_description: getRequiredField(formData.get('injuryDescription') as string),
    caregiver_claim: getRequiredField(formData.get('caregiverClaim') as string),
    life_expectancy: getRequiredField(formData.get('lifeExpectancy') as string),
    future_medical: getRequiredField(formData.get('futureMedical') as string),
    
    // Education (all required)
    pre_injury_education: getRequiredField(formData.get('preInjuryEducation') as string),
    pre_injury_skills: getRequiredField(formData.get('preInjurySkills') as string),
    education_plans: getRequiredField(formData.get('educationPlans') as string),
    parent_education: getRequiredField(formData.get('parentEducation') as string),
    post_injury_education: getRequiredField(formData.get('postInjuryEducation') as string),
    
    // Pre-Injury Employment (most required, some optional)
    pre_injury_employment_status: getRequiredField(formData.get('preInjuryEmploymentStatus') as string),
    pre_injury_job_title: getRequiredField(formData.get('preInjuryJobTitle') as string),
    pre_injury_employer: getRequiredField(formData.get('preInjuryEmployer') as string),
    pre_injury_start_date: formData.get('preInjuryStartDate') ? new Date(formData.get('preInjuryStartDate') as string).toISOString() : null,
    pre_injury_salary: getRequiredField(formData.get('preInjurySalary') as string),
    pre_injury_duties: getRequiredField(formData.get('preInjuryDuties') as string),
    pre_injury_advancements: getRequiredField(formData.get('preInjuryAdvancements') as string),
    pre_injury_overtime: getRequiredField(formData.get('preInjuryOvertime') as string),
    pre_injury_work_steady: getRequiredField(formData.get('preInjuryWorkSteady') as string),
    pre_injury_life_insurance: getOptionalField(formData.get('preInjuryLifeInsurance') as string),
    pre_injury_individual_health: getOptionalField(formData.get('preInjuryIndividualHealth') as string),
    pre_injury_family_health: getOptionalField(formData.get('preInjuryFamilyHealth') as string),
    pre_injury_retirement_plan: getOptionalField(formData.get('preInjuryRetirementPlan') as string),
    pre_injury_investment_plan: getOptionalField(formData.get('preInjuryInvestmentPlan') as string),
    pre_injury_bonus: getOptionalField(formData.get('preInjuryBonus') as string),
    pre_injury_stock_options: getOptionalField(formData.get('preInjuryStockOptions') as string),
    pre_injury_other_benefits: getOptionalField(formData.get('preInjuryOtherBenefits') as string),
    pre_injury_retirement_age: getRequiredField(formData.get('preInjuryRetirementAge') as string),
    pre_injury_career_trajectory: getRequiredField(formData.get('preInjuryCareerTrajectory') as string),
    pre_injury_job_expenses: getRequiredField(formData.get('preInjuryJobExpenses') as string),
    
    // Post-Injury Employment (most required, some optional)
    disability_rating: getRequiredField(formData.get('disabilityRating') as string),
    post_injury_employment_status: getRequiredField(formData.get('postInjuryEmploymentStatus') as string),
    post_injury_job_title: getRequiredField(formData.get('postInjuryJobTitle') as string),
    post_injury_employer: getRequiredField(formData.get('postInjuryEmployer') as string),
    post_injury_start_date: formData.get('postInjuryStartDate') ? new Date(formData.get('postInjuryStartDate') as string).toISOString() : null,
    post_injury_salary: getRequiredField(formData.get('postInjurySalary') as string),
    post_injury_duties: getRequiredField(formData.get('postInjuryDuties') as string),
    post_injury_advancements: getRequiredField(formData.get('postInjuryAdvancements') as string),
    post_injury_overtime: getRequiredField(formData.get('postInjuryOvertime') as string),
    post_injury_work_steady: getRequiredField(formData.get('postInjuryWorkSteady') as string),
    post_injury_life_insurance: getOptionalField(formData.get('postInjuryLifeInsurance') as string),
    post_injury_individual_health: getOptionalField(formData.get('postInjuryIndividualHealth') as string),
    post_injury_family_health: getOptionalField(formData.get('postInjuryFamilyHealth') as string),
    post_injury_retirement_plan: getOptionalField(formData.get('postInjuryRetirementPlan') as string),
    post_injury_investment_plan: getOptionalField(formData.get('postInjuryInvestmentPlan') as string),
    post_injury_bonus: getOptionalField(formData.get('postInjuryBonus') as string),
    post_injury_stock_options: getOptionalField(formData.get('postInjuryStockOptions') as string),
    post_injury_other_benefits: getOptionalField(formData.get('postInjuryOtherBenefits') as string),
    post_injury_retirement_age: getRequiredField(formData.get('postInjuryRetirementAge') as string),
    post_injury_job_expenses: getRequiredField(formData.get('postInjuryJobExpenses') as string),
    additional_info: getRequiredField(formData.get('additionalInfo') as string),
    
    // Household Services (all required, scale 0-5)
    dependent_care: getRequiredField(formData.get('dependentCare') as string),
    pet_care: getRequiredField(formData.get('petCare') as string),
    indoor_housework: getRequiredField(formData.get('indoorHousework') as string),
    meal_prep: getRequiredField(formData.get('mealPrep') as string),
    home_maintenance: getRequiredField(formData.get('homeMaintenance') as string),
    vehicle_maintenance: getRequiredField(formData.get('vehicleMaintenance') as string),
    errands: getRequiredField(formData.get('errands') as string),
    
    // Litigation (all required except matter_no)
    matter_no: getOptionalField(formData.get('matterNo') as string),
    settlement_date: formData.get('settlementDate') ? new Date(formData.get('settlementDate') as string).toISOString() : null,
    trial_date: formData.get('trialDate') ? new Date(formData.get('trialDate') as string).toISOString() : null,
    trial_location: getRequiredField(formData.get('trialLocation') as string),
    opposing_counsel_firm: getRequiredField(formData.get('opposingCounselFirm') as string),
    opposing_economist: getRequiredField(formData.get('opposingEconomist') as string),
    
    // Complex data as JSONB
    household_members: JSON.parse(formData.get('householdMembers') as string || '[]'),
    pre_injury_years: JSON.parse(formData.get('preInjuryYears') as string || '[]'),
    post_injury_years: JSON.parse(formData.get('postInjuryYears') as string || '[]'),
    uploaded_files: JSON.parse(formData.get('uploadedFiles') as string || '[]')
  }
}

// Generic function to extract normalized form data for Wrongful Death forms
function extractWrongfulDeathData(formData: FormData) {
  return {
    // Contact Information
    first_name: formData.get('firstName') as string || null,
    last_name: formData.get('lastName') as string || null,
    address1: formData.get('address1') as string || null,
    address2: formData.get('address2') as string || null,
    city: formData.get('city') as string || null,
    state: formData.get('state') as string || null,
    zip_code: formData.get('zipCode') as string || null,
    
    // Demographics
    gender: formData.get('gender') as string || null,
    marital_status: formData.get('maritalStatus') as string || null,
    date_of_birth: formData.get('dateOfBirth') ? new Date(formData.get('dateOfBirth') as string).toISOString() : null,
    date_of_death: formData.get('dateOfDeath') ? new Date(formData.get('dateOfDeath') as string).toISOString() : null,
    ethnicity: formData.get('ethnicity') as string || null,
    
    // Medical Information
    health_issues: formData.get('healthIssues') as string || null,
    work_missed: formData.get('workMissed') as string || null,
    
    // Education and Employment
    education_level: formData.get('educationLevel') as string || null,
    skills_licenses: formData.get('skillsLicenses') as string || null,
    employment_status: formData.get('employmentStatus') as string || null,
    job_title: formData.get('jobTitle') as string || null,
    employer_name: formData.get('employerName') as string || null,
    start_date: formData.get('startDate') ? new Date(formData.get('startDate') as string).toISOString() : null,
    salary: formData.get('salary') as string || null,
    work_duties: formData.get('workDuties') as string || null,
    advancements: formData.get('advancements') as string || null,
    overtime: formData.get('overtime') as string || null,
    work_steady: formData.get('workSteady') as string || null,
    retirement_age: formData.get('retirementAge') as string || null,
    career_trajectory: formData.get('careerTrajectory') as string || null,
    job_expenses: formData.get('jobExpenses') as string || null,
    
    // Benefits
    life_insurance: formData.get('lifeInsurance') as string || null,
    individual_health: formData.get('individualHealth') as string || null,
    family_health: formData.get('familyHealth') as string || null,
    retirement_plan: formData.get('retirementPlan') as string || null,
    investment_plan: formData.get('investmentPlan') as string || null,
    bonus: formData.get('bonus') as string || null,
    stock_options: formData.get('stockOptions') as string || null,
    other_benefits: formData.get('otherBenefits') as string || null,
    
    // Household Services
    dependent_care: formData.get('dependentCare') as string || null,
    pet_care: formData.get('petCare') as string || null,
    indoor_housework: formData.get('indoorHousework') as string || null,
    meal_prep: formData.get('mealPrep') as string || null,
    home_maintenance: formData.get('homeMaintenance') as string || null,
    vehicle_maintenance: formData.get('vehicleMaintenance') as string || null,
    errands: formData.get('errands') as string || null,
    
    // Litigation
    matter_no: formData.get('matterNo') as string || null,
    settlement_date: formData.get('settlementDate') ? new Date(formData.get('settlementDate') as string).toISOString() : null,
    trial_date: formData.get('trialDate') ? new Date(formData.get('trialDate') as string).toISOString() : null,
    trial_location: formData.get('trialLocation') as string || null,
    opposing_counsel_firm: formData.get('opposingCounselFirm') as string || null,
    opposing_economist: formData.get('opposingEconomist') as string || null,
    
    // Other Information
    additional_info: formData.get('additionalInfo') as string || null,
    
    // Complex data as JSONB
    household_dependents: JSON.parse(formData.get('householdDependents') as string || '[]'),
    other_dependents: JSON.parse(formData.get('otherDependents') as string || '[]'),
    employment_years: JSON.parse(formData.get('employmentYears') as string || '[]'),
    uploaded_files: JSON.parse(formData.get('uploadedFiles') as string || '[]')
  }
}

// Generic function to extract normalized form data for Wrongful Termination forms
function extractWrongfulTerminationData(formData: FormData) {
  return {
    // Contact Information
    first_name: formData.get('firstName') as string || null,
    last_name: formData.get('lastName') as string || null,
    address1: formData.get('address1') as string || null,
    address2: formData.get('address2') as string || null,
    city: formData.get('city') as string || null,
    state: formData.get('state') as string || null,
    zip_code: formData.get('zipCode') as string || null,
    email: formData.get('email') as string || null,
    phone_number: formData.get('phoneNumber') as string || null,
    phone_type: formData.get('phoneType') as string || null,
    
    // Demographics
    gender: formData.get('gender') as string || null,
    marital_status: formData.get('maritalStatus') as string || null,
    date_of_birth: formData.get('dateOfBirth') ? new Date(formData.get('dateOfBirth') as string).toISOString() : null,
    date_of_termination: formData.get('dateOfTermination') ? new Date(formData.get('dateOfTermination') as string).toISOString() : null,
    ethnicity: formData.get('ethnicity') as string || null,
    
    // Education
    pre_termination_education: formData.get('preTerminationEducation') as string || null,
    pre_termination_skills: formData.get('preTerminationSkills') as string || null,
    pre_termination_education_plans: formData.get('preTerminationEducationPlans') as string || null,
    post_termination_education: formData.get('postTerminationEducation') as string || null,
    
    // Pre-Termination Employment
    pre_termination_employment_status: formData.get('preTerminationEmploymentStatus') as string || null,
    pre_termination_job_title: formData.get('preTerminationJobTitle') as string || null,
    pre_termination_employer: formData.get('preTerminationEmployer') as string || null,
    pre_termination_start_date: formData.get('preTerminationStartDate') ? new Date(formData.get('preTerminationStartDate') as string).toISOString() : null,
    pre_termination_salary: formData.get('preTerminationSalary') as string || null,
    pre_termination_duties: formData.get('preTerminationDuties') as string || null,
    pre_termination_advancements: formData.get('preTerminationAdvancements') as string || null,
    pre_termination_overtime: formData.get('preTerminationOvertime') as string || null,
    pre_termination_work_steady: formData.get('preTerminationWorkSteady') as string || null,
    pre_termination_retirement_age: formData.get('preTerminationRetirementAge') as string || null,
    pre_termination_career_trajectory: formData.get('preTerminationCareerTrajectory') as string || null,
    pre_termination_job_expenses: formData.get('preTerminationJobExpenses') as string || null,
    
    // Pre-Termination Benefits
    pre_termination_life_insurance: formData.get('preTerminationLifeInsurance') as string || null,
    pre_termination_individual_health: formData.get('preTerminationIndividualHealth') as string || null,
    pre_termination_family_health: formData.get('preTerminationFamilyHealth') as string || null,
    pre_termination_retirement_plan: formData.get('preTerminationRetirementPlan') as string || null,
    pre_termination_investment_plan: formData.get('preTerminationInvestmentPlan') as string || null,
    pre_termination_bonus: formData.get('preTerminationBonus') as string || null,
    pre_termination_stock_options: formData.get('preTerminationStockOptions') as string || null,
    pre_termination_other_benefits: formData.get('preTerminationOtherBenefits') as string || null,
    
    // Post-Termination Employment
    post_termination_employment_status: formData.get('postTerminationEmploymentStatus') as string || null,
    post_termination_job_title: formData.get('postTerminationJobTitle') as string || null,
    post_termination_employer: formData.get('postTerminationEmployer') as string || null,
    post_termination_start_date: formData.get('postTerminationStartDate') ? new Date(formData.get('postTerminationStartDate') as string).toISOString() : null,
    post_termination_salary: formData.get('postTerminationSalary') as string || null,
    post_termination_duties: formData.get('postTerminationDuties') as string || null,
    post_termination_advancements: formData.get('postTerminationAdvancements') as string || null,
    post_termination_overtime: formData.get('postTerminationOvertime') as string || null,
    post_termination_work_steady: formData.get('postTerminationWorkSteady') as string || null,
    post_termination_retirement_age: formData.get('postTerminationRetirementAge') as string || null,
    post_termination_job_expenses: formData.get('postTerminationJobExpenses') as string || null,
    
    // Post-Termination Benefits
    post_termination_life_insurance: formData.get('postTerminationLifeInsurance') as string || null,
    post_termination_individual_health: formData.get('postTerminationIndividualHealth') as string || null,
    post_termination_family_health: formData.get('postTerminationFamilyHealth') as string || null,
    post_termination_retirement_plan: formData.get('postTerminationRetirementPlan') as string || null,
    post_termination_investment_plan: formData.get('postTerminationInvestmentPlan') as string || null,
    post_termination_bonus: formData.get('postTerminationBonus') as string || null,
    post_termination_stock_options: formData.get('postTerminationStockOptions') as string || null,
    post_termination_other_benefits: formData.get('postTerminationOtherBenefits') as string || null,
    
    // Litigation
    matter_no: formData.get('matterNo') as string || null,
    settlement_date: formData.get('settlementDate') ? new Date(formData.get('settlementDate') as string).toISOString() : null,
    trial_date: formData.get('trialDate') ? new Date(formData.get('trialDate') as string).toISOString() : null,
    trial_location: formData.get('trialLocation') as string || null,
    opposing_counsel_firm: formData.get('opposingCounselFirm') as string || null,
    opposing_economist: formData.get('opposingEconomist') as string || null,
    
    // Other Information
    additional_info: formData.get('additionalInfo') as string || null,
    
    // Complex data as JSONB
    pre_termination_years: JSON.parse(formData.get('preTerminationYears') as string || '[]'),
    post_termination_years: JSON.parse(formData.get('postTerminationYears') as string || '[]'),
    uploaded_files: JSON.parse(formData.get('uploadedFiles') as string || '[]')
  }
}

// Helper function to get authenticated user from session
async function getAuthenticatedUser() {
  const supabase = await createClient()
  
  // Use getUser() instead of getSession() for better security
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error('User authentication error:', userError)
    throw new Error('User not authenticated')
  }

  // Get the user profile
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('firm_id, role')
    .eq('user_id', user.id)
    .single()

  console.log('Profile query result:', { profile, profileError })

  if (profileError || !profile) {
    console.error('Profile query error:', profileError)
    throw new Error('User profile not found')
  }

  return { user, profile }
}

// Generic helper function for audit trail creation
async function createAuditTrail(formId: string, formType: string, actionType: string, userId: string, firmId: string | null, metadata: Record<string, unknown>) {
  try {
    const supabase = await createClient()
    const { error: auditError } = await supabase.rpc('create_form_audit_entry', {
      p_form_id: formId,
      p_form_type: formType,
      p_submitted_by: userId,
      p_firm_id: firmId,
      p_action_type: actionType,
      p_metadata: {
        timestamp: new Date().toISOString(),
        ...metadata
      }
    })

    if (auditError) {
      console.warn(`Failed to create ${actionType} audit entry:`, auditError)
    }
  } catch (error) {
    console.warn(`Audit trail creation failed:`, error)
  }
}

// PERSONAL INJURY FORM FUNCTIONS
export async function submitPersonalInjuryForm(formData: FormData) {
  try {
    const normalizedData = extractPersonalInjuryData(formData)
    const { user, profile } = await getAuthenticatedUser()
    
    // Validate required fields
    if (!normalizedData.first_name || !normalizedData.last_name || !normalizedData.email) {
      throw new Error('Missing required fields')
    }
    
    // Insert into normalized table structure
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('personal_injury_forms')
      .insert([{
        ...normalizedData,
        submitted_by: user.id,
        firm_id: profile?.firm_id,
        status: 'submitted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error('Failed to submit form. Please try again.')
    }

    const formId = data?.[0]?.id
    if (formId) {
      await createAuditTrail(formId, 'personal_injury', 'submitted', user.id, profile?.firm_id, {
        form_fields_count: Object.keys(normalizedData).length
      })
    }

    console.log('Personal injury form submitted successfully!')
    return { success: true, id: formId }
  } catch (error) {
    console.error('Error submitting personal injury form:', error)
    throw error
  }
}

export async function saveDraftPersonalInjuryForm(formData: FormData) {
  try {
    const normalizedData = extractPersonalInjuryData(formData)
    const { user, profile } = await getAuthenticatedUser()
    
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('personal_injury_drafts')
      .insert([{
        ...normalizedData,
        submitted_by: user.id,
        firm_id: profile?.firm_id,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()

    if (error) {
      console.error('Supabase error saving draft:', error)
      throw new Error('Failed to save draft. Please try again.')
    }

    return { success: true, draftId: data?.[0]?.id }
  } catch (error) {
    console.error('Error saving personal injury draft:', error)
    throw new Error('Failed to save draft. Please try again.')
  }
}

// WRONGFUL DEATH FORM FUNCTIONS
export async function submitWrongfulDeathForm(formData: FormData) {
  try {
    const normalizedData = extractWrongfulDeathData(formData)
    const { user, profile } = await getAuthenticatedUser()
    
    // Validate required fields
    if (!normalizedData.first_name || !normalizedData.last_name) {
      throw new Error('Missing required fields')
    }
    
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('wrongful_death_forms')
      .insert([{
        ...normalizedData,
        submitted_by: user.id,
        firm_id: profile?.firm_id,
        status: 'submitted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error('Failed to submit form. Please try again.')
    }

    const formId = data?.[0]?.id
    if (formId) {
      await createAuditTrail(formId, 'wrongful_death', 'submitted', user.id, profile?.firm_id, {
        form_fields_count: Object.keys(normalizedData).length
      })
    }

    console.log('Wrongful death form submitted successfully!')
    return { success: true, id: formId }
  } catch (error) {
    console.error('Error submitting wrongful death form:', error)
    throw error
  }
}

export async function saveDraftWrongfulDeathForm(formData: FormData) {
  try {
    const normalizedData = extractWrongfulDeathData(formData)
    const { user, profile } = await getAuthenticatedUser()
    
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('wrongful_death_drafts')
      .insert([{
        ...normalizedData,
        submitted_by: user.id,
        firm_id: profile?.firm_id,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()

    if (error) {
      console.error('Supabase error saving draft:', error)
      throw new Error('Failed to save draft. Please try again.')
    }

    return { success: true, draftId: data?.[0]?.id }
  } catch (error) {
    console.error('Error saving wrongful death draft:', error)
    throw new Error('Failed to save draft. Please try again.')
  }
}

// WRONGFUL TERMINATION FORM FUNCTIONS
export async function submitWrongfulTerminationForm(formData: FormData) {
  try {
    const normalizedData = extractWrongfulTerminationData(formData)
    const { user, profile } = await getAuthenticatedUser()
    
    // Validate required fields
    if (!normalizedData.first_name || !normalizedData.last_name) {
      throw new Error('Missing required fields')
    }
    
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('wrongful_termination_forms')
      .insert([{
        ...normalizedData,
        submitted_by: user.id,
        firm_id: profile?.firm_id,
        status: 'submitted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error('Failed to submit form. Please try again.')
    }

    const formId = data?.[0]?.id
    if (formId) {
      await createAuditTrail(formId, 'wrongful_termination', 'submitted', user.id, profile?.firm_id, {
        form_fields_count: Object.keys(normalizedData).length
      })
    }

    console.log('Wrongful termination form submitted successfully!')
    return { success: true, id: formId }
  } catch (error) {
    console.error('Error submitting wrongful termination form:', error)
    throw error
  }
}

export async function saveDraftWrongfulTerminationForm(formData: FormData) {
  try {
    const normalizedData = extractWrongfulTerminationData(formData)
    const { user, profile } = await getAuthenticatedUser()
    
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('wrongful_termination_drafts')
      .insert([{
        ...normalizedData,
        submitted_by: user.id,
        firm_id: profile?.firm_id,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()

    if (error) {
      console.error('Supabase error saving draft:', error)
      throw new Error('Failed to save draft. Please try again.')
    }

    return { success: true, draftId: data?.[0]?.id }
  } catch (error) {
    console.error('Error saving wrongful termination draft:', error)
    throw new Error('Failed to save draft. Please try again.')
  }
}

// GENERIC DELETE FUNCTION (works for all form types)
export async function deletePersonalInjuryForm(formId: string, lastNameConfirmation: string) {
  try {
    const { user, profile } = await getAuthenticatedUser()

    // Get the form to verify ownership and get last name
    const supabase = await createClient()
    const { data: form, error: fetchError } = await supabase
      .from('personal_injury_forms')
      .select('*, submitted_by')
      .eq('id', formId)
      .single()

    if (fetchError || !form) {
      return { success: false, error: 'Form not found' }
    }

    // Check permissions
    const isSiteAdmin = profile?.role === 'site_admin'
    const isOwner = form.submitted_by === user.id

    if (!isSiteAdmin && !isOwner) {
      return { success: false, error: 'Unauthorized to delete this form' }
    }

    // Verify last name matches (now using normalized column)
    const actualLastName = form.last_name || ''
    
    if (actualLastName.toLowerCase() !== lastNameConfirmation.toLowerCase()) {
      return { success: false, error: 'Last name confirmation does not match' }
    }

    // Record deletion in audit trail before deleting
    await createAuditTrail(formId, 'personal_injury', 'deleted', user.id, profile?.firm_id, {
      deleted_by_role: profile?.role,
      last_name_confirmed: lastNameConfirmation
    })

    // Delete the form
    const { error: deleteError } = await supabase
      .from('personal_injury_forms')
      .delete()
      .eq('id', formId)

    if (deleteError) {
      throw deleteError
    }

    // Also delete any associated draft
    await supabase
      .from('personal_injury_drafts')
      .delete()
      .eq('submitted_by', user.id)

    return { success: true }
    
  } catch (error) {
    console.error('Error deleting form:', error)
    return { success: false, error: 'Failed to delete form' }
  }
}

// UPDATE PERSONAL INJURY FORM FUNCTION
export async function updatePersonalInjuryForm(formId: string, formData: FormData) {
  try {
    const normalizedData = extractPersonalInjuryData(formData)
    const { user, profile } = await getAuthenticatedUser()
    
    const supabase = await createClient()
    
    // Check permissions - user must be owner or site admin
    const { data: existingForm, error: fetchError } = await supabase
      .from('personal_injury_forms')
      .select('submitted_by, firm_id')
      .eq('id', formId)
      .single()

    if (fetchError || !existingForm) {
      throw new Error('Form not found')
    }

    const isSiteAdmin = profile?.role === 'site_admin'
    const isOwner = existingForm.submitted_by === user.id
    const isSameFirm = existingForm.firm_id === profile?.firm_id

    if (!isSiteAdmin && !(isOwner && isSameFirm)) {
      throw new Error('Unauthorized to edit this form')
    }
    
    // Update the form - the trigger will handle version tracking
    const { error } = await supabase
      .from('personal_injury_forms')
      .update({
        ...normalizedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', formId)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error('Failed to update form. Please try again.')
    }

    // Create audit trail for the update
    await createAuditTrail(formId, 'personal_injury', 'updated', user.id, profile?.firm_id, {
      form_fields_count: Object.keys(normalizedData).length,
      updated_by_role: profile?.role
    })

    console.log('Personal injury form updated successfully!')
    return { success: true, id: formId }
  } catch (error) {
    console.error('Error updating personal injury form:', error)
    throw error
  }
}

// UTILITY FUNCTIONS (unchanged from previous version)
export async function getFirmUsers(firmId: string) {
  try {
    const supabase = await createClient()
    const { data: firmUsers, error } = await supabase
      .rpc('get_firm_users_with_details', { firm_id_param: firmId })

    if (error) {
      const { data: basicUsers, error: basicError } = await supabase
        .from('user_profiles')
        .select(`id, user_id, first_name, last_name, role`)
        .eq('firm_id', firmId)
        .neq('role', 'site_admin')

      if (basicError) throw basicError

      const usersWithCounts = await Promise.all(
        basicUsers.map(async (user) => {
          const { count: savedCount } = await supabase
            .from('personal_injury_drafts')
            .select('*', { count: 'exact' })
            .eq('submitted_by', user.user_id)

          const { count: submittedCount } = await supabase
            .from('personal_injury_forms')
            .select('*', { count: 'exact' })
            .eq('submitted_by', user.user_id)

          return {
            ...user,
            email: 'Email not available',
            saved_forms_count: savedCount || 0,
            submitted_forms_count: submittedCount || 0
          }
        })
      )

      return { success: true, users: usersWithCounts }
    }

    return { success: true, users: firmUsers }
  } catch (error) {
    console.error('Error fetching firm users:', error)
    return { success: false, error: 'Failed to fetch firm users' }
  }
}

export async function removeUserFromFirm(userId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('user_profiles')
      .update({ firm_id: null, role: 'user' })
      .eq('user_id', userId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error removing user from firm:', error)
    return { success: false, error: 'Failed to remove user from firm' }
  }
}

/**
 * Invites a user to join a firm via email invitation
 * 
 * @param email - The email address to invite (must match the firm domain)
 * @param firmId - The ID of the firm to invite the user to
 * @param firmDomain - The domain of the firm (for validation)
 * @returns Promise with success/error status, message, and userExists flag
 */
export async function inviteUserToFirmAction(email: string, firmId: string, firmDomain: string): Promise<{ success: boolean; error?: string; message?: string; userExists?: boolean }> {
  try {
    const emailDomain = email.split('@')[1]
    if (emailDomain !== firmDomain) {
      return { success: false, error: `Email must use ${firmDomain} domain` }
    }

    const adminClient = createAdminClient()
    
    // Check if user already exists with this email
    const { data: usersList } = await adminClient.auth.admin.listUsers()
    const existingAuthUser = usersList?.users?.find(user => user.email === email.toLowerCase())
    
    if (existingAuthUser) {
      return { 
        success: false, 
        error: `User with email ${email} already exists in the system. Please use the "Reset Password" function to send them a password reset email instead.`,
        userExists: true
      }
    }

    // Send invitation email
    const { error: emailError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/complete-profile`,
      data: {
        firm_id: firmId,
        role: 'user'
      }
    })

    if (emailError) {
      console.error('Failed to send invitation email:', emailError)
      return { success: false, error: 'Failed to send invitation email' }
    }

    return { success: true, message: 'Invitation sent successfully' }
  } catch (error) {
    console.error('Error inviting user:', error)
    return { success: false, error: 'Failed to invite user' }
  }
}

/**
 * Sends a password reset email to an existing user
 * 
 * @param email - The email address of the user
 * @returns Promise with success/error status and message
 */
export async function sendPasswordResetAction(email: string) {
  try {
    const supabase = await createClient()
    
    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
    })

    if (error) {
      console.error('Failed to send password reset email:', error)
      return { success: false, error: 'Failed to send password reset email' }
    }

    return { success: true, message: `Password reset email sent to ${email}` }
  } catch (error) {
    console.error('Error sending password reset:', error)
    return { success: false, error: 'Failed to send password reset email' }
  }
}

export async function getDraftPersonalInjuryForm(userId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('personal_injury_drafts')
      .select('*')
      .eq('submitted_by', userId)
      .eq('status', 'draft')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase error getting draft:', error)
      throw new Error('Failed to load draft.')
    }

    return data || null
  } catch (error) {
    console.error('Error getting draft:', error)
    return null
  }
}

export async function updateDraftPersonalInjuryForm(draftId: string, formData: FormData) {
  try {
    const normalizedData = extractPersonalInjuryData(formData)
    
    const supabase = await createClient()
    const { error } = await supabase
      .from('personal_injury_drafts')
      .update({
        ...normalizedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', draftId)

    if (error) {
      console.error('Supabase error updating draft:', error)
      throw new Error('Failed to update draft. Please try again.')
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating draft:', error)
    throw new Error('Failed to update draft. Please try again.')
  }
}

// UPDATE WRONGFUL DEATH FORM FUNCTION
export async function updateWrongfulDeathForm(formId: string, formData: FormData) {
  try {
    const normalizedData = extractWrongfulDeathData(formData)
    const { user, profile } = await getAuthenticatedUser()
    
    const supabase = await createClient()
    
    // Check permissions - user must be owner or site admin
    const { data: existingForm, error: fetchError } = await supabase
      .from('wrongful_death_forms')
      .select('submitted_by, firm_id')
      .eq('id', formId)
      .single()

    if (fetchError || !existingForm) {
      throw new Error('Form not found')
    }

    const isSiteAdmin = profile?.role === 'site_admin'
    const isOwner = existingForm.submitted_by === user.id
    const isSameFirm = existingForm.firm_id === profile?.firm_id

    if (!isSiteAdmin && !(isOwner && isSameFirm)) {
      throw new Error('Unauthorized to edit this form')
    }
    
    // Update the form - the trigger will handle version tracking
    const { error } = await supabase
      .from('wrongful_death_forms')
      .update({
        ...normalizedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', formId)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error('Failed to update form. Please try again.')
    }

    // Create audit trail for the update
    await createAuditTrail(formId, 'wrongful_death', 'updated', user.id, profile?.firm_id, {
      form_fields_count: Object.keys(normalizedData).length,
      updated_by_role: profile?.role
    })

    console.log('Wrongful death form updated successfully!')
    return { success: true, id: formId }
  } catch (error) {
    console.error('Error updating wrongful death form:', error)
    throw error
  }
}

// UPDATE WRONGFUL TERMINATION FORM FUNCTION
export async function updateWrongfulTerminationForm(formId: string, formData: FormData) {
  try {
    const normalizedData = extractWrongfulTerminationData(formData)
    const { user, profile } = await getAuthenticatedUser()
    
    const supabase = await createClient()
    
    // Check permissions - user must be owner or site admin
    const { data: existingForm, error: fetchError } = await supabase
      .from('wrongful_termination_forms')
      .select('submitted_by, firm_id')
      .eq('id', formId)
      .single()

    if (fetchError || !existingForm) {
      throw new Error('Form not found')
    }

    const isSiteAdmin = profile?.role === 'site_admin'
    const isOwner = existingForm.submitted_by === user.id
    const isSameFirm = existingForm.firm_id === profile?.firm_id

    if (!isSiteAdmin && !(isOwner && isSameFirm)) {
      throw new Error('Unauthorized to edit this form')
    }
    
    // Update the form - the trigger will handle version tracking
    const { error } = await supabase
      .from('wrongful_termination_forms')
      .update({
        ...normalizedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', formId)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error('Failed to update form. Please try again.')
    }

    // Create audit trail for the update
    await createAuditTrail(formId, 'wrongful_termination', 'updated', user.id, profile?.firm_id, {
      form_fields_count: Object.keys(normalizedData).length,
      updated_by_role: profile?.role
    })

    console.log('Wrongful termination form updated successfully!')
    return { success: true, id: formId }
  } catch (error) {
    console.error('Error updating wrongful termination form:', error)
    throw error
  }
}