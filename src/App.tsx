import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/Sidebar';
import { ProcuracionBar } from './components/ProcuracionBar';
import { ExpedientesView } from './components/ExpedientesView';
import { TareasView } from './components/TareasView';
import { CalendarioView } from './components/CalendarioView';
import { EmpleadosView } from './components/EmpleadosView';
import { LoginPage } from './components/auth/LoginPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { SetupPasswordPage } from './components/auth/SetupPasswordPage';
import { supabase } from './lib/supabase';
import type { Vista } from './types';

type AuthView = 'login' | 'forgot-password' | 'reset-password' | 'setup-password';

function AppContent() {
  const { user, loading } = useAuth();
  const [vistaActual, setVistaActual] = useState<Vista>('expedientes');
  const [authView, setAuthView] = useState<AuthView>('login');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthFlow = async () => {
      const hash = window.location.hash;

      if (hash && hash.includes('type=recovery')) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setAuthView('reset-password');
          window.history.replaceState(null, '', window.location.pathname);
        }
      } else if (hash && hash.includes('type=invite')) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setAuthView('setup-password');
          window.history.replaceState(null, '', window.location.pathname);
        }
      } else if (window.location.pathname === '/reset-password') {
        setAuthView('reset-password');
      } else if (window.location.pathname === '/setup-password') {
        setAuthView('setup-password');
      }

      setCheckingAuth(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setAuthView('reset-password');
      } else if (event === 'SIGNED_IN') {
        const hash = window.location.hash;
        if (hash && hash.includes('type=invite')) {
          setAuthView('setup-password');
        }
      }
    });

    checkAuthFlow();

    return () => subscription.unsubscribe();
  }, []);

  if (loading || checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-amber-500 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authView === 'forgot-password') {
      return <ForgotPasswordPage onBack={() => setAuthView('login')} />;
    }
    return <LoginPage onForgotPassword={() => setAuthView('forgot-password')} />;
  }

  if (authView === 'reset-password') {
    return (
      <ResetPasswordPage
        onComplete={() => {
          setAuthView('login');
          window.history.replaceState(null, '', '/');
        }}
      />
    );
  }

  if (authView === 'setup-password') {
    return (
      <SetupPasswordPage
        onComplete={() => {
          setAuthView('login');
          window.history.replaceState(null, '', '/');
        }}
      />
    );
  }

  const renderVista = () => {
    switch (vistaActual) {
      case 'expedientes':
        return <ExpedientesView />;
      case 'tareas':
        return <TareasView />;
      case 'calendario':
        return <CalendarioView />;
      case 'empleados':
        return <EmpleadosView />;
      default:
        return <ExpedientesView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar vistaActual={vistaActual} onCambiarVista={setVistaActual} />
      <div className="ml-64 p-8">
        <ProcuracionBar />
        {renderVista()}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
