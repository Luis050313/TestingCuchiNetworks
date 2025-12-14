import { Router } from 'express';
import { verifyToken, isAlumno } from '../middleware/auth.middleware.js';
import { getMiAgenda } from '../controllers/alumnos.controller.js';

const router = Router();

router.get('/agenda', verifyToken, isAlumno, getMiAgenda);

export default router;