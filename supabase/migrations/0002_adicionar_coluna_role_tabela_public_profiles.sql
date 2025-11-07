ALTER TABLE public.profiles
ADD COLUMN role TEXT DEFAULT 'technician' NOT NULL;

-- Opcional: Atualizar perfis existentes para ter um papel padrão se a coluna for nova
UPDATE public.profiles
SET role = 'technician'
WHERE role IS NULL;