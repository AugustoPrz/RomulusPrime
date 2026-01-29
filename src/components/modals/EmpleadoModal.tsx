import { useState, useEffect } from 'react';
import { X, Send, Mail, CheckCircle, Clock, AlertCircle } from 'lucide-react';
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
  const [enviandoInvitacion, setEnviandoInvitacion] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);

  useEffect(() => {
    if (empleado) {
      setFormData({
        nombre: empleado.nombre,
        rol: empleado.rol,
        email: empleado.email,
        telefono: empleado.telefono,
        activo: empleado.activo,
      });
      setInviteStatus((empleado as Empleado & { invite_status?: string }).invite_status || null);
    }
  }, [empleado]);

  const sendInvite = async (empleadoId: string, email: string, nombre: string) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(`${supabaseUrl}/functions/v1/send-invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ email, nombre, empleadoId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al enviar invitacion');
    }

    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.rol || !formData.email) {
      alert('Complete los campos obligatorios (Nombre, Rol y Email)');
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
        const { data: newEmpleado, error } = await supabase
          .from('empleados')
          .insert([formData])
          .select()
          .single();

        if (error) throw error;

        setEnviandoInvitacion(true);
        try {
          await sendInvite(newEmpleado.id, formData.email, formData.nombre);
          alert('Empleado creado e invitacion enviada exitosamente');
        } catch (inviteError) {
          console.error('Error enviando invitacion:', inviteError);
          alert(`Empleado creado pero hubo un error al enviar la invitacion: ${(inviteError as Error).message}`);
        }
      }

      onClose();
    } catch (error) {
      console.error('Error guardando empleado:', error);
      alert('Error al guardar el empleado');
    } finally {
      setGuardando(false);
      setEnviandoInvitacion(false);
    }
  };

  const handleResendInvite = async () => {
    if (!empleado) return;

    setEnviandoInvitacion(true);
    try {
      await sendInvite(empleado.id, formData.email, formData.nombre);
      setInviteStatus('pending');
      alert('Invitacion reenviada exitosamente');
    } catch (error) {
      console.error('Error reenviando invitacion:', error);
      alert(`Error al reenviar invitacion: ${(error as Error).message}`);
    } finally {
      setEnviandoInvitacion(false);
    }
  };

  const getInviteStatusBadge = () => {
    if (!inviteStatus || inviteStatus === 'none') return null;

    if (inviteStatus === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
          <Clock className="w-3 h-3" />
          Invitacion pendiente
        </span>
      );
    }

    if (inviteStatus === 'accepted') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
          <CheckCircle className="w-3 h-3" />
          Cuenta activa
        </span>
      );
    }

    return null;
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
          {empleado && inviteStatus && (
            <div className="mb-4 flex items-center justify-between">
              {getInviteStatusBadge()}
              {inviteStatus === 'pending' && (
                <button
                  type="button"
                  onClick={handleResendInvite}
                  disabled={enviandoInvitacion}
                  className="inline-flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-700 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {enviandoInvitacion ? 'Enviando...' : 'Reenviar invitacion'}
                </button>
              )}
            </div>
          )}

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
                  Telefono
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
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email *
                </span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="Se enviara invitacion a este correo"
                required
                disabled={empleado && inviteStatus === 'accepted'}
              />
              {!empleado && (
                <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Se enviara una invitacion automaticamente al crear el empleado
                </p>
              )}
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
              disabled={guardando || enviandoInvitacion}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {guardando || enviandoInvitacion ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {enviandoInvitacion ? 'Enviando invitacion...' : 'Guardando...'}
                </>
              ) : (
                <>
                  {!empleado && <Send className="w-4 h-4" />}
                  {empleado ? 'Guardar Empleado' : 'Crear y Enviar Invitacion'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
