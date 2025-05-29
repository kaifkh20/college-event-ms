import mongoose from "mongoose"

const registeredSchema = new mongoose.Schema({
	event_id : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Event'
	},
	student_id : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'User'
	},
	scanned : {
		type : Boolean,
		deafult : false
	},
})

const reg = mongoose.model('RegisteredInEvent',registeredSchema)

export default reg

