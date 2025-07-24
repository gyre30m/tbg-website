'use server'

import { supabase } from './supabase'

// Generic function to extract normalized form data for Personal Injury forms
function extractPersonalInjuryData(formData: FormData) {
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
    phone: formData.get('phone') as string || null,
    phone_type: formData.get('phoneType') as string || null,
    
    // Demographics
    gender: formData.get('gender') as string || null,
    marital_status: formData.get('maritalStatus') as string || null,
    ethnicity: formData.get('ethnicity') as string || null,
    date_of_birth: formData.get('dateOfBirth') ? new Date(formData.get('dateOfBirth') as string).toISOString() : null,
    
    // Medical Information
    incident_date: formData.get('incidentDate') ? new Date(formData.get('incidentDate') as string).toISOString() : null,
    injury_description: formData.get('injuryDescription') as string || null,
    caregiver_claim: formData.get('caregiverClaim') as string || null,
    life_expectancy: formData.get('lifeExpectancy') as string || null,
    future_medical: formData.get('futureMedical') as string || null,
    
    // Education
    pre_injury_education: formData.get('preInjuryEducation') as string || null,
    pre_injury_skills: formData.get('preInjurySkills') as string || null,
    education_plans: formData.get('educationPlans') as string || null,
    parent_education: formData.get('parentEducation') as string || null,
    post_injury_education: formData.get('postInjuryEducation') as string || null,
    
    // Pre-Injury Employment
    pre_injury_employment_status: formData.get('preInjuryEmploymentStatus') as string || null,
    pre_injury_job_title: formData.get('preInjuryJobTitle') as string || null,
    pre_injury_employer: formData.get('preInjuryEmployer') as string || null,
    pre_injury_start_date: formData.get('preInjuryStartDate') ? new Date(formData.get('preInjuryStartDate') as string).toISOString() : null,
    pre_injury_salary: formData.get('preInjurySalary') as string || null,
    pre_injury_duties: formData.get('preInjuryDuties') as string || null,
    pre_injury_advancements: formData.get('preInjuryAdvancements') as string || null,
    pre_injury_overtime: formData.get('preInjuryOvertime') as string || null,
    pre_injury_work_steady: formData.get('preInjuryWorkSteady') as string || null,
    pre_injury_life_insurance: formData.get('preInjuryLifeInsurance') as string || null,
    pre_injury_individual_health: formData.get('preInjuryIndividualHealth') as string || null,
    pre_injury_family_health: formData.get('preInjuryFamilyHealth') as string || null,
    pre_injury_retirement_plan: formData.get('preInjuryRetirementPlan') as string || null,
    pre_injury_investment_plan: formData.get('preInjuryInvestmentPlan') as string || null,
    pre_injury_bonus: formData.get('preInjuryBonus') as string || null,
    pre_injury_stock_options: formData.get('preInjuryStockOptions') as string || null,
    pre_injury_other_benefits: formData.get('preInjuryOtherBenefits') as string || null,
    pre_injury_retirement_age: formData.get('preInjuryRetirementAge') as string || null,
    pre_injury_career_trajectory: formData.get('preInjuryCareerTrajectory') as string || null,
    pre_injury_job_expenses: formData.get('preInjuryJobExpenses') as string || null,
    
    // Post-Injury Employment
    disability_rating: formData.get('disabilityRating') as string || null,
    post_injury_employment_status: formData.get('postInjuryEmploymentStatus') as string || null,
    post_injury_job_title: formData.get('postInjuryJobTitle') as string || null,
    post_injury_employer: formData.get('postInjuryEmployer') as string || null,
    post_injury_start_date: formData.get('postInjuryStartDate') ? new Date(formData.get('postInjuryStartDate') as string).toISOString() : null,
    post_injury_salary: formData.get('postInjurySalary') as string || null,
    post_injury_duties: formData.get('postInjuryDuties') as string || null,
    post_injury_advancements: formData.get('postInjuryAdvancements') as string || null,
    post_injury_overtime: formData.get('postInjuryOvertime') as string || null,
    post_injury_work_steady: formData.get('postInjuryWorkSteady') as string || null,
    post_injury_life_insurance: formData.get('postInjuryLifeInsurance') as string || null,
    post_injury_individual_health: formData.get('postInjuryIndividualHealth') as string || null,
    post_injury_family_health: formData.get('postInjuryFamilyHealth') as string || null,
    post_injury_retirement_plan: formData.get('postInjuryRetirementPlan') as string || null,
    post_injury_investment_plan: formData.get('postInjuryInvestmentPlan') as string || null,
    post_injury_bonus: formData.get('postInjuryBonus') as string || null,
    post_injury_stock_options: formData.get('postInjuryStockOptions') as string || null,
    post_injury_other_benefits: formData.get('postInjuryOtherBenefits') as string || null,
    post_injury_retirement_age: formData.get('postInjuryRetirementAge') as string || null,
    post_injury_job_expenses: formData.get('postInjuryJobExpenses') as string || null,
    additional_info: formData.get('additionalInfo') as string || null,
    
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

// Generic helper function for authentication and profile lookup
async function getAuthenticatedUser() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    throw new Error('User not authenticated')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('firm_id, role')
    .eq('user_id', session.user.id)
    .single()

  return { session, profile }
}

// Generic helper function for audit trail creation
async function createAuditTrail(formId: string, formType: string, actionType: string, userId: string, firmId: string | null, metadata: Record<string, unknown>) {
  try {
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
    const { session, profile } = await getAuthenticatedUser()
    
    // Validate required fields
    if (!normalizedData.first_name || !normalizedData.last_name || !normalizedData.email) {
      throw new Error('Missing required fields')
    }
    
    // Insert into normalized table structure
    const { data, error } = await supabase
      .from('personal_injury_forms')
      .insert([{
        ...normalizedData,
        submitted_by: session.user.id,
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
      await createAuditTrail(formId, 'personal_injury', 'submitted', session.user.id, profile?.firm_id, {
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
    const { session, profile } = await getAuthenticatedUser()
    
    const { data, error } = await supabase
      .from('personal_injury_drafts')
      .insert([{
        ...normalizedData,
        submitted_by: session.user.id,
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
    const { session, profile } = await getAuthenticatedUser()
    
    // Validate required fields
    if (!normalizedData.first_name || !normalizedData.last_name) {
      throw new Error('Missing required fields')
    }
    
    const { data, error } = await supabase
      .from('wrongful_death_forms')
      .insert([{
        ...normalizedData,
        submitted_by: session.user.id,
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
      await createAuditTrail(formId, 'wrongful_death', 'submitted', session.user.id, profile?.firm_id, {
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
    const { session, profile } = await getAuthenticatedUser()
    
    const { data, error } = await supabase
      .from('wrongful_death_drafts')
      .insert([{
        ...normalizedData,
        submitted_by: session.user.id,
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
    const { session, profile } = await getAuthenticatedUser()
    
    // Validate required fields
    if (!normalizedData.first_name || !normalizedData.last_name) {
      throw new Error('Missing required fields')
    }
    
    const { data, error } = await supabase
      .from('wrongful_termination_forms')
      .insert([{
        ...normalizedData,
        submitted_by: session.user.id,
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
      await createAuditTrail(formId, 'wrongful_termination', 'submitted', session.user.id, profile?.firm_id, {
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
    const { session, profile } = await getAuthenticatedUser()
    
    const { data, error } = await supabase
      .from('wrongful_termination_drafts')
      .insert([{
        ...normalizedData,
        submitted_by: session.user.id,
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
    const { session, profile } = await getAuthenticatedUser()

    // Get the form to verify ownership and get last name
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
    const isOwner = form.submitted_by === session.user.id

    if (!isSiteAdmin && !isOwner) {
      return { success: false, error: 'Unauthorized to delete this form' }
    }

    // Verify last name matches (now using normalized column)
    const actualLastName = form.last_name || ''
    
    if (actualLastName.toLowerCase() !== lastNameConfirmation.toLowerCase()) {
      return { success: false, error: 'Last name confirmation does not match' }
    }

    // Record deletion in audit trail before deleting
    await createAuditTrail(formId, 'personal_injury', 'deleted', session.user.id, profile?.firm_id, {
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
      .eq('submitted_by', session.user.id)

    return { success: true }
    
  } catch (error) {
    console.error('Error deleting form:', error)
    return { success: false, error: 'Failed to delete form' }
  }
}

// UTILITY FUNCTIONS (unchanged from previous version)
export async function getFirmUsers(firmId: string) {
  try {
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

export async function inviteUserToFirmAction(email: string, firmId: string, firmDomain: string) {
  try {
    const emailDomain = email.split('@')[1]
    if (emailDomain !== firmDomain) {
      return { success: false, error: `Email must use ${firmDomain} domain` }
    }

    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('firm_id', firmId)
      .eq('user_id', email)

    if (existingUser && existingUser.length > 0) {
      return { success: false, error: 'User already exists in this firm' }
    }

    const { error } = await supabase
      .from('user_invitations')
      .insert([{
        email: email.toLowerCase(),
        firm_id: firmId,
        role: 'user',
        invited_at: new Date().toISOString(),
      }])

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error inviting user:', error)
    return { success: false, error: 'Failed to invite user' }
  }
}

export async function getDraftPersonalInjuryForm(userId: string) {
  try {
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