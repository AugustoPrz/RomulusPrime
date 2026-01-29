export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      expedientes: {
        Row: {
          id: string
          nombre: string
          expte: string
          cuit: string
          telefono: string
          demanda: string
          monto: string
          urgencia: 'Normal' | 'Urgente' | 'Archivo'
          procuracion_fecha: string | null
          procuracion_hora: string | null
          procuracion_guardada: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          expte?: string
          cuit?: string
          telefono?: string
          demanda?: string
          monto?: string
          urgencia?: 'Normal' | 'Urgente' | 'Archivo'
          procuracion_fecha?: string | null
          procuracion_hora?: string | null
          procuracion_guardada?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          expte?: string
          cuit?: string
          telefono?: string
          demanda?: string
          monto?: string
          urgencia?: 'Normal' | 'Urgente' | 'Archivo'
          procuracion_fecha?: string | null
          procuracion_hora?: string | null
          procuracion_guardada?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      empleados: {
        Row: {
          id: string
          nombre: string
          rol: string
          email: string
          telefono: string
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          rol: string
          email?: string
          telefono?: string
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          rol?: string
          email?: string
          telefono?: string
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      movimientos: {
        Row: {
          id: string
          expediente_id: string
          descripcion: string
          fecha: string
          dias_plazo: number
          fecha_vencimiento: string | null
          tarea_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          expediente_id: string
          descripcion: string
          fecha: string
          dias_plazo?: number
          fecha_vencimiento?: string | null
          tarea_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          expediente_id?: string
          descripcion?: string
          fecha?: string
          dias_plazo?: number
          fecha_vencimiento?: string | null
          tarea_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tareas: {
        Row: {
          id: string
          titulo: string
          descripcion: string
          expediente_id: string | null
          movimiento_id: string | null
          fecha: string
          hora: string | null
          prioridad: 'Normal' | 'Alta' | 'Urgente'
          estado: 'Pendiente' | 'Completado' | 'NoRealizado'
          asignado: string
          tipo: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          descripcion: string
          expediente_id?: string | null
          movimiento_id?: string | null
          fecha: string
          hora?: string | null
          prioridad?: 'Normal' | 'Alta' | 'Urgente'
          estado?: 'Pendiente' | 'Completado' | 'NoRealizado'
          asignado?: string
          tipo?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          descripcion?: string
          expediente_id?: string | null
          movimiento_id?: string | null
          fecha?: string
          hora?: string | null
          prioridad?: 'Normal' | 'Alta' | 'Urgente'
          estado?: 'Pendiente' | 'Completado' | 'NoRealizado'
          asignado?: string
          tipo?: string
          created_at?: string
          updated_at?: string
        }
      }
      eventos_calendario: {
        Row: {
          id: string
          tipo: 'reunion' | 'audiencia' | 'recordatorio' | 'evento'
          titulo: string
          descripcion: string
          fecha: string
          hora: string
          duracion: number
          asignado: string
          expediente_id: string | null
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tipo: 'reunion' | 'audiencia' | 'recordatorio' | 'evento'
          titulo: string
          descripcion?: string
          fecha: string
          hora: string
          duracion?: number
          asignado?: string
          expediente_id?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tipo?: 'reunion' | 'audiencia' | 'recordatorio' | 'evento'
          titulo?: string
          descripcion?: string
          fecha?: string
          hora?: string
          duracion?: number
          asignado?: string
          expediente_id?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
