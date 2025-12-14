import pool from '../src/db.js';

export const getMiAgenda = async (req, res, next) => {
    try {
        const usuario_id = req.user.id;

        // 1. Obtener datos académicos del alumno (Semestre y Carrera)
        const [alumnoData] = await pool.query(`
            SELECT semestre, carrera 
            FROM Alumnos 
            WHERE usuario_id = ?
        `, [usuario_id]);

        if (alumnoData.length === 0) {
            return res.status(404).json({ message: "Perfil de alumno no encontrado" });
        }

        const { semestre, carrera } = alumnoData[0];

        // 2. Buscar clases que coincidan con su semestre
        // (JOINs para traer nombre de Materia y Docente)
        const [clases] = await pool.query(`
            SELECT 
                c.id, c.grupo, c.dia_semana, c.hora_inicio, c.hora_fin,
                m.nombre as materia,
                doc_user.nombre as docente_nombre
            FROM Clases c
            JOIN Materias m ON c.materia_id = m.id
            JOIN Docentes d ON c.docente_id = d.id
            JOIN Usuarios doc_user ON d.usuario_id = doc_user.id
            WHERE m.semestre = ? 
            -- Opcional: AND m.carrera = ? (si queremos ser estrictos)
            ORDER BY FIELD(c.dia_semana, 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'), c.hora_inicio
        `, [semestre]);

        res.json(clases);
    } catch (error) {
        next(error);
    }
};