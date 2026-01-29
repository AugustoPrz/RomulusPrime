/*
  # Allow anonymous access to tables

  1. Changes
    - Update all RLS policies to allow both authenticated and anonymous (anon) users
    - This allows the dashboard to work without requiring user authentication
  
  2. Security
    - Tables remain protected by RLS
    - Anonymous users can now read and write data
    - Consider adding authentication later for production use
*/

-- Drop existing policies and recreate with anon access

-- Expedientes policies
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver expedientes" ON expedientes;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar expedientes" ON expedientes;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar expedientes" ON expedientes;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar expedientes" ON expedientes;

CREATE POLICY "Users can view expedientes"
  ON expedientes FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert expedientes"
  ON expedientes FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Users can update expedientes"
  ON expedientes FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete expedientes"
  ON expedientes FOR DELETE
  TO authenticated, anon
  USING (true);

-- Empleados policies
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver empleados" ON empleados;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar empleados" ON empleados;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar empleados" ON empleados;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar empleados" ON empleados;

CREATE POLICY "Users can view empleados"
  ON empleados FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert empleados"
  ON empleados FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Users can update empleados"
  ON empleados FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete empleados"
  ON empleados FOR DELETE
  TO authenticated, anon
  USING (true);

-- Movimientos policies
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver movimientos" ON movimientos;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar movimientos" ON movimientos;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar movimientos" ON movimientos;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar movimientos" ON movimientos;

CREATE POLICY "Users can view movimientos"
  ON movimientos FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert movimientos"
  ON movimientos FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Users can update movimientos"
  ON movimientos FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete movimientos"
  ON movimientos FOR DELETE
  TO authenticated, anon
  USING (true);

-- Tareas policies
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver tareas" ON tareas;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar tareas" ON tareas;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar tareas" ON tareas;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar tareas" ON tareas;

CREATE POLICY "Users can view tareas"
  ON tareas FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert tareas"
  ON tareas FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Users can update tareas"
  ON tareas FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete tareas"
  ON tareas FOR DELETE
  TO authenticated, anon
  USING (true);

-- Eventos calendario policies
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver eventos" ON eventos_calendario;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar eventos" ON eventos_calendario;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar eventos" ON eventos_calendario;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar eventos" ON eventos_calendario;

CREATE POLICY "Users can view eventos"
  ON eventos_calendario FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert eventos"
  ON eventos_calendario FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Users can update eventos"
  ON eventos_calendario FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete eventos"
  ON eventos_calendario FOR DELETE
  TO authenticated, anon
  USING (true);
