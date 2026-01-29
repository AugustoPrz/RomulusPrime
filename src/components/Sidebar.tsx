import { Scale, FolderOpen, CheckSquare, Calendar, Users, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Vista } from '../types';

interface SidebarProps {
  vistaActual: Vista;
  onCambiarVista: (vista: Vista) => void;
}

export function Sidebar({ vistaActual, onCambiarVista }: SidebarProps) {
  const { user, signOut } = useAuth();

  const menuItems = [
    { id: 'expedientes' as Vista, icon: FolderOpen, label: 'Expedientes' },
    { id: 'tareas' as Vista, icon: CheckSquare, label: 'Tareas' },
    { id: 'calendario' as Vista, icon: Calendar, label: 'Calendario' },
    { id: 'empleados' as Vista, icon: Users, label: 'Empleados' },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  const userEmail = user?.email || '';
  const userName = user?.user_metadata?.nombre || userEmail.split('@')[0];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white fixed top-0 left-0 shadow-xl flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex flex-col items-center">
          <Scale className="w-12 h-12 mb-3 text-cyan-400" />
          <h4 className="text-lg font-semibold text-center">Sistema Conti</h4>
        </div>
      </div>

      <nav className="mt-4 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = vistaActual === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onCambiarVista(item.id)}
              className={`w-full px-6 py-4 flex items-center transition-all border-l-4 ${
                isActive
                  ? 'bg-slate-800 text-white border-cyan-400'
                  : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-4" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-slate-400 truncate">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Cerrar sesion"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
