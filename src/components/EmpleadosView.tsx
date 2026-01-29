import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Mail, Phone, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Empleado } from '../types';
import { EmpleadoModal } from './modals/EmpleadoModal';

export function EmpleadosView() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [empleadoEditar, setEmpleadoEditar] = useState<Empleado | null>(null);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('empleados')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setEmpleados(data || []);
    } catch (error) {
      console.error('Error cargando empleados:', error);
      alert('Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoEmpleado = () => {
    setEmpleadoEditar(null);
    setShowModal(true);
  };

  const handleEditarEmpleado = (empleado: Empleado) => {
    setEmpleadoEditar(empleado);
    setShowModal(true);
  };

  const handleEliminarEmpleado = async (id: string) => {
    if (!confirm('¿Desactivar este empleado? No aparecerá en las listas de selección.')) return;

    try {
      const { error } = await supabase
        .from('empleados')
        .update({ activo: false })
        .eq('id', id);

      if (error) throw error;
      cargarEmpleados();
    } catch (error) {
      console.error('Error desactivando empleado:', error);
      alert('Error al desactivar el empleado');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEmpleadoEditar(null);
    cargarEmpleados();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center">
          <Plus className="mr-3" />
          Gestión de Empleados
        </h2>
        <button
          onClick={handleNuevoEmpleado}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-md shadow-md transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Empleado
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="bg-cyan-600 text-white px-6 py-4 rounded-t-lg">
              <h3 className="text-lg font-semibold">Lista de Empleados</h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                  <p className="mt-4 text-slate-600">Cargando empleados...</p>
                </div>
              ) : empleados.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No hay empleados registrados
                </div>
              ) : (
                <div className="space-y-3">
                  {empleados.map((emp) => (
                    <div
                      key={emp.id}
                      className={`border rounded-lg p-4 transition-all ${
                        emp.activo
                          ? 'border-slate-200 hover:shadow-md hover:-translate-y-0.5'
                          : 'border-slate-100 bg-slate-50 opacity-60'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-slate-900 text-lg">
                              {emp.nombre}
                            </h4>
                            {!emp.activo && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                Inactivo
                              </span>
                            )}
                          </div>
                          <p className="mb-2">
                            <span className="px-3 py-1 bg-cyan-100 text-cyan-800 text-sm rounded-full">
                              {emp.rol}
                            </span>
                          </p>
                          {emp.email && (
                            <p className="text-sm text-slate-600 flex items-center mb-1">
                              <Mail className="w-4 h-4 mr-2" />
                              {emp.email}
                            </p>
                          )}
                          {emp.telefono && (
                            <p className="text-sm text-slate-600 flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              {emp.telefono}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditarEmpleado(emp)}
                            className="p-2 border border-cyan-300 text-cyan-600 rounded hover:bg-cyan-50 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {emp.activo && (
                            <button
                              onClick={() => handleEliminarEmpleado(emp.id)}
                              className="p-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                              title="Desactivar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="bg-yellow-500 text-white px-6 py-4 rounded-t-lg">
              <h3 className="text-lg font-semibold flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Información
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Función:</h4>
                <p className="text-sm text-slate-600">
                  Los empleados pueden ser asignados a tareas y eventos del calendario.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Uso:</h4>
                <p className="text-sm text-slate-600">
                  Al crear o editar una tarea/evento, seleccione un empleado del listado.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Nota:</h4>
                <p className="text-sm text-slate-600">
                  Los empleados inactivos no aparecerán en las listas de selección.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <EmpleadoModal
          empleado={empleadoEditar}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
