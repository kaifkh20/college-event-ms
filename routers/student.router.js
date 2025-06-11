import express from "express"
import {registerEvent,getRegisteredEvents} from "../controllers/student.controller.js"
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
 *   post:
 *     tags:
 *       - Student Controller
 *     summary: Register a student for an event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *                 description: ID of the event the student wants to register for
 *                 example: "event123"
 *               amount:
 *                 type: integer
 *                 description: The amount paid for registration
 *                 example: 100
 *               subevents:
 *                 type: array
 *                 description: List of sub-event IDs the student is registering for
 *                 items:
 *                   type: string
 *                 example: ["subeventA", "subeventB"]
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Success"
 *       401:
 *         description: Unauthorized or registration failed
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Error"
 */

router.post('/registerEvent',authenticateToken,checkForRole,registerEvent)

/**
* @swagger
* /student/getRegisteredEvents:
*   get:
*     tags:
*       - Student Controller
*     summary: Retrieve registered events for a student
*     responses:
*       200:
*         description: List of registered events with QR content
*         content:
*           application/json:
*             schema:
*               type: array
*               description: List of registered events
*               items:
*                 type: object
*                 properties:
*                   eventId:
*                     type: string
*                     description: Unique identifier of the event
*                     example: "event123"
*                   eventName:
*                     type: string
*                     description: Name of the event
*                     example: "TechFest 2025"
*                   qrContent:
*                     type: string
*                     description: QR code content for generating QR on frontend
*                     example: "QRData123456"
*       404:
*         description: No registered events found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   description: Error message
*                   example: "no registered events"
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: string
*               example: "internal server error"
*/
router.get('/getRegisteredEvents',authenticateToken,checkForRole,getRegisteredEvents)

//router.post('/pay',authenticateToken,checkForRole,payForRegistration)

export default router
