-- Script para crear la tabla simulations en Supabase si no existe

-- Verificar si la tabla simulations ya existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'simulations'
    ) THEN
        -- Crear la tabla simulations si no existe
        CREATE TABLE public.simulations (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            loan_type TEXT NOT NULL,
            car_price NUMERIC NOT NULL,
            loan_amount NUMERIC NOT NULL,
            term_months INTEGER NOT NULL,
            monthly_payment NUMERIC NOT NULL,
            notes TEXT,
            is_application BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Añadir comentarios a la tabla y columnas
        COMMENT ON TABLE public.simulations IS 'Tabla para almacenar simulaciones de préstamos';
        COMMENT ON COLUMN public.simulations.id IS 'Identificador único de la simulación';
        COMMENT ON COLUMN public.simulations.name IS 'Nombre del cliente';
        COMMENT ON COLUMN public.simulations.last_name IS 'Apellido del cliente';
        COMMENT ON COLUMN public.simulations.email IS 'Correo electrónico del cliente';
        COMMENT ON COLUMN public.simulations.phone IS 'Teléfono del cliente';
        COMMENT ON COLUMN public.simulations.loan_type IS 'Tipo de préstamo (auto_loan, car_backed_loan)';
        COMMENT ON COLUMN public.simulations.car_price IS 'Precio del auto';
        COMMENT ON COLUMN public.simulations.loan_amount IS 'Monto del préstamo';
        COMMENT ON COLUMN public.simulations.term_months IS 'Plazo del préstamo en meses';
        COMMENT ON COLUMN public.simulations.monthly_payment IS 'Pago mensual';
        COMMENT ON COLUMN public.simulations.notes IS 'Notas adicionales';
        COMMENT ON COLUMN public.simulations.is_application IS 'Indica si es una solicitud de préstamo';
        COMMENT ON COLUMN public.simulations.created_at IS 'Fecha de creación';
        COMMENT ON COLUMN public.simulations.updated_at IS 'Fecha de actualización';
        
        -- Configurar permisos RLS (Row Level Security)
        ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
        
        -- Crear política para permitir inserción anónima
        CREATE POLICY "Allow anonymous insert" ON public.simulations
            FOR INSERT TO anon
            WITH CHECK (true);
            
        -- Crear política para permitir lectura anónima
        CREATE POLICY "Allow anonymous select" ON public.simulations
            FOR SELECT TO anon
            USING (true);
        
        RAISE NOTICE 'Tabla simulations creada correctamente';
    ELSE
        RAISE NOTICE 'La tabla simulations ya existe';
    END IF;
END $$;

-- Mostrar la estructura actual de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'simulations'
ORDER BY ordinal_position; 