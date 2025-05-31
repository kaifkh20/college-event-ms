import {validationResult} from "express-validator"
import RegInEvent from "../models/RegisteredEvent.js"
import QRCode from "qrcode"

const registerEvent = async(req,res)=>{
	try{
		const event_id = req.body.event_id
		const amount = req.body.amount
		const user_id = req.user._id
		const studentEmail = req.user.email
		const subevents = req.body.subevents

		if(!event_id && !user_id){
			throw new Error("No sufficient info provided")
		}
		
		const event = new RegInEvent({event_id,student_id:user_id,amountPaid:amount,subEvents:subevents})
		await event.save()
		
		const qrContent = `_id:${event._id}`
			
		event.qrData = qrContent

		await event.save()
			
		console.log(`Registration for ${event_id} by ${user_id} and ${studentEmail} totalling for ${amount}`)
		res.status(200).send("Registration Succesfull")
	}catch(err){
		console.error(err)
		res.status(401).json({error:err})
	}
}

const getRegisteredEvents = async(req,res)=>{
	try{
		const id = req.user._id
		const events = 	await RegInEvent.find({student_id:id})

		res.status(200).send(events)
	}catch(err){
		console.error(err)
		res.status(401).json({error:err})
	}
}

export {registerEvent,getRegisteredEvents}
