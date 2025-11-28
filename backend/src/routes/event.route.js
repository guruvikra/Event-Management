import { Router } from 'express'
import { createEvent, getUserEvents, updateEvent } from '../controllers/events.controller.js'
const router = Router()


router.post('/create', createEvent)
router.get('/get/:id', getUserEvents)
router.put('/update/:id', updateEvent)


export default router