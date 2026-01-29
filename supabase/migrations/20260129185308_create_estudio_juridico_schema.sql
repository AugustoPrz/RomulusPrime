/*
  # Sistema de Gestión para Estudio Jurídico Conti

  1. Tablas Principales
    - `expedientes`
      - Información completa de causas/expedientes
      - Incluye datos del cliente, tipo de demanda, montos, prioridad
      - Sistema de procuración con fecha y hora
      - Timestamps de creación y actualización
    
    - `empleados`
      - Personal del estudio jurídico
      - Roles, contactos, estado activo/inactivo
    
    - `movimientos`
      - Movimientos procesales asociados a expedientes
      - Cálculo de plazos en días hábiles
      - Fecha de vencimiento estimada
    
    - `tareas`
      - Tareas generales o asociadas a expedientes
      - Estados: Pendiente, Completado, NoRealizado
      - Prioridades y asignación a empleados
      - Fechas de vencimiento
    
    - `eventos_calendario`
      - Eventos del calendario (reuniones, audiencias, recordatorios)
      - Duración y asignación a empleados
      - Asociación opcional a expedientes

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas para usuarios autenticados
    - Acceso completo para operaciones CRUD

  3. Notas Importantes
    - Todas las fechas en formato ISO (YYYY-MM-DD)
    - Timestamps con zona horaria
    - IDs únicos generados automáticamente
    - Valores por defecto configurados apropiadamente
*/

-- Tabla de Expedientes
CREATE TABLE IF NOT EXISTS expedientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  expte text DEFAULT '',
  cuit text DEFAULT '',
  telefono text DEFAULT '',
  demanda text DEFAULT '',
  monto text DEFAULT '',
  urgencia text DEFAULT 'Normal' CHECK (urgencia IN ('Normal', 'Urgente', 'Archivo')),
  procuracion_fecha date,
  procuracion_hora time,
  procuracion_guardada timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de Empleados
CREATE TABLE IF NOT EXISTS empleados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  rol text NOT NULL,
  email text DEFAULT '',
  telefono text DEFAULT '',
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de Movimientos
CREATE TABLE IF NOT EXISTS movimientos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expediente_id uuid NOT NULL REFERENCES expedientes(id) ON DELETE CASCADE,
  descripcion text NOT NULL,
  fecha date NOT NULL,
  dias_plazo integer NOT NULL DEFAULT 5,
  fecha_vencimiento date,
  tarea_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de Tareas
CREATE TABLE IF NOT EXISTS tareas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descripcion text NOT NULL,
  expediente_id uuid REFERENCES expedientes(id) ON DELETE CASCADE,
  movimiento_id uuid REFERENCES movimientos(id) ON DELETE SET NULL,
  fecha date NOT NULL,
  hora time,
  prioridad text DEFAULT 'Normal' CHECK (prioridad IN ('Normal', 'Alta', 'Urgente')),
  estado text DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Completado', 'NoRealizado')),
  asignado text DEFAULT '',
  tipo text DEFAULT 'tarea',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de Eventos de Calendario
CREATE TABLE IF NOT EXISTS eventos_calendario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL CHECK (tipo IN ('reunion', 'audiencia', 'recordatorio', 'evento')),
  titulo text NOT NULL,
  descripcion text DEFAULT '',
  fecha date NOT NULL,
  hora time NOT NULL,
  duracion numeric DEFAULT 1.0,
  asignado text DEFAULT '',
  expediente_id uuid REFERENCES expedientes(id) ON DELETE SET NULL,
  color text DEFAULT '#007bff',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Actualizar la tabla de movimientos para referenciar tareas
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'movimientos' AND column_name = 'tarea_id'
  ) THEN
    ALTER TABLE movimientos DROP CONSTRAINT IF EXISTS movimientos_tarea_id_fkey;
    ALTER TABLE movimientos ADD CONSTRAINT movimientos_tarea_id_fkey 
      FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_expedientes_urgencia ON expedientes(urgencia);
CREATE INDEX IF NOT EXISTS idx_expedientes_procuracion_fecha ON expedientes(procuracion_fecha);
CREATE INDEX IF NOT EXISTS idx_movimientos_expediente_id ON movimientos(expediente_id);
CREATE INDEX IF NOT EXISTS idx_tareas_expediente_id ON tareas(expediente_id);
CREATE INDEX IF NOT EXISTS idx_tareas_estado ON tareas(estado);
CREATE INDEX IF NOT EXISTS idx_tareas_fecha ON tareas(fecha);
CREATE INDEX IF NOT EXISTS idx_eventos_fecha ON eventos_calendario(fecha);
CREATE INDEX IF NOT EXISTS idx_empleados_activo ON empleados(activo);

-- Habilitar RLS en todas las tablas
ALTER TABLE expedientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE empleados ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_calendario ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para expedientes
CREATE POLICY "Usuarios autenticados pueden ver expedientes"
  ON expedientes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden insertar expedientes"
  ON expedientes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar expedientes"
  ON expedientes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden eliminar expedientes"
  ON expedientes FOR DELETE
  TO authenticated
  USING (true);

-- Políticas RLS para empleados
CREATE POLICY "Usuarios autenticados pueden ver empleados"
  ON empleados FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden insertar empleados"
  ON empleados FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar empleados"
  ON empleados FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden eliminar empleados"
  ON empleados FOR DELETE
  TO authenticated
  USING (true);

-- Políticas RLS para movimientos
CREATE POLICY "Usuarios autenticados pueden ver movimientos"
  ON movimientos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden insertar movimientos"
  ON movimientos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar movimientos"
  ON movimientos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden eliminar movimientos"
  ON movimientos FOR DELETE
  TO authenticated
  USING (true);

-- Políticas RLS para tareas
CREATE POLICY "Usuarios autenticados pueden ver tareas"
  ON tareas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden insertar tareas"
  ON tareas FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar tareas"
  ON tareas FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden eliminar tareas"
  ON tareas FOR DELETE
  TO authenticated
  USING (true);

-- Políticas RLS para eventos_calendario
CREATE POLICY "Usuarios autenticados pueden ver eventos"
  ON eventos_calendario FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden insertar eventos"
  ON eventos_calendario FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar eventos"
  ON eventos_calendario FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden eliminar eventos"
  ON eventos_calendario FOR DELETE
  TO authenticated
  USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_expedientes_updated_at ON expedientes;
CREATE TRIGGER update_expedientes_updated_at
  BEFORE UPDATE ON expedientes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_empleados_updated_at ON empleados;
CREATE TRIGGER update_empleados_updated_at
  BEFORE UPDATE ON empleados
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_movimientos_updated_at ON movimientos;
CREATE TRIGGER update_movimientos_updated_at
  BEFORE UPDATE ON movimientos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tareas_updated_at ON tareas;
CREATE TRIGGER update_tareas_updated_at
  BEFORE UPDATE ON tareas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_eventos_updated_at ON eventos_calendario;
CREATE TRIGGER update_eventos_updated_at
  BEFORE UPDATE ON eventos_calendario
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();