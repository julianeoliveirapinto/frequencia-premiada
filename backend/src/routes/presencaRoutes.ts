import { Router } from 'express'
import {
  editarPresenca,
  lancarFaltaJustificada,
  listarAuditoria,
  registrarPresenca,
  listarPresencas
} from '../controllers/presencaController'
import { autenticar, autorizarRole } from '../middlewares/authMiddleware'

const router = Router()

// Rota que o App Mobile chama (GET /presencas)
router.get('/', autenticar, autorizarRole(['professor']), listarPresencas)

router.post('/', autenticar, autorizarRole(['professor']), registrarPresenca)
router.put('/:id', autenticar, autorizarRole(['professor']), editarPresenca)
router.post('/justificada', autenticar, autorizarRole(['professor']), lancarFaltaJustificada)
router.get('/auditoria', autenticar, autorizarRole(['professor']), listarAuditoria)

export default router
