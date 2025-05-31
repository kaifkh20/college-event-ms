import express from "express"
import multer from "multer"

import authenticateToken from "../auth/middleware.js"
import {addEvent,editEvent,scanRegistration} from "../controllers/shared.controller.js"

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({storage})

const checkForOrganizer = (req,res,next)=>{
	if(req.user.role==="organizer") next()
	else return res.status(400).json({error:"Not an organizer or Admin"}) 
}
/**
 * @swagger
 * /organizer/addEvent:
 *   post:
 *     tags:
 *       - Organizer Controller
 *     summary: Create a new event
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - eventImage
 *               - name
 *               - date
 *               - fee
 *               - subevents
 *               - eligibility
 *             properties:
 *               eventImage:
 *                 type: string
 *                 format: binary
 *                 description: Upload event image file
 *               name:
 *                 type: string
 *                 description: Name of the event
 *                 example: "TechFest 2025"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the event
 *                 example: "2025-06-10"
 *               fee:
 *                 type: number
 *                 description: Entry fee for the event
 *                 example: 500
 *               subevents:
 *                 type: array
 *                 description: List of sub-events under this event
 *                 items:
 *                   type: string
 *                 example: ["Coding Challenge", "Robotics Workshop"]
 *               eligibility:
 *                 type: array
 *                 description: Eligibility criteria for participants
 *                 items:
 *                   type: string
 *                 example: ["Engineering Students", "Open for all"]
 *     responses:
 *       200:
 *         description: Event Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Event Created"
 *       500:
 *         description: Error while creating event
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Error"
 */
router.post("/addEvent",authenticateToken,checkForOrganizer,upload.single('eventImage'),addEvent)
/**
 * @swagger
 * /organizer/editEvent/{event_id}:
 *   patch:
 *     tags:
 *       - Organizer Controller
 *     summary: Edit an existing event
 *     parameters:
 *       - in: path
 *         name: event_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to edit
 *         example: "60d5ecb54b24a03d8c8b4567"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *             properties:
 *               eventId:
 *                 type: string
 *                 description: ID of the event to edit
 *                 example: "60d5ecb54b24a03d8c8b4567"
 *               eventImage:
 *                 type: string
 *                 format: binary
 *                 description: New event image file (optional)
 *               name:
 *                 type: string
 *                 description: Updated name of the event
 *                 example: "TechFest 2025 - Updated"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Updated date of the event
 *                 example: "2025-06-15"
 *               fee:
 *                 type: number
 *                 description: Updated entry fee for the event
 *                 example: 600
 *               subevents:
 *                 type: array
 *                 description: Updated list of sub-events under this event
 *                 items:
 *                   type: string
 *                 example: ["Advanced Coding Challenge", "AI Workshop", "Robotics Competition"]
 *               eligibility:
 *                 type: array
 *                 description: Updated eligibility criteria for participants
 *                 items:
 *                   type: string
 *                 example: ["Computer Science Students", "Engineering Students"]
 *     responses:
 *       200:
 *         description: Event Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event updated successfully"
 *                 event:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d5ecb54b24a03d8c8b4567"
 *                     name:
 *                       type: string
 *                       example: "TechFest 2025 - Updated"
 *                     date:
 *                       type: string
 *                       example: "2025-06-15"
 *                     fee:
 *                       type: number
 *                       example: 600
 *       400:
 *         description: Bad Request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Event ID is required"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Access token required"
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Admin access required"
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Event not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error updating event"
 */
router.patch('/editEvent/:event_id',authenticateToken,checkForOrganizer,upload.single('eventImage'),editEvent)
/**
* @swagger
* /organizer/scan:
*    post:
*      tags:
*        - Organizer Controller
*      summary: Scan a QR code
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                qr:
*                  type: string
*                  description: QR code data
*                  example: "ABCD1234XYZ"
*      responses:
*        200:
*          description: Scanned successfully
*          content:
*            application/json:
*              schema:
*                type: string
*                example: "Scanned successfully"
*        400:
*          description: QR code already scanned
*          content:
*            application/json:
*              schema:
*                type: string
*                example: "Already scanned"
*        404:
*          description: Invalid QR code
*          content:
*            application/json:
*              schema:
*                type: string
*                example: "Invalid"
*/
router.post('/scan',authenticateToken,checkForOrganizer,scanRegistration)

export default router


