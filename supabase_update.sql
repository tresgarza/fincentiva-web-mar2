-- Script para actualizar la tabla simulations en Supabase

-- Verificar si la columna is_application ya existe
DO $$
BEGIN
    -- Comprobar si la columna existe
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'simulations'
        AND column_name = 'is_application'
    ) THEN
        -- Añadir la columna is_application si no existe
        ALTER TABLE simulations ADD COLUMN is_application BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Columna is_application añadida a la tabla simulations';
    ELSE
        RAISE NOTICE 'La columna is_application ya existe en la tabla simulations';
    END IF;
    
    -- Comprobar si la columna notes existe
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'simulations'
        AND column_name = 'notes'
    ) THEN
        -- Añadir la columna notes si no existe
        ALTER TABLE simulations ADD COLUMN notes TEXT;
        RAISE NOTICE 'Columna notes añadida a la tabla simulations';
    ELSE
        RAISE NOTICE 'La columna notes ya existe en la tabla simulations';
    END IF;
END $$;

-- Mostrar la estructura actual de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'simulations'
ORDER BY ordinal_position; 