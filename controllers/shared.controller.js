import Event from "../models/Event.js"
import RegInEvent from "../models/RegisteredEvent.js"

const addEvent= async(req,res)=>{

	const {imageUrl,name,date,subEvents,fee,eligibility} = req.body
	const organizer_id = req.user._id
	try{
		const event = new Event({imageUrl,name,date,subEvents,fee,eligibility,organizer_id})
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
	try{
		
		const event = await Event.findById(event_id)

		if(!event)	return res.status(404).json({error:"No such Event found"})
		if (updates && typeof updates === 'object') {
		  Object.keys(updates).forEach((key) => {
		    if (updates[key] !== undefined && updates[key] !== null) {
		      event[key] = updates[key];
		    }
		  });
		} else {
		 throw Error("udpates is not an object")
		  console.error("updates is not an object or is null/undefined");
		}
		
		await event.save()

		return res.status(200).send("Event updated")
	}catch(err){
		console.error(err)
		res.status(500).json({error:"Error occured"})
	}
	
}

const scanRegistration = async(req,res)=>{
	try{
		const {qr} = req.body

		const regId = qr.split(':')[1]

		const record = await RegInEvent.findById(regId)
		
		if(!record) res.status(404).json({error:"No such record"})

		if(record.scanned) res.status(400).json({error:"Already used"})

		record.scanned = true

		await record.save()

		res.status(200).send("Scanned succesfully")
	}catch(err){
		console.error(err)
		res.status(500).json({error:"Internal Server Error"})
	}
}

const deleteEvent = async(req,res)=>{
	try{
		const id = req.params.id
		const deletedEvent = await Event.findByIdAndDelete(id)

		if(deletedEvent) return res.status(200).send("Event deleted")
		
		res.status(400).json({error:"Invalid event"})
	}catch(err){
		console.log(err)
		return res.status(500).json({error:"Internal server"})
	}

}

export {addEvent,editEvent,scanRegistration,deleteEvent}

