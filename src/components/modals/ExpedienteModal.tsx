import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Expediente } from '../../types';

interface ExpedienteModalProps {
  expediente: Expediente | null;
  onClose: () => void;
}

export function ExpedienteModal({ expediente, onClose }: ExpedienteModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    expte: '',
    cuit: '',
    telefono: '',
    demanda: '',
    monto: '',
    urgencia: 'Normal' as 'Normal' | 'Urgente' | 'Archivo',
  });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (expediente) {
      setFormData({
        nombre: expediente.nombre,
        expte: expediente.expte,
        cuit: expediente.cuit,
        telefono: expediente.telefono,
        demanda: expediente.demanda,
        monto: expediente.monto,
        urgencia: expediente.urgencia,
      });
    }
  }, [expediente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre) {
      alert('El nombre es obligatorio');
      return;
    }

    setGuardando(true);
    try {
      if (expediente) {
        const { error } = await supabase
          .from('expedientes')
          .update(formData)
          .eq('id', expediente.id);

        if (error) throw error;
        alert('Expediente actualizado exitosamente');
      } else {
        const { error } = await supabase
          .from('expedientes')
          .insert([formData]);

        if (error) throw error;
        alert('Expediente creado exitosamente');
      }

      onClose();
    } catch (error) {
      console.error('Error guardando expediente:', error);
      alert('Error al guardar el expediente');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center sticky top-0">
          <h3 className="text-xl font-semibold">
            {expediente ? 'Editar Expediente' : 'Nuevo Expediente'}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Carátula / Nombre *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                N° Expediente
              </label>
              <input
                type="text"
                value={formData.expte}
                onChange={(e) => setFormData({ ...formData, expte: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                CUIT / DNI Cliente
              </label>
              <input
                type="text"
                value={formData.cuit}
                onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Teléfono
              </label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo Demanda
              </label>
              <input
                type="text"
                value={formData.demanda}
                onChange={(e) => setFormData({ ...formData, demanda: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Monto
              </label>
              <input
                type="text"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Prioridad
              </label>
              <select
                value={formData.urgencia}
                onChange={(e) => setFormData({ ...formData, urgencia: e.target.value as 'Normal' | 'Urgente' | 'Archivo' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              >
                <option value="Normal">Normal</option>
                <option value="Urgente">Urgente</option>
                <option value="Archivo">Archivo</option>
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
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
