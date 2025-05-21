import mongoose from "mongoose"

const registeredSchema = new mongoose.Schema({
	event_id : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Event'
	},
	student_id : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'User'
	}
})

const reg = mongoose.model('RegisteredInEvent',registeredSchema)

export default reg

