export interface User {
  id: string;
  email: string;
  role: 'site_admin' | 'firm_admin' | 'user';
  firm_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Firm {
  id: string;
  name: string;
  domain: string;
  firm_admin_id?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  main_phone?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  firm_id?: string;
  role: 'site_admin' | 'firm_admin' | 'user';
  first_name?: string;
  last_name?: string;
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: string;
  form_data: Record<string, unknown>;
  submitted_by: string;
  firm_id?: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'submitted';
}