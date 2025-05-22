import express from "express"
import {registerOrganizer} from "../controllers/admin.controller.js"
import authenticateToken from "../auth/middleware.js"

const router = express.Router()

const validateAdmin = (req,res,next)=>{
	if(req.user.role==="admin") next()
	else return res.status(400).json({error:"Unauth access"})
}


/** schema admin/registerOrganizer
 *  PUT
 *  payload : user_id (id of the student to promoted to organizer)
 *
 *  response : 200 
 *	       400 
 * **/


router.put('/registerOrganizer',authenticateToken,validateAdmin,registerOrganizer)

export default router

