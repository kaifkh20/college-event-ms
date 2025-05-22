import express from "express"
import User from "../models/User.js"
import {body} from "express-validator"
import userController from "../controllers/user.controller.js"


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


/** schema for user/login 
 *  POST 
 *  payload : email,password
 *
 *  response : 200 with accessToken
 *	       400 invalid creds
 * **/

router.post('/login',validatorLogin,userController.loginUser);

/** schema for user/logout
 *  POST 
 *  payload : 
 *
 *  response : 204
 *
 * **/

router.post('/logout',userController.logoutUser)


/* no need here */
router.get('/profile',userController.getProfile);

//router.put('/registerOrganizer',validatorOrganizerRegistration,userController.registerOrganizer)

export default router;
