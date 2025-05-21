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
const validatorOrganizerRegistration = [...validatorLogin,body('admin_id').custom(async(value)=>{
	const admin = await User.findOne({_id:value})
	if(!admin){
		throw new Error("No such user exists")
	}
	return admin.role==="admin"
})]

router.post('/register',validatorRegistration,userController.registerUser);
router.put('/registerOrganizer',validatorOrganizerRegistration,userController.registerOrganizer)
router.post('/login',validatorLogin,userController.loginUser);
router.post('/logout',userController.logoutUser)
router.get('/profile',userController.getProfile);


export default router;
