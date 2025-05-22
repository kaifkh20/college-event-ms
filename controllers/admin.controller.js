import {validationResult} from "express-validator"
import User from "../models/User.js"

const registerOrganizer = async(req,res)=>{
	try{
		const user = await User.findOneAndUpdate({_id:user_id},{$set:{role:"organizer"}},{new : true})
		res.status(200).send(user)
	}catch(err){
		res.status(400).json({error:err})
	}
}

export {registerOrganizer}
