import { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, Trash2, CheckSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Tarea, EventoCalendario } from '../types';
import { TareaModal } from './modals/TareaModal';
import { EventoCalendarioModal } from './modals/EventoCalendarioModal';

export function CalendarioView() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTareaModal, setShowTareaModal] = useState(false);
  const [showEventoModal, setShowEventoModal] = useState(false);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());

  useEffect(() => {
    cargarDatos();
  }, [mesSeleccionado, anioSeleccionado]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const primerDia = new Date(anioSeleccionado, mesSeleccionado, 1);
      const ultimoDia = new Date(anioSeleccionado, mesSeleccionado + 1, 0);

      const fechaInicio = primerDia.toISOString().split('T')[0];
      const fechaFin = ultimoDia.toISOString().split('T')[0];

      const { data: tarData } = await supabase
        .from('tareas')
        .select('*')
        .gte('fecha', fechaInicio)
        .lte('fecha', fechaFin)
        .order('fecha', { ascending: true });

      const { data: evData } = await supabase
        .from('eventos_calendario')
        .select('*')
        .gte('fecha', fechaInicio)
        .lte('fecha', fechaFin)
        .order('fecha', { ascending: true });

      setTareas(tarData || []);
      setEventos(evData || []);
    } catch (error) {
      console.error('Error cargando datos del calendario:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarEvento = async (id: string) => {
    if (!confirm('¿Eliminar este evento?')) return;

    try {
      const { error } = await supabase
        .from('eventos_calendario')
        .delete()
        .eq('id', id);

      if (error) throw error;
      cargarDatos();
    } catch (error) {
      console.error('Error eliminando evento:', error);
      alert('Error al eliminar el evento');
    }
  };

  const agruparPorFecha = () => {
    const grupos: { [key: string]: { tareas: Tarea[]; eventos: EventoCalendario[] } } = {};

    tareas.forEach((tarea) => {
      if (!grupos[tarea.fecha]) {
        grupos[tarea.fecha] = { tareas: [], eventos: [] };
      }
      grupos[tarea.fecha].tareas.push(tarea);
    });

    eventos.forEach((evento) => {
      if (!grupos[evento.fecha]) {
        grupos[evento.fecha] = { tareas: [], eventos: [] };
      }
      grupos[evento.fecha].eventos.push(evento);
    });

    return Object.entries(grupos).sort((a, b) => a[0].localeCompare(b[0]));
  };

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr + 'T12:00:00');
    return fecha.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getColorEvento = (tipo: string) => {
    switch (tipo) {
      case 'reunion':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'audiencia':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'recordatorio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const gruposPorFecha = agruparPorFecha();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center">
          <CalendarIcon className="mr-3" />
          Calendario Completo
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowTareaModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md shadow-md transition-colors flex items-center"
          >
            <CheckSquare className="w-5 h-5 mr-2" />
            Nueva Tarea
          </button>
          <button
            onClick={() => setShowEventoModal(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-md shadow-md transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Evento
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <label className="font-medium text-slate-700">Seleccionar mes:</label>
          <select
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(parseInt(e.target.value))}
            className="px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          >
            {meses.map((mes, index) => (
              <option key={index} value={index}>
                {mes}
              </option>
            ))}
          </select>
          <select
            value={anioSeleccionado}
            onChange={(e) => setAnioSeleccionado(parseInt(e.target.value))}
            className="px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          >
            {[2024, 2025, 2026, 2027].map((anio) => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="mt-4 text-slate-600">Cargando eventos...</p>
        </div>
      ) : gruposPorFecha.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-slate-500 text-lg">
            No hay eventos o tareas programadas para {meses[mesSeleccionado]} de {anioSeleccionado}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {gruposPorFecha.map(([fecha, items]) => (
            <div key={fecha} className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-cyan-500">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-cyan-600" />
                {formatearFecha(fecha)}
              </h3>

              {items.tareas.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-600 mb-2 flex items-center">
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Tareas ({items.tareas.length})
                  </h4>
                  <div className="space-y-2">
                    {items.tareas.map((tarea) => (
                      <div
                        key={tarea.id}
                        className={`p-3 rounded border ${
                          tarea.estado === 'Completado'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className={tarea.estado === 'Completado' ? 'line-through opacity-60' : ''}>
                            <p className="font-medium text-sm">{tarea.titulo}</p>
                            <p className="text-xs text-slate-600 mt-1">
                              {tarea.hora && `${tarea.hora} - `}
                              {tarea.descripcion}
                            </p>
                            {tarea.asignado && (
                              <p className="text-xs text-slate-600 mt-1">
                                Asignado: {tarea.asignado}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              tarea.estado === 'Completado'
                                ? 'bg-green-100 text-green-800'
                                : tarea.estado === 'NoRealizado'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {tarea.estado === 'Completado'
                              ? 'Completado'
                              : tarea.estado === 'NoRealizado'
                              ? 'No Realizado'
                              : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {items.eventos.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-600 mb-2 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Eventos ({items.eventos.length})
                  </h4>
                  <div className="space-y-2">
                    {items.eventos.map((evento) => (
                      <div
                        key={evento.id}
                        className={`p-3 rounded border ${getColorEvento(evento.tipo)}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm">{evento.titulo}</p>
                              <span className="px-2 py-0.5 bg-white bg-opacity-50 rounded text-xs">
                                {evento.tipo}
                              </span>
                            </div>
                            <p className="text-xs mb-1">
                              {evento.hora} ({evento.duracion}h)
                            </p>
                            {evento.descripcion && (
                              <p className="text-xs opacity-80">{evento.descripcion}</p>
                            )}
                            {evento.asignado && (
                              <p className="text-xs mt-1">Asignado: {evento.asignado}</p>
                            )}
                          </div>
                          <button
                            onClick={() => eliminarEvento(evento.id)}
                            className="ml-2 text-red-600 hover:text-red-800"
                            title="Eliminar evento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showTareaModal && (
        <TareaModal
          onClose={() => {
            setShowTareaModal(false);
            cargarDatos();
          }}
        />
      )}

      {showEventoModal && (
        <EventoCalendarioModal
          onClose={() => {
            setShowEventoModal(false);
            cargarDatos();
          }}
        />
      )}
    </div>
  );
}
