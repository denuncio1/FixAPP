-- Create gamification_stats table
CREATE TABLE public.gamification_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  technician_id UUID REFERENCES public.technicians(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0 NOT NULL,
  rank INTEGER,
  medals TEXT[] DEFAULT '{}'::TEXT[] NOT NULL, -- Array of medal names
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.gamification_stats ENABLE ROW LEVEL SECURITY;

-- Policies for gamification_stats
-- Managers can view all gamification stats
CREATE POLICY "Managers can view all gamification stats" ON public.gamification_stats
FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager'));

-- Technicians can view their own gamification stats
CREATE POLICY "Technicians can view their own gamification stats" ON public.gamification_stats
FOR SELECT TO authenticated USING (technician_id = (SELECT id FROM public.technicians WHERE user_id = auth.uid()));

-- Managers can insert gamification stats
CREATE POLICY "Managers can insert gamification stats" ON public.gamification_stats
FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager'));

-- Managers can update gamification stats
CREATE POLICY "Managers can update gamification stats" ON public.gamification_stats
FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager'));

-- No delete policy for gamification stats, or only for managers
CREATE POLICY "Managers can delete gamification stats" ON public.gamification_stats
FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager'));

-- Add a trigger to update `last_updated` column on changes
CREATE TRIGGER update_gamification_stats_last_updated
BEFORE UPDATE ON public.gamification_stats
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();