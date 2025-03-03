# Configuración de Supabase para el Simulador de Préstamos

Este documento proporciona instrucciones para configurar correctamente la base de datos Supabase para el simulador de préstamos.

## Problema: Error "Could not find the 'is_application' column of 'simulations'"

Si estás viendo este error, significa que la estructura de la tabla `simulations` en tu base de datos Supabase no coincide con la estructura esperada por la aplicación.

## Solución 1: Actualizar la aplicación (Ya implementada)

La aplicación ha sido actualizada para manejar este error. Ahora, en lugar de usar la columna `is_application`, utiliza la columna `notes` para indicar si se trata de una solicitud de préstamo o una simulación.

## Solución 2: Actualizar la estructura de la tabla en Supabase

Si prefieres actualizar la estructura de la tabla en Supabase para que coincida con la estructura esperada por la aplicación original, sigue estos pasos:

1. Accede a la consola de Supabase (https://app.supabase.io)
2. Selecciona tu proyecto
3. Ve a la sección "SQL Editor"
4. Crea un nuevo script SQL
5. Copia y pega el siguiente código:

```sql
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
```

6. Ejecuta el script haciendo clic en el botón "Run"

## Solución 3: Crear la tabla desde cero

Si la tabla `simulations` no existe o prefieres crearla desde cero, puedes usar el siguiente script SQL:

```sql
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
```

## Verificación de la configuración

Para verificar que la configuración es correcta, puedes ejecutar el siguiente script SQL:

```sql
-- Mostrar la estructura actual de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'simulations'
ORDER BY ordinal_position;
```

## Configuración de variables de entorno

Asegúrate de que las variables de entorno en tu archivo `.env` estén configuradas correctamente:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

Puedes encontrar estos valores en la sección "Settings" > "API" de tu proyecto en Supabase.

## Solución de problemas adicionales

Si sigues teniendo problemas, verifica lo siguiente:

1. **Permisos de RLS (Row Level Security)**: Asegúrate de que las políticas de RLS permitan la inserción y selección anónimas.
2. **Conexión a Supabase**: Verifica que puedes conectarte a Supabase desde tu aplicación.
3. **Estructura de la tabla**: Asegúrate de que la estructura de la tabla coincide con la esperada por la aplicación.

Si necesitas más ayuda, consulta la [documentación de Supabase](https://supabase.io/docs) o contacta al equipo de desarrollo. 