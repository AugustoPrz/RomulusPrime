import { useState } from 'react';
import { Scale, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

export function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError('Error al enviar el correo. Verifica tu direccion e intenta de nuevo.');
    } else {
      setSent(true);
    }

    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-xl mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Correo enviado</h1>
            </div>

            <div className="p-8 text-center">
              <p className="text-slate-600 mb-6">
                Hemos enviado un enlace de recuperacion a <strong>{email}</strong>.
                Revisa tu bandeja de entrada y sigue las instrucciones.
              </p>
              <p className="text-sm text-slate-500 mb-6">
                Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
              </p>
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesion
              </button>
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
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Recuperar contrasena</h1>
            <p className="text-amber-100 mt-2">Te enviaremos un enlace de recuperacion</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Correo electronico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="tu@correo.com"
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
                  Enviando...
                </span>
              ) : (
                'Enviar enlace'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesion
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
