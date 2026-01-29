import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Expediente } from '../types';
import { ExpedienteModal } from './modals/ExpedienteModal';
import { DetalleExpedienteModal } from './modals/DetalleExpedienteModal';

export function ExpedientesView() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [filteredExpedientes, setFilteredExpedientes] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [ordenarPor, setOrdenarPor] = useState('reciente');
  const [showModal, setShowModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [expedienteEditar, setExpedienteEditar] = useState<Expediente | null>(null);
  const [expedienteDetalle, setExpedienteDetalle] = useState<string | null>(null);

  useEffect(() => {
    cargarExpedientes();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [expedientes, busqueda, ordenarPor]);

  const cargarExpedientes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('expedientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExpedientes(data || []);
    } catch (error) {
      console.error('Error cargando expedientes:', error);
      alert('Error al cargar expedientes');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtered = [...expedientes];

    if (busqueda) {
      const searchLower = busqueda.toLowerCase();
      filtered = filtered.filter(
        (exp) =>
          exp.nombre.toLowerCase().includes(searchLower) ||
          exp.expte.toLowerCase().includes(searchLower)
      );
    }

    switch (ordenarPor) {
      case 'az':
        filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'urgente':
        filtered = filtered.filter((exp) => exp.urgencia === 'Urgente');
        break;
      default:
        break;
    }

    setFilteredExpedientes(filtered);
  };

  const handleNuevoExpediente = () => {
    setExpedienteEditar(null);
    setShowModal(true);
  };

  const handleEditarExpediente = (exp: Expediente) => {
    setExpedienteEditar(exp);
    setShowModal(true);
  };

  const handleVerDetalle = (id: string) => {
    setExpedienteDetalle(id);
    setShowDetalleModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setExpedienteEditar(null);
    cargarExpedientes();
  };

  const handleDetalleClose = () => {
    setShowDetalleModal(false);
    setExpedienteDetalle(null);
    cargarExpedientes();
  };

  const getBadgeClass = (urgencia: string) => {
    switch (urgencia) {
      case 'Urgente':
        return 'bg-red-100 text-red-800';
      case 'Archivo':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center">
          <Search className="mr-3" />
          Gestión de Expedientes
        </h2>
        <button
          onClick={handleNuevoExpediente}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-md shadow-md transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Expediente
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-5 flex flex-col md:flex-row gap-3">
        <div className="flex-grow">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, expediente..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
          </div>
        </div>
        <div className="w-full md:w-64">
          <select
            value={ordenarPor}
            onChange={(e) => setOrdenarPor(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          >
            <option value="reciente">Más recientes</option>
            <option value="az">Alfabético (A-Z)</option>
            <option value="urgente">Solo urgentes</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="mt-4 text-slate-600">Cargando expedientes...</p>
        </div>
      ) : filteredExpedientes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-slate-500 text-lg">No se encontraron expedientes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExpedientes.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-slate-600 hover:translate-x-1 transition-transform"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-grow">
                  <h3 className="font-semibold text-slate-900 text-lg">{exp.nombre}</h3>
                  <p className="text-sm text-slate-600">
                    Expte: {exp.expte || 'S/D'} | {exp.demanda || 'Sin tipo'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeClass(exp.urgencia)}`}>
                    {exp.urgencia}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="text-sm text-slate-500">
                  {exp.monto && `Monto: ${exp.monto}`}
                  {exp.telefono && ` | Tel: ${exp.telefono}`}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerDetalle(exp.id)}
                    className="p-2 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                  </button>
                  <button
                    onClick={() => handleEditarExpediente(exp)}
                    className="p-2 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ExpedienteModal
          expediente={expedienteEditar}
          onClose={handleModalClose}
        />
      )}

      {showDetalleModal && expedienteDetalle && (
        <DetalleExpedienteModal
          expedienteId={expedienteDetalle}
          onClose={handleDetalleClose}
        />
      )}
    </div>
  );
}
