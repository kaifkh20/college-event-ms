import express from "express"
import {getEvent,registerEvent,getEventById} from "../controllers/student.controller.js"
import authenticateToken from "../auth/middleware.js"

const router = express.Router()

const checkForRole = (req,res,next)=>{
	if(req.user.role==="student") next()
	else{
		res.status(400).json({error:"Role should be Student"})
	}
}

router.get('/events',authenticateToken,getEvent)
router.get('/event/:id',authenticateToken,getEventById)
router.post('/registerEvent',authenticateToken,checkForRole,registerEvent)


export default router
