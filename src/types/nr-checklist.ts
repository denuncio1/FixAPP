export interface NormaRegulamentadora {
  id: string;
  user_id: string;
  nr_number: string;
  title: string;
  description?: string;
  content_url?: string;
  last_updated?: string; // ISO date string
  created_at: string;
}

export interface NrChecklistItem {
  id: string;
  user_id: string;
  nr_number: string;
  item_description: string;
  guidance?: string;
  is_compliant?: boolean; // null for not evaluated, true for compliant, false for non-compliant
  notes?: string;
  created_at: string;
  updated_at: string;
  is_header?: boolean; // To mark items that are just section headers
}

export interface NrChecklistRun {
  id: string;
  user_id: string;
  nr_number: string;
  completion_date: string; // ISO date string
  compliance_percentage: number;
  total_items: number;
  compliant_items: number;
  non_compliant_items: number;
  notes?: string;
  created_at: string;
}