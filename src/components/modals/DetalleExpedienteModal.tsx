import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Expediente, Movimiento, Tarea } from '../../types';
import { MovimientoModal } from './MovimientoModal';
import { TareaModal } from './TareaModal';

interface DetalleExpedienteModalProps {
  expedienteId: string;
  onClose: () => void;
}

export function DetalleExpedienteModal({ expedienteId, onClose }: DetalleExpedienteModalProps) {
  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [showTareaModal, setShowTareaModal] = useState(false);

  useEffect(() => {
    cargarDetalle();
  }, [expedienteId]);

  const cargarDetalle = async () => {
    setLoading(true);
    try {
      const { data: expData, error: expError } = await supabase
        .from('expedientes')
        .select('*')
        .eq('id', expedienteId)
        .maybeSingle();

      if (expError) throw expError;
      setExpediente(expData);

      const { data: movData, error: movError } = await supabase
        .from('movimientos')
        .select('*')
        .eq('expediente_id', expedienteId)
        .order('fecha', { ascending: false });

      if (movError) throw movError;
      setMovimientos(movData || []);

      const { data: tarData, error: tarError } = await supabase
        .from('tareas')
        .select('*')
        .eq('expediente_id', expedienteId)
        .order('fecha', { ascending: false });

      if (tarError) throw tarError;
      setTareas(tarData || []);
    } catch (error) {
      console.error('Error cargando detalle:', error);
      alert('Error al cargar el detalle del expediente');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarMovimiento = async (movId: string) => {
    if (!confirm('¿Eliminar este movimiento? La tarea asociada también se eliminará.')) return;

    try {
      const { error } = await supabase
        .from('movimientos')
        .delete()
        .eq('id', movId);

      if (error) throw error;
      cargarDetalle();
    } catch (error) {
      console.error('Error eliminando movimiento:', error);
      alert('Error al eliminar el movimiento');
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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      </div>
    );
  }

  if (!expediente) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center sticky top-0">
          <h3 className="text-xl font-semibold">
            {expediente.expte || 'S/D'} - {expediente.nombre}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-700 mb-3">Información General</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Carátula:</strong> {expediente.nombre}</p>
                  <p><strong>Expediente:</strong> {expediente.expte || 'No especificado'}</p>
                  <p><strong>CUIT/DNI:</strong> {expediente.cuit || 'No especificado'}</p>
                  <p><strong>Demanda:</strong> {expediente.demanda || 'No especificado'}</p>
                  <p><strong>Monto:</strong> {expediente.monto || 'No especificado'}</p>
                  <p><strong>Teléfono:</strong> {expediente.telefono || 'No especificado'}</p>
                  <p>
                    <strong>Prioridad:</strong>{' '}
                    <span className={`px-2 py-1 rounded text-xs ${
                      expediente.urgencia === 'Urgente' ? 'bg-red-100 text-red-800' :
                      expediente.urgencia === 'Archivo' ? 'bg-slate-100 text-slate-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {expediente.urgencia}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <h4 className="font-semibold text-cyan-800 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Procuración
                </h4>
                {expediente.procuracion_fecha ? (
                  <div className="space-y-2 text-sm">
                    <p>
                      <Calendar className="inline w-4 h-4 mr-2" />
                      <strong>Fecha:</strong> {formatearFecha(expediente.procuracion_fecha)}
                    </p>
                    {expediente.procuracion_hora && (
                      <p>
                        <Clock className="inline w-4 h-4 mr-2" />
                        <strong>Hora:</strong> {expediente.procuracion_hora}
                      </p>
                    )}
                    {expediente.procuracion_guardada && (
                      <div className="bg-green-50 p-2 rounded mt-2">
                        <p className="text-xs text-green-700">
                          <CheckCircle className="inline w-3 h-3 mr-1" />
                          Guardado: {new Date(expediente.procuracion_guardada).toLocaleString('es-AR')}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Sin procuración registrada</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-yellow-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-slate-700">Movimientos & Plazos</h4>
                <button
                  onClick={() => setShowMovimientoModal(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </button>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {movimientos.length === 0 ? (
                  <p className="text-center text-slate-500 py-4">No hay movimientos registrados</p>
                ) : (
                  movimientos.map((mov) => (
                    <div key={mov.id} className="bg-yellow-50 p-3 rounded border border-yellow-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-grow">
                          <p className="font-medium text-sm">{formatearFecha(mov.fecha)}</p>
                          <p className="text-sm text-slate-700">{mov.descripcion}</p>
                          <span className="inline-block mt-1 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded">
                            Plazo: {mov.dias_plazo} días
                          </span>
                        </div>
                        <button
                          onClick={() => handleEliminarMovimiento(mov.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-slate-700">Tareas del Expediente</h4>
                <button
                  onClick={() => setShowTareaModal(true)}
                  className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </button>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {tareas.length === 0 ? (
                  <p className="text-center text-slate-500 py-4">No hay tareas asociadas</p>
                ) : (
                  tareas.map((tarea) => (
                    <div
                      key={tarea.id}
                      className={`p-3 rounded border ${
                        tarea.estado === 'Completado' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`flex-grow ${tarea.estado === 'Completado' ? 'line-through opacity-60' : ''}`}>
                          <p className="font-medium text-sm">{tarea.titulo}</p>
                          <p className="text-xs text-slate-600">
                            Vence: {formatearFecha(tarea.fecha)}
                            {tarea.hora && ` - ${tarea.hora}`}
                          </p>
                          {tarea.asignado && (
                            <p className="text-xs text-slate-600 mt-1">Asignado: {tarea.asignado}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${getBadgeEstado(tarea.estado)}`}>
                          {tarea.estado === 'Completado' ? 'Completado' :
                           tarea.estado === 'NoRealizado' ? 'No Realizado' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-md transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>

      {showMovimientoModal && (
        <MovimientoModal
          expedienteId={expedienteId}
          onClose={() => {
            setShowMovimientoModal(false);
            cargarDetalle();
          }}
        />
      )}

      {showTareaModal && (
        <TareaModal
          expedienteIdPreseleccionado={expedienteId}
          onClose={() => {
            setShowTareaModal(false);
            cargarDetalle();
          }}
        />
      )}
    </div>
  );
}
