import Event from "../models/Event.js"

const addEvents = async(req,res)=>{

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


export {addEvents}
