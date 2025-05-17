import express from "express" 
import {body} from "express-validator"
import userController from "../controllers/user.controller.js"


const router = express.Router()

const validatorRegistration = [body('email').isEmail(),body('password').isLength({min:7}),body('role').custom((value)=>{
	if (!['student','organizer','admin'].includes(value)){
		throw new Error(`Role ${value} is not valid`)
	}
	return true
})]

const validatorLogin = [body('email').isEmail(),body('password').isLength({min:7})]

router.post('/register',validatorRegistration,userController.registerUser);
router.post('/login',validatorLogin,userController.loginUser);
router.get('/profile',userController.getProfile);

export default router;
