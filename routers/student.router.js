import express from "express"
import {getEvent,registerEvent} from "../controllers/student.controller.js"
import authenticateToken from "../auth/middleware.js"

const router = express.Router()

router.get('/events',authenticateToken,getEvent)
router.post('/registerEvent',authenticateToken,registerEvent)

export default router
