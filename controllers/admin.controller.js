import {validationResult} from "express-validator"
import User from "../models/User.js"
import RegInEvent from "../models/RegisteredEvent.js"

const registerOrganizer = async(req,res)=>{
	try{
		const user_id = req.body.user_id
		const user = await User.findOneAndUpdate({_id:user_id},{$set:{role:"organizer"}},{new : true})
		res.status(200).send(user)
	}catch(err){
		console.error(err)
		res.status(400).json({error:"Error Occured"})
	}
}

const registerAdmin = async(req,res)=>{
	try{
		const user_id = req.body.user_id
		const user = await User.findByIdAndUpdate(id,{role:"admin"})
		res.status(200).send(user)
	}catch(err){
		console.error(err)
		res.status(400).json({error:"Error Occured"})
	}
}

const removeRegistration = async(req,res)=>{
	try{
		const {event_id,user_id} = req.body
		const event = await RegInEvent.remove({event_id:event_id,user_id:user_id})
		if(!event) res.status(400).json({error:"No Registration Found"})
		res.status(200).send("Succesfully removed")
	}catch(err){
		console.error(err)
		res.status(400).json({error:"Error occured"})
	}
}

export {registerOrganizer,registerAdmin,removeRegistration}
