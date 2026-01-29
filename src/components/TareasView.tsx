import { useState, useEffect } from 'react';
import { Plus, Check, X, RotateCcw, Trash2, Calendar, User, Folder } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Tarea, Expediente } from '../types';
import { TareaModal } from './modals/TareaModal';

export function TareasView() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroCausa, setFiltroCausa] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const { data: tarData } = await supabase
        .from('tareas')
        .select('*')
        .order('fecha', { ascending: true });

      const { data: expData } = await supabase
        .from('expedientes')
        .select('*')
        .order('nombre');

      setTareas(tarData || []);
      setExpedientes(expData || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const tareasFiltradas = tareas.filter((t) => {
    if (filtroEstado !== 'todos' && t.estado !== filtroEstado) return false;
    if (filtroCausa && t.expediente_id !== filtroCausa) return false;
    return true;
  });

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    try {
      const { error } = await supabase
        .from('tareas')
        .update({ estado: nuevoEstado })
        .eq('id', id);

      if (error) throw error;
      cargarDatos();
    } catch (error) {
      console.error('Error actualizando estado:', error);
      alert('Error al actualizar el estado');
    }
  };

  const eliminarTarea = async (id: string) => {
    if (!confirm('¿Eliminar esta tarea?')) return;

    try {
      const { error } = await supabase
        .from('tareas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      cargarDatos();
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      alert('Error al eliminar la tarea');
    }
  };

  const getBadgeEstado = (estado: string) => {
    switch (estado) {
      case 'Completado':
        return 'bg-green-100 text-green-800';
      case 'NoRealizado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getBadgePrioridad = (prioridad: string) => {
    switch (prioridad) {
      case 'Urgente':
        return 'bg-red-100 text-red-800';
      case 'Alta':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr + 'T12:00:00');
    return fecha.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getNombreExpediente = (expedienteId: string | null) => {
    if (!expedienteId) return 'Tarea General';
    const exp = expedientes.find((e) => e.id === expedienteId);
    return exp ? `${exp.expte || 'S/D'} - ${exp.nombre}` : 'Expediente no encontrado';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center">
          <Check className="mr-3" />
          Gestión de Tareas
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md shadow-md transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Tarea
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-5">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="filtroEstado"
                value="todos"
                checked={filtroEstado === 'todos'}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="mr-2"
              />
              <span>Todas</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="filtroEstado"
                value="Pendiente"
                checked={filtroEstado === 'Pendiente'}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="mr-2"
              />
              <span>Pendientes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="filtroEstado"
                value="Completado"
                checked={filtroEstado === 'Completado'}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="mr-2"
              />
              <span>Completadas</span>
            </label>
          </div>
          <div className="w-full md:w-64">
            <select
              value={filtroCausa}
              onChange={(e) => setFiltroCausa(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-400 focus:border-transparent"
            >
              <option value="">Todas las causas</option>
              {expedientes.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.expte || 'S/D'} - {exp.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="mt-4 text-slate-600">Cargando tareas...</p>
        </div>
      ) : tareasFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-slate-500 text-lg">No hay tareas para mostrar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tareasFiltradas.map((tarea) => (
            <div
              key={tarea.id}
              className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-grow">
                  <h3 className={`font-semibold text-slate-900 text-lg ${tarea.estado === 'Completado' ? 'line-through opacity-60' : ''}`}>
                    {tarea.titulo}
                  </h3>
                  <p className={`text-sm text-slate-600 mt-1 ${tarea.estado === 'Completado' ? 'line-through opacity-60' : ''}`}>
                    {tarea.descripcion}
                  </p>
                </div>
                <div className="flex gap-2 ml-4 flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeEstado(tarea.estado)}`}>
                    {tarea.estado === 'Completado' ? 'Completado' :
                     tarea.estado === 'NoRealizado' ? 'No Realizado' : 'Pendiente'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgePrioridad(tarea.prioridad)}`}>
                    {tarea.prioridad}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-3">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatearFecha(tarea.fecha)}
                  {tarea.hora && ` - ${tarea.hora}`}
                </div>
                {tarea.asignado && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {tarea.asignado}
                  </div>
                )}
                <div className="flex items-center">
                  <Folder className="w-4 h-4 mr-1" />
                  {getNombreExpediente(tarea.expediente_id)}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {tarea.estado === 'Pendiente' ? (
                  <>
                    <button
                      onClick={() => cambiarEstado(tarea.id, 'Completado')}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded flex items-center transition-colors"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Completar
                    </button>
                    <button
                      onClick={() => cambiarEstado(tarea.id, 'NoRealizado')}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded flex items-center transition-colors"
                    >
                      <X className="w-4 h-4 mr-1" />
                      No Realizado
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => cambiarEstado(tarea.id, 'Pendiente')}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded flex items-center transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Marcar Pendiente
                  </button>
                )}
                <button
                  onClick={() => eliminarTarea(tarea.id)}
                  className="px-3 py-1 border border-red-300 text-red-600 hover:bg-red-50 text-sm rounded flex items-center transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TareaModal
          onClose={() => {
            setShowModal(false);
            cargarDatos();
          }}
        />
      )}
    </div>
  );
}
