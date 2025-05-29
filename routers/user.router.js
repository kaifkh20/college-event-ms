import express from "express"
import User from "../models/User.js"
import {body} from "express-validator"
import userController from "../controllers/user.controller.js"
import authenticateToken from "../auth/middleware.js"

const router = express.Router()

const validatorRegistration = [body('email').isEmail(),body('password').isLength({min:7}),body('role').custom((value)=>{
	if (!['student'].includes(value)){
		throw new Error(`Role ${value} is not valid`)
	}
	return true
})]


const validatorLogin = [body('email').isEmail(),body('password').isLength({min:7})]

/**
 * @swagger
 * /user/register:
 *   post:
 *     tags:
 *       - User Controller
 *     summary: Register a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               password:
 *                 type: string
 *                 example: johndoe123
 *               role:
 *                 type: string
 *                 example: student
 *     responses:
 *       200:
 *         description: Registration successful
 *       500:
 *         description: Failed to register
 */


router.post('/register',validatorRegistration,userController.registerUser);

/**
* @swagger
* /user/login:
*  post:
*    tags:
*      - User Controller
*    summary: User login endpoint
*    requestBody:
*      required: true
*      content:
*        application/json:
*          schema:
*            type: object
*            required:
*              - email
*              - password
*            properties:
*              email:
*                type: string
*                format: email
*                example: johndoe@gmail.com
*              password:
*                type: string
*                example: johndoe123
*    responses:
*      200:
*        description: Login successful
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                accessToken:
*                  type: string
*                  description: JWT access token for authentication
*                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
*      400:
*        description: Invalid credentials
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                error:
*                  type: string
*                  example: "Invalid email or password"
*/

router.post('/login',validatorLogin,userController.loginUser);
/**
* @swagger
* /user/logout:
*  post:
*    tags:
*      - User Controller
*    summary: Log out the user and invalidate the session
*    responses:
*      204:
*        description: Successfully logged out (No Content)
*/
router.post('/logout',userController.logoutUser)

/**
* @swagger
* /user/refresh:
*   post:
*     tags:
*       - User Controller
*     summary: Refresh access token using refresh token
*     description: Generate a new access token using a valid refresh token stored in cookies
*     parameters:
*       - name: refreshToken
*         in: cookie
*         required: true
*         schema:
*           type: string
*         description: Refresh token stored in HTTP-only cookie
*         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
*     responses:
*       200:
*         description: New access token generated successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 accessToken:
*                   type: string
*                   description: New JWT access token
*                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDVlY2I1NGIyNGEwM2Q4YzhiNDU2NyIsImlhdCI6MTYyNDYyMzQ4NSwiZXhwIjoxNjI0NjI3MDg1fQ.xyz"
*       401:
*         description: No refresh token provided
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: "No Token"
*       403:
*         description: Invalid or expired refresh token
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: "Invalid Token"
*/



router.post('/refresh',userController.getRefresh)
/**
* @swagger
* /user/events:
*  get:
*    tags:
*      - User Controller
*    summary: Get all available events
*    responses:
*      200:
*        description: Successfully retrieved events
*        content:
*          application/json:
*            schema:
*              type: array
*              items:
*                type: object
*                properties:
*                  id:
*                    type: string
*                    example: "event123"
*                  name:
*                    type: string
*                    example: "TechFest 2025"
*                  date:
*                    type: string
*                    format: date
*                    example: "2025-06-10"
*                  fee:
*                    type: number
*                    example: 500
*                  subevents:
*                    type: array
*                    items:
*                      type: string
*                    example: ["Coding Challenge", "Robotics Workshop"]
*                  eligibility:
*                    type: array
*                    items:
*                      type: string
*                    example: ["Engineering Students", "Open for all"]
*      400:
*        description: Error retrieving events
*        content:
*          application/json:
*            schema:
*              type: string
*              example: "Error"
*/

router.get('/events',authenticateToken,userController.getEvents)


/**
 * @swagger 
 * /user/event/{id}:
 *   get:
 *     tags:
 *       - User Controller
 *     summary: Get details of a specific event
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the event
 *         example: "event123"
 *     responses:
 *       200:
 *         description: Successfully retrieved event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "event123"
 *                 name:
 *                   type: string
 *                   example: "TechFest 2025"
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2025-06-10"
 *                 fee:
 *                   type: number
 *                   example: 500
 *                 subevents:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Coding Challenge", "Robotics Workshop"]
 *                 eligibility:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Engineering Students", "Open for all"]
 *                 isRegistered:
 *                   type: boolean
 *                   example: false
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
 *         description: Error retrieving event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error retrieving event details"
 */

router.get('/event/:id',authenticateToken,userController.getEventById)


/* no need here */
router.get('/profile',userController.getProfile);

//router.put('/registerOrganizer',validatorOrganizerRegistration,userController.registerOrganizer)

export default router;
