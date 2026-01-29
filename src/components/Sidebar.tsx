import { Scale, FolderOpen, CheckSquare, Calendar, Users } from 'lucide-react';
import type { Vista } from '../types';

interface SidebarProps {
  vistaActual: Vista;
  onCambiarVista: (vista: Vista) => void;
}

export function Sidebar({ vistaActual, onCambiarVista }: SidebarProps) {
  const menuItems = [
    { id: 'expedientes' as Vista, icon: FolderOpen, label: 'Expedientes' },
    { id: 'tareas' as Vista, icon: CheckSquare, label: 'Tareas' },
    { id: 'calendario' as Vista, icon: Calendar, label: 'Calendario' },
    { id: 'empleados' as Vista, icon: Users, label: 'Empleados' },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white fixed top-0 left-0 shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <div className="flex flex-col items-center">
          <Scale className="w-12 h-12 mb-3 text-cyan-400" />
          <h4 className="text-lg font-semibold text-center">Sistema Conti</h4>
        </div>
      </div>

      <nav className="mt-4">
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
    </div>
  );
}
