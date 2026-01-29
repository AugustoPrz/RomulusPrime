import { useState } from 'react';
import { X, Calendar, Save, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MovimientoModalProps {
  expedienteId: string;
  onClose: () => void;
}

export function MovimientoModal({ expedienteId, onClose }: MovimientoModalProps) {
  const [formData, setFormData] = useState({
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    dias_plazo: 5,
  });
  const [guardando, setGuardando] = useState(false);
  const [fechaVencimiento, setFechaVencimiento] = useState<Date | null>(null);

  const calcularVencimiento = () => {
    if (formData.fecha && formData.dias_plazo) {
      const fecha = new Date(formData.fecha + 'T12:00:00');
      fecha.setDate(fecha.getDate() + formData.dias_plazo);
      setFechaVencimiento(fecha);
      return fecha.toISOString().split('T')[0];
    }
    return null;
  };

  const handleDiasChange = (dias: number) => {
    setFormData({ ...formData, dias_plazo: dias });
    setTimeout(calcularVencimiento, 0);
  };

  const handleFechaChange = (fecha: string) => {
    setFormData({ ...formData, fecha });
    setTimeout(calcularVencimiento, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descripcion || !formData.fecha || !formData.dias_plazo) {
      alert('Complete todos los campos obligatorios');
      return;
    }

    setGuardando(true);
    try {
      const fechaVenc = calcularVencimiento();

      const { data: tareaData, error: tareaError } = await supabase
        .from('tareas')
        .insert([{
          titulo: `Plazo: ${formData.descripcion}`,
          descripcion: `Movimiento del ${formData.fecha} con plazo de ${formData.dias_plazo} días`,
          expediente_id: expedienteId,
          fecha: fechaVenc,
          prioridad: 'Alta',
          estado: 'Pendiente',
          tipo: 'plazo',
        }])
        .select()
        .single();

      if (tareaError) throw tareaError;

      const { error: movError } = await supabase
        .from('movimientos')
        .insert([{
          expediente_id: expedienteId,
          descripcion: formData.descripcion,
          fecha: formData.fecha,
          dias_plazo: formData.dias_plazo,
          fecha_vencimiento: fechaVenc,
          tarea_id: tareaData.id,
        }]);

      if (movError) throw movError;

      alert('Movimiento guardado y tarea creada exitosamente');
      onClose();
    } catch (error) {
      console.error('Error guardando movimiento:', error);
      alert('Error al guardar el movimiento');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-yellow-500 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Nuevo Movimiento con Plazo</h3>
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
                Descripción del movimiento *
              </label>
              <input
                type="text"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Ej: Presentación de demanda, Notificación, etc."
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha del movimiento *
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => handleFechaChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Plazo en días hábiles *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.dias_plazo}
                  onChange={(e) => handleDiasChange(parseInt(e.target.value))}
                  min="1"
                  max="365"
                  placeholder="Ej: 10"
                  className="flex-grow px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
                <span className="text-slate-600 font-medium">días</span>
              </div>
            </div>

            {fechaVencimiento && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Fecha estimada de vencimiento:
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {fechaVencimiento.toLocaleDateString('es-AR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-700">
                  <strong>Nota:</strong> Este movimiento creará automáticamente una tarea con la fecha de vencimiento.
                </p>
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
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors disabled:opacity-50 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {guardando ? 'Guardando...' : 'Guardar Movimiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
