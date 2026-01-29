import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Expediente, Empleado } from '../../types';

interface TareaModalProps {
  expedienteIdPreseleccionado?: string | null;
  onClose: () => void;
}

export function TareaModal({ expedienteIdPreseleccionado, onClose }: TareaModalProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    expediente_id: expedienteIdPreseleccionado || '',
    fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    hora: '',
    prioridad: 'Normal' as 'Normal' | 'Alta' | 'Urgente',
    asignado: '',
  });
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const { data: expData } = await supabase
        .from('expedientes')
        .select('*')
        .order('nombre');

      const { data: empData } = await supabase
        .from('empleados')
        .select('*')
        .eq('activo', true)
        .order('nombre');

      setExpedientes(expData || []);
      setEmpleados(empData || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.descripcion || !formData.fecha) {
      alert('Complete los campos obligatorios');
      return;
    }

    setGuardando(true);
    try {
      const { error } = await supabase
        .from('tareas')
        .insert([{
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          expediente_id: formData.expediente_id || null,
          fecha: formData.fecha,
          hora: formData.hora || null,
          prioridad: formData.prioridad,
          estado: 'Pendiente',
          asignado: formData.asignado,
          tipo: 'tarea',
        }]);

      if (error) throw error;
      alert('Tarea creada exitosamente');
      onClose();
    } catch (error) {
      console.error('Error creando tarea:', error);
      alert('Error al crear la tarea');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Nueva Tarea</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ej: Redactar informe..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-400 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción detallada de la tarea..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-400 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Asociar a expediente
              </label>
              <select
                value={formData.expediente_id}
                onChange={(e) => setFormData({ ...formData, expediente_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-400 focus:border-transparent"
              >
                <option value="">(Tarea General)</option>
                {expedientes.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {exp.expte || 'S/D'} - {exp.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha de vencimiento *
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hora
                </label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Prioridad
                </label>
                <select
                  value={formData.prioridad}
                  onChange={(e) => setFormData({ ...formData, prioridad: e.target.value as 'Normal' | 'Alta' | 'Urgente' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-400 focus:border-transparent"
                >
                  <option value="Normal">Normal</option>
                  <option value="Alta">Alta</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Asignado a
                </label>
                <select
                  value={formData.asignado}
                  onChange={(e) => setFormData({ ...formData, asignado: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-400 focus:border-transparent"
                >
                  <option value="">No asignar</option>
                  {empleados.map((emp) => (
                    <option key={emp.id} value={emp.nombre}>
                      {emp.nombre} ({emp.rol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors disabled:opacity-50"
            >
              {guardando ? 'Creando...' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
