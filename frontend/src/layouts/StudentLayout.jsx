import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Home, PenTool, History, AlertOctagon } from 'lucide-react';
const StudentLayout = () => {
  const { user } = useAuth();

  const studentMenu = [
    {
      label: 'Inicio',
      path: '/alumno/dashboard',
      icon: <Home size={22} />
    },
    {
      label: 'Mis Reportes',
      icon: <PenTool size={22} />,
      subItems: [
        { label: 'Crear Reporte', path: '/alumno/reportes/crear' },
        { label: 'Historial de Reportes', path: '/alumno/reportes/historial' }
      ]
    },
    {
      label: 'Soporte Técnico',
      icon: <AlertOctagon size={22} />,
      subItems: [
        { label: 'Mis Reportes', path: '/alumno/reportes' }
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-cuchi-base font-sans">
      <Sidebar menuItems={studentMenu} title="Alumno" user={user} />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;