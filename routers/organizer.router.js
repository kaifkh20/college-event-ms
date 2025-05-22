import express from "express"
import multer from "multer"

import {addEvents,getEventById} from "../controllers/organizer.controller.js"
import authenticateToken from "../auth/middleware.js"

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({storage})

const checkForOrganizer = (req,res,next)=>{
	if(req.user.role==="organizer") next()
	else return res.status(400).json({error:"Not an organizer or Admin"}) 
}

router.post("/addEvents",authenticateToken,checkForOrganizer,upload.single('eventImage'),addEvents)
router.get("/event/:id",authenticateToken,checkForOrganizer,getEventById)

export default router


