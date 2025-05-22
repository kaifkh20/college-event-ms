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

/** schema for organizer/addEvents
 *  POST 
 *  payload : eventImage,name,date,fee,subevents(array),eligibility(array)
 *
 *  response : 200 "Event Created"
 *	       500 "Error"
 * **/

router.post("/addEvents",authenticateToken,checkForOrganizer,upload.single('eventImage'),addEvents)

/** schema for organizer/event/:id
 *  GET
 *  Params : id "Event id"
 *  response : 200 event_details
 *	       500 "Error"
 * **/


router.get("/event/:id",authenticateToken,checkForOrganizer,getEventById)

export default router


