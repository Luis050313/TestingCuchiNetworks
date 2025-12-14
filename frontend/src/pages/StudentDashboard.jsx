import { useEffect, useState } from 'react';
import { Clock, Calendar, BookOpen, MapPin, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import client from '../config/axios';
import ReporteModal from '../components/ReporteModal'; // ✅ Reutilizamos componente

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Estado Agenda
  const [claseActual, setClaseActual] = useState(null);
  const [siguienteClase, setSiguienteClase] = useState(null);
  
  // Estado Reportes/Notificaciones (Reutilizando endpoints de reportes generales)
  const [stats, setStats] = useState({ activos: 0, resueltos: 0 });
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // CARGA DE DATOS
  useEffect(() => {
    const fetchData = async () => {
        try {
            // 1. Agenda
            const resAgenda = await client.get('/api/alumnos/agenda'); // Asegúrate que el path coincida con tu index.js
            const todas = resAgenda.data;

            // Filtros de Hora (Igual que el docente)
            const dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
            const hoyNombre = dias[new Date().getDay()];
            const ahora = new Date();
            const horaActual = `${ahora.getHours().toString().padStart(2,'0')}:${ahora.getMinutes().toString().padStart(2,'0')}:00`;

            const clasesHoy = todas.filter(c => c.dia_semana === hoyNombre);
            
            const actual = clasesHoy.find(c => horaActual >= c.hora_inicio && horaActual <= c.hora_fin);
            const siguiente = clasesHoy.find(c => c.hora_inicio > horaActual);

            setClaseActual(actual);
            setSiguienteClase(siguiente);

            // 2. Stats Reportes (El alumno también tiene sus stats)
            const resStats = await client.get('/reportes/stats');
            const s = resStats.data;
            setStats({
                activos: (s.nuevo || 0) + (s.en_revision || 0),
                resueltos: s.resuelto || 0
            });

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  // RENDER HERO (Tarjeta Principal)
  const renderHero = () => {
    if (claseActual) {
        return (
            <div className="bg-gradient-to-r from-cuchi-primary to-blue-600 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                
                <div className="relative z-10">
                    <span className="bg-green-400/20 text-green-100 border border-green-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                        🟢 En Curso
                    </span>
                    <h2 className="text-3xl font-bold mb-1">{claseActual.materia}</h2>
                    <p className="text-blue-100 mb-6 flex items-center gap-2">
                        <User size={18}/> Prof. {claseActual.docente_nombre}
                    </p>

                    <div className="flex gap-4">
                        <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                            <p className="text-xs text-blue-200 uppercase font-bold">Horario</p>
                            <p className="font-mono font-bold">{claseActual.hora_inicio.slice(0,5)} - {claseActual.hora_fin.slice(0,5)}</p>
                        </div>
                        <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                            <p className="text-xs text-blue-200 uppercase font-bold">Grupo</p>
                            <p className="font-mono font-bold">{claseActual.grupo}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (siguienteClase) {
        return (
            <div className="bg-white border border-gray-200 rounded-[2rem] p-8 text-center shadow-sm">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-cuchi-primary">
                    <Clock size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-700">Próxima: {siguienteClase.materia}</h2>
                <p className="text-gray-400">Inicia a las <span className="text-cuchi-text font-bold">{siguienteClase.hora_inicio.slice(0,5)}</span></p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-[2rem] flex items-center gap-6">
            <div className="bg-white p-4 rounded-full shadow-sm text-indigo-500">
                <Calendar size={32}/>
            </div>
            <div>
                <h2 className="text-xl font-bold text-indigo-900">¡Libre por hoy! 🎓</h2>
                <p className="text-indigo-600">No tienes más clases agendadas.</p>
            </div>
        </div>
    );
  };

  if (loading) return <div className="p-10">Cargando panel...</div>;

  return (
    <div className="fade-in max-w-5xl mx-auto p-6 font-sans">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-cuchi-text">Hola, {user?.nombre?.split(' ')[0]}</h1>
                <p className="text-gray-400 text-sm">Panel del Estudiante</p>
            </div>
            <div className="text-right hidden sm:block">
                <p className="text-xl font-bold text-cuchi-primary">Semestre {user?.extra?.semestre || 'Actual'}</p>
                <p className="text-xs text-gray-400 uppercase font-bold">{user?.extra?.carrera || 'Ingeniería'}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* COLUMNA PRINCIPAL (Agenda) */}
            <div className="md:col-span-2 space-y-6">
                {renderHero()}

                {/* BOTÓN REPORTE RÁPIDO */}
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-orange-800 flex items-center gap-2">
                            <AlertTriangle size={20}/> Reportar Falla
                        </h3>
                        <p className="text-xs text-orange-600 mt-1 max-w-xs">
                            ¿Tu equipo no funciona? Avísanos para repararlo.
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsReportModalOpen(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-orange-200 transition-all active:scale-95"
                    >
                        Reportar
                    </button>
                </div>
            </div>

            {/* COLUMNA LATERAL (Stats Rápidos) */}
            <div className="space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-700 text-sm mb-4">Mis Reportes</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="text-gray-500 text-xs font-bold uppercase">En Proceso</span>
                            <span className="text-xl font-bold text-blue-600">{stats.activos}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="text-gray-500 text-xs font-bold uppercase">Resueltos</span>
                            <span className="text-xl font-bold text-green-600">{stats.resueltos}</span>
                        </div>
                    </div>
                </div>

                {/* Aquí podríamos poner avisos generales en el futuro */}
            </div>
        </div>

        {/* MODAL */}
        <ReporteModal 
            isOpen={isReportModalOpen} 
            onClose={() => setIsReportModalOpen(false)} 
            onSuccess={() => window.location.reload()}
        />
    </div>
  );
};

export default StudentDashboard;