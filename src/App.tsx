import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ProcuracionBar } from './components/ProcuracionBar';
import { ExpedientesView } from './components/ExpedientesView';
import { TareasView } from './components/TareasView';
import { CalendarioView } from './components/CalendarioView';
import { EmpleadosView } from './components/EmpleadosView';
import type { Vista } from './types';

function App() {
  const [vistaActual, setVistaActual] = useState<Vista>('expedientes');

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

export default App;
