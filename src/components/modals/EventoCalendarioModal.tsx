import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Expediente, Empleado } from '../../types';

interface EventoCalendarioModalProps {
  onClose: () => void;
}

export function EventoCalendarioModal({ onClose }: EventoCalendarioModalProps) {
  const [formData, setFormData] = useState({
    tipo: '' as 'reunion' | 'audiencia' | 'recordatorio' | 'evento' | '',
    titulo: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '09:00',
    duracion: 1,
    asignado: '',
    expediente_id: '',
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
    if (!formData.tipo || !formData.titulo || !formData.fecha || !formData.hora) {
      alert('Complete los campos obligatorios');
      return;
    }

    setGuardando(true);
    try {
      const colorMap = {
        reunion: '#3b82f6',
        audiencia: '#ef4444',
        recordatorio: '#eab308',
        evento: '#64748b',
      };

      const { error } = await supabase
        .from('eventos_calendario')
        .insert([{
          tipo: formData.tipo,
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          fecha: formData.fecha,
          hora: formData.hora,
          duracion: formData.duracion,
          asignado: formData.asignado,
          expediente_id: formData.expediente_id || null,
          color: colorMap[formData.tipo as keyof typeof colorMap],
        }]);

      if (error) throw error;
      alert('Evento creado exitosamente');
      onClose();
    } catch (error) {
      console.error('Error creando evento:', error);
      alert('Error al crear el evento');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Nuevo Evento en Calendario</h3>
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
                Tipo de Evento *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="reunion">Reunión</option>
                <option value="audiencia">Audiencia</option>
                <option value="recordatorio">Recordatorio</option>
                <option value="evento">Evento General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ej: Reunión con cliente..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción del evento..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hora *
                </label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Duración (horas)
                </label>
                <input
                  type="number"
                  value={formData.duracion}
                  onChange={(e) => setFormData({ ...formData, duracion: parseFloat(e.target.value) })}
                  min="0.5"
                  max="8"
                  step="0.5"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Asignado a
                </label>
                <select
                  value={formData.asignado}
                  onChange={(e) => setFormData({ ...formData, asignado: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                >
                  <option value="">No asignar</option>
                  {empleados.map((emp) => (
                    <option key={emp.id} value={emp.nombre}>
                      {emp.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Asociar a expediente (opcional)
              </label>
              <select
                value={formData.expediente_id}
                onChange={(e) => setFormData({ ...formData, expediente_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              >
                <option value="">(Evento independiente)</option>
                {expedientes.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {exp.expte || 'S/D'} - {exp.nombre}
                  </option>
                ))}
              </select>
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
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md transition-colors disabled:opacity-50"
            >
              {guardando ? 'Creando...' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
