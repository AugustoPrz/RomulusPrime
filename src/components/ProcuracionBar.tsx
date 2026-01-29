import { useState } from 'react';
import { Clock, Save, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function ProcuracionBar() {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleGuardar = async () => {
    if (!fecha) {
      alert('Debe ingresar una fecha para la procuración');
      return;
    }

    setGuardando(true);
    setMensaje('');

    try {
      const { data: expedientes, error: fetchError } = await supabase
        .from('expedientes')
        .select('id');

      if (fetchError) throw fetchError;

      const updates = expedientes?.map((exp) => ({
        id: exp.id,
        procuracion_fecha: fecha,
        procuracion_hora: hora || null,
        procuracion_guardada: new Date().toISOString(),
      }));

      if (updates && updates.length > 0) {
        const { error: updateError } = await supabase
          .from('expedientes')
          .upsert(updates);

        if (updateError) throw updateError;

        setMensaje(`Procuración guardada exitosamente en ${updates.length} expedientes`);
        setTimeout(() => setMensaje(''), 5000);
      } else {
        setMensaje('No hay expedientes para actualizar');
      }
    } catch (error) {
      console.error('Error guardando procuración:', error);
      alert('Error al guardar la procuración');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-5 mb-5 shadow-sm border-t-4 border-cyan-400">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
        <div className="lg:col-span-3">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <Clock className="inline w-4 h-4 mr-2" />
            PROCURACIÓN - FECHA Y HORA GENERAL
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
            <button
              onClick={handleGuardar}
              disabled={guardando}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {guardando ? 'Guardando...' : 'Guardar Procuración'}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Esta fecha y hora se aplicará a TODOS los expedientes como referencia de procuración.
          </p>
        </div>
        <div className="flex items-center justify-center lg:justify-end">
          {mensaje && (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">{mensaje}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
