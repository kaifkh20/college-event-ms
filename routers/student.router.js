import express from "express"
import {registerEvent} from "../controllers/student.controller.js"
import authenticateToken from "../auth/middleware.js"

const router = express.Router()

const checkForRole = (req,res,next)=>{
	if(req.user.role==="student") next()
	else{
		res.status(400).json({error:"Role should be Student"})
	}
}
/**
* @swagger
* /student/registerEvent:
*  post:
*    tags:
*      - Student Controller
*    summary: Register a student for an event
*    requestBody:
*      required: true
*      content:
*        application/json:
*          schema:
*            type: object
*            properties:
*              eventId:
*                type: string
*                description: ID of the event the student wants to register for
*                example: "event123"
*    responses:
*      200:
*        description: Registration successful
*        content:
*          application/json:
*            schema:
*              type: string
*              example: "Success"
*      401:
*        description: Unauthorized or registration failed
*        content:
*          application/json:
*            schema:
*              type: string
*              example: "Error"
*/
router.post('/registerEvent',authenticateToken,checkForRole,registerEvent)


//router.post('/pay',authenticateToken,checkForRole,payForRegistration)

export default router
