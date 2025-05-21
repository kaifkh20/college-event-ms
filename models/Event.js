import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({
	eventImage : {
		type : Buffer
	},
	name : {
		type : String,
		required : true
	},
	date:{
		type : Date,
		required : true
	},
	subEvents : {
		type : [String],
		required : true,
	},
	fee : {
		type : String,
		default : 0,
		required : true
	},
	eligibility : {
		type : [String],
		default : ["Open For All"],
		required : true
	}
})

const event = mongoose.model('Event',eventSchema)

export default event
