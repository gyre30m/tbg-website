import { z } from 'zod'

export const personalInjurySchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'Please enter a valid zip code'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  phoneType: z.enum(['mobile', 'home', 'work', 'other'], {
    required_error: 'Please select a phone type',
  }),
  directContactConsent: z.enum(['yes', 'no'], {
    required_error: 'Please indicate if The Bradley Group may contact the injured party directly',
  }),
  gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say'], {
    required_error: 'Please select a gender',
  }),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'separated', 'domestic-partnership'], {
    required_error: 'Please select a marital status',
  }),
  ethnicity: z.enum(['american-indian', 'asian', 'black', 'hispanic', 'pacific-islander', 'white', 'two-or-more', 'prefer-not-to-say']).optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  incidentDate: z.string().min(1, 'Incident date is required'),
  incidentDescription: z.string().min(10, 'Please provide a detailed description'),
  injuryType: z.string().min(1, 'Please select an injury type'),
  medicalTreatment: z.enum(['yes', 'no'], {
    required_error: 'Please indicate if you received medical treatment',
  }),
})

export type PersonalInjuryFormData = z.infer<typeof personalInjurySchema>