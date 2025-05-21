import {validationResult} from "express-validator"
import Event from "../models/Event.js"
import RegInEvent from "../models/RegisteredEvent.js"


const getEvent = async(req,res)=>{
	try{
		const events = await Event.find({})
		res.status(200).send(events)
	}catch(err){
		console.error(err)
		res.status(400).json({error:err})
	}	
}


const registerEvent = async(req,res)=>{
	try{
		const event_id = req.body.event_id
		const amount = req.body.amount
		const user_id = req.user._id
		const studentEmail = req.user.email
		
		if(!event_id && !user_id){
			throw new Error("No sufficient info provided")
		}

		const event = new RegInEvent({event_id,student_id:user_id})
		await event.save()

		console.log(`Registration for ${event_id} by ${user_id} and ${studentEmail} totaling for ${amount}`)
		res.status(200).send("Registered in Event")
	}catch(err){
		console.error(err)
		res.status(401).json({error:err})
	}
}


export {getEvent,registerEvent}
