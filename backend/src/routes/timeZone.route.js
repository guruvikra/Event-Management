import { Router } from "express";
import { getTimezoneInfo, getTimezoneInfoByKey } from '../controllers/timeZone.controller.js'

const router = Router();


router.get('/', getTimezoneInfo)
router.get('/:key', getTimezoneInfoByKey)

export default router
