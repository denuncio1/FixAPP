-- Create technicians table
CREATE TABLE public.technicians (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to Supabase Auth user
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Link to profile for additional data
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address TEXT,
  skills TEXT[] DEFAULT '{}'::TEXT[], -- Array of skills
  avatar_url TEXT,
  color TEXT DEFAULT '#6B7280', -- Default color for map routes
  start_lat NUMERIC,
  start_lng NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;

-- Policies for technicians table
-- Authenticated users can view all technicians (for assignment purposes, etc.)
CREATE POLICY "Authenticated users can view technicians" ON public.technicians
FOR SELECT TO authenticated USING (true);

-- Managers can insert new technicians
CREATE POLICY "Managers can insert technicians" ON public.technicians
FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager'));

-- Managers can update any technician's data
CREATE POLICY "Managers can update any technician" ON public.technicians
FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager'));

-- Technicians can update their own data
CREATE POLICY "Technicians can update their own data" ON public.technicians
FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Managers can delete technicians
CREATE POLICY "Managers can delete technicians" ON public.technicians
FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager'));

-- Add a trigger to update `updated_at` column on changes
CREATE TRIGGER update_technicians_updated_at
BEFORE UPDATE ON public.technicians
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();