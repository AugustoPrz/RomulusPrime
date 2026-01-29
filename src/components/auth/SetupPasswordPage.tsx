import { useState, useEffect } from 'react';
import { Scale, Lock, Eye, EyeOff, CheckCircle, AlertCircle, UserCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SetupPasswordPageProps {
  onComplete: () => void;
}

export function SetupPasswordPage({ onComplete }: SetupPasswordPageProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.nombre) {
        setUserName(session.user.user_metadata.nombre);
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        throw updateError;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.empleado_id) {
        await supabase
          .from('empleados')
          .update({ invite_status: 'accepted' })
          .eq('id', session.user.user_metadata.empleado_id);
      }

      setSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (err) {
      console.error('Error setting password:', err);
      setError('Error al configurar la contrasena. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-xl mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Cuenta configurada</h1>
            </div>

            <div className="p-8 text-center">
              <p className="text-slate-600 mb-4">
                Tu cuenta ha sido configurada correctamente.
              </p>
              <p className="text-sm text-slate-500">
                Redirigiendo al sistema...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-xl mb-4">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Bienvenido al Estudio</h1>
            {userName && (
              <p className="text-amber-100 mt-2">Hola, {userName}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="text-center mb-4">
              <p className="text-slate-600">
                Configura tu contrasena para acceder al sistema
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contrasena
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="Minimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirmar contrasena
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="Repite tu contrasena"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 focus:ring-4 focus:ring-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Configurando...
                </span>
              ) : (
                'Configurar cuenta'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">
          Estudio Juridico - Sistema de Gestion
        </p>
      </div>
    </div>
  );
}
