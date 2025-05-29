import Event from "../models/Event.js"

const addEvent= async(req,res)=>{

	const eventImage = req.file.buffer
	const {name,date,subEvents,fee,eligibility} = req.body
	const organizer_id = req.user._id
	try{
		const event = new Event({eventImage,name,date,subEvents,fee,eligibility,organizer_id})
		await event.save()
		res.status(200).send("Event Created")
	}catch(err){
		console.error(err)
		res.status(500).json({error:err})
	}
}

const editEvent = async(req,res)=>{
	const event_id = req.params.event_id
	const updates = req.body
	if(req.file){
		updates[eventImage] = req.file.buffer
	}
	try{
		
		const event = await Event.findById(eventId)

		if(!event)	return res.status(404).json({error:"No such Event found"})
		
		Object.keys(updates).forEach((key)=>{
			if(updates[key]!==undefined) event[key] = updates[key] 
		})
		await event.save()

		return res.status(200).send("Event updated")
	}catch(err){
		console.error(err)
		res.status(500).json({error:"Error occured"})
	}
	
}


export {addEvent,editEvent}

