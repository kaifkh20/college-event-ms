import {validationResult} from "express-validator"
import RegInEvent from "../models/RegisteredEvent.js"
import QRCode from "qrcode"

import sendConfirmationMail from "../extras/sendEmail.js"

const registerEvent = async(req,res)=>{
	try{
		const event_id = req.body.eventId
		const amount = req.body.amount
		const user_id = req.user._id
		const studentEmail = req.user.email
		const subevents = req.body.subevents

		if(!event_id && !user_id){
			throw new Error("No sufficient info provided")
		}
		
		if(await RegInEvent.exists({event_id,student_id:user_id})) return res.status(400).json({error:"Already Registered"})

		const event = new RegInEvent({event_id,student_id:user_id,amountPaid:amount,subEvents:subevents})
		await event.save()
		
		const qrContent = `_id:${event._id}`
			
		event.qrData = qrContent

		await event.save()
						
		console.log(`Registration for ${event_id} by ${user_id} and ${studentEmail} totalling for ${amount}`)
		
		sendConfirmationMail(studentEmail,event)

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
		if(events.length==0) return res.status(404).json({error:"No registered events"})
		res.status(200).send(events)
	}catch(err){
		console.error(err)
		res.status(500).json({error:"Internal server error"})
	}
}

export {registerEvent,getRegisteredEvents}
