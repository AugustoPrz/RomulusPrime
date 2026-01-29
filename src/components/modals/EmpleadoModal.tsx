import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Empleado } from '../../types';

interface EmpleadoModalProps {
  empleado: Empleado | null;
  onClose: () => void;
}

export function EmpleadoModal({ empleado, onClose }: EmpleadoModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    rol: '',
    email: '',
    telefono: '',
    activo: true,
  });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (empleado) {
      setFormData({
        nombre: empleado.nombre,
        rol: empleado.rol,
        email: empleado.email,
        telefono: empleado.telefono,
        activo: empleado.activo,
      });
    }
  }, [empleado]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.rol) {
      alert('Complete los campos obligatorios');
      return;
    }

    setGuardando(true);
    try {
      if (empleado) {
        const { error } = await supabase
          .from('empleados')
          .update(formData)
          .eq('id', empleado.id);

        if (error) throw error;
        alert('Empleado actualizado exitosamente');
      } else {
        const { error } = await supabase
          .from('empleados')
          .insert([formData]);

        if (error) throw error;
        alert('Empleado creado exitosamente');
      }

      onClose();
    } catch (error) {
      console.error('Error guardando empleado:', error);
      alert('Error al guardar el empleado');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {empleado ? 'Editar Empleado' : 'Nuevo Empleado'}
          </h3>
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
                Nombre Completo *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rol *
                </label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar rol</option>
                  <option value="Abogado">Abogado</option>
                  <option value="Procurador">Procurador</option>
                  <option value="Secretario">Secretario</option>
                  <option value="Asistente">Asistente</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="activo"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="w-4 h-4 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
              />
              <label htmlFor="activo" className="ml-2 text-sm text-slate-700">
                Empleado activo
              </label>
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
              {guardando ? 'Guardando...' : 'Guardar Empleado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
