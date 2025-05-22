import {validationResult} from "express-validator"

import User from "../models/User.js"

import { generateAccessToken, generateRefreshToken } from "../auth/auth.js"

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
	
	const accessToken = generateAccessToken({id:user._id})
	const refreshToken = generateRefreshToken({id:user._id})
	
	res.cookie("refreshToken",refreshToken,{
		httpOnly : true,
		secure : true,
		sameSite : "Lax",
		maxAge : 7*24*60*60*1000
	})

	res.status(200).json({
		accessToken	
	})
}

const logoutUser = async(req,res)=>{
	try{
		res.clearCookie("refreshToken")
		res.sendStatus(204)
	}catch(err){
		console.error(err)
		res.status(500).json({error:"Logout Error"})
	}
}

const getProfile = async(req,res)=>{

	res.status(200).send("Profile Sent")
}

export default {registerUser,loginUser,logoutUser,getProfile}
