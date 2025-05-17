import {validationResult} from "express-validator"
import User from "../models/User.js"

const registerUser = async(req,res)=>{	
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		return res.status(400).json({errors:errors.array()})
	}
	
	const {name,email,password,role} = req.body
	try{
		const user = new User(req.body)
		await user.save()
		return res.status(200).send(user)
	}catch(err){
		console.error(err)
		return res.status(400).json({error:err})
	}
}

const loginUser = async(req,res)=>{
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		return res.status(400).json({errors:errors.array()})
	}
	const {email,password} = req.body
	const user = await User.findOne({email})
	if(!user) return res.status(400).json({error:'Invalid credentials'})

	const isMatch = await user.comparePassword(password)
	if(!isMatch) return res.status(400).json({error:'Invalid credentials'})

	res.status(200).send(user)
}

const getProfile = async(req,res)=>{

	res.status(200).send("Profile Sent")
}

export default {registerUser,loginUser,getProfile}
