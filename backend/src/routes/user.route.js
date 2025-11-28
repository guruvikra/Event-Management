import { Router } from "express";
import { createUser, getUsers } from '../controllers/user.controller.js'

const router = Router();

router.route('/create')
    .post(createUser)

router.route('/')
    .get(getUsers)

export default router
