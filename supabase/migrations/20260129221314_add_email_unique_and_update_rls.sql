/*
  # Add email unique constraint and update RLS policies

  1. Changes
    - Add unique constraint on email column in empleados table
    - Update RLS policies to require authenticated users only
    - Remove anonymous access for better security

  2. Security
    - All tables now require authentication
    - Anonymous access is removed
*/

-- Add unique constraint on email if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'empleados_email_key'
  ) THEN
    ALTER TABLE empleados ADD CONSTRAINT empleados_email_key UNIQUE (email);
  END IF;
END $$;

-- Update RLS policies to require authenticated users only

-- Expedientes
DROP POLICY IF EXISTS "Users can view expedientes" ON expedientes;
DROP POLICY IF EXISTS "Users can insert expedientes" ON expedientes;
DROP POLICY IF EXISTS "Users can update expedientes" ON expedientes;
DROP POLICY IF EXISTS "Users can delete expedientes" ON expedientes;

CREATE POLICY "Authenticated users can view expedientes"
  ON expedientes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert expedientes"
  ON expedientes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update expedientes"
  ON expedientes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete expedientes"
  ON expedientes FOR DELETE
  TO authenticated
  USING (true);

-- Empleados
DROP POLICY IF EXISTS "Users can view empleados" ON empleados;
DROP POLICY IF EXISTS "Users can insert empleados" ON empleados;
DROP POLICY IF EXISTS "Users can update empleados" ON empleados;
DROP POLICY IF EXISTS "Users can delete empleados" ON empleados;

CREATE POLICY "Authenticated users can view empleados"
  ON empleados FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert empleados"
  ON empleados FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update empleados"
  ON empleados FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete empleados"
  ON empleados FOR DELETE
  TO authenticated
  USING (true);

-- Movimientos
DROP POLICY IF EXISTS "Users can view movimientos" ON movimientos;
DROP POLICY IF EXISTS "Users can insert movimientos" ON movimientos;
DROP POLICY IF EXISTS "Users can update movimientos" ON movimientos;
DROP POLICY IF EXISTS "Users can delete movimientos" ON movimientos;

CREATE POLICY "Authenticated users can view movimientos"
  ON movimientos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert movimientos"
  ON movimientos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update movimientos"
  ON movimientos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete movimientos"
  ON movimientos FOR DELETE
  TO authenticated
  USING (true);

-- Tareas
DROP POLICY IF EXISTS "Users can view tareas" ON tareas;
DROP POLICY IF EXISTS "Users can insert tareas" ON tareas;
DROP POLICY IF EXISTS "Users can update tareas" ON tareas;
DROP POLICY IF EXISTS "Users can delete tareas" ON tareas;

CREATE POLICY "Authenticated users can view tareas"
  ON tareas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tareas"
  ON tareas FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tareas"
  ON tareas FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tareas"
  ON tareas FOR DELETE
  TO authenticated
  USING (true);

-- Eventos calendario
DROP POLICY IF EXISTS "Users can view eventos" ON eventos_calendario;
DROP POLICY IF EXISTS "Users can insert eventos" ON eventos_calendario;
DROP POLICY IF EXISTS "Users can update eventos" ON eventos_calendario;
DROP POLICY IF EXISTS "Users can delete eventos" ON eventos_calendario;

CREATE POLICY "Authenticated users can view eventos"
  ON eventos_calendario FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert eventos"
  ON eventos_calendario FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update eventos"
  ON eventos_calendario FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete eventos"
  ON eventos_calendario FOR DELETE
  TO authenticated
  USING (true);
