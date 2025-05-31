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
	subEvents : {
		type : Array
	},
	amountPaid :{
		type : Number,
		default : 0
	},
	qrData:{
		type : String,
	},
	scanned : {
		type : Boolean,
		deafult : false
	},
})

const reg = mongoose.model('RegisteredInEvent',registeredSchema)

export default reg

