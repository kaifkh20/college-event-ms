import {validationResult} from "express-validator"
import Event from "../models/Event.js"

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
		const {even_id} = req.body
	}catch(err){
		console.error(err)
		res.status(401).json({error:err})
	}
}


export {getEvent,registerEvent}
