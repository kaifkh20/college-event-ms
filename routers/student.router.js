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

/** schema for student/events
 *  GET
 *  Summary - Get all the events
 *  No params
 *
 *  response : 200 "Success"
 *	       400 "Error"
 *
 * **/

router.get('/events',authenticateToken,getEvent)

/** schema for student/event/:id
 *  GET
 *  Summary - Get a event info
 *  Params - id "Id of event"
 *
 *  response : 200 "Success"
 *	       500 "Error"
 *
 * **/

router.get('/event/:id',authenticateToken,getEventById)
/** schema for student/registerEvent
 *  POST
 *  Summary - Register in a Event
 *  No params
 *
 *  response : 200 "Success"
 *	       401 "Error"
 *
 * **/

router.post('/registerEvent',authenticateToken,checkForRole,registerEvent)


export default router
