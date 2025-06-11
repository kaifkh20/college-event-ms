import mongoose from "mongoose"
import RegInEvent from "../models/RegisteredEvent.js"

const eventSchema = new mongoose.Schema({
	imageUrl : {
		type : String,
		required:false,
		default : ""
	},
	name : {
		type : String,
		required : true
	},
	date:{
		type : Date,
		required : true
	},
	description:{
		type : String,
		required : true,
		default : "No description"
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
	},
	venue :{
		type : String,
		required : true,
		default : "Nill"
	},
	organizer_id:{
		type : mongoose.Schema.Types.ObjectId,
		ref : 'User'
	}
})

// This handles deletion via User.findByIdAndDelete(), User.deleteOne(), User.deleteMany()
eventSchema.pre(['deleteOne', 'deleteMany'], { document: false, query: true }, async function(next) {
  // 'this' refers to the query object here
  const query = this.getQuery(); // Get the query that is causing the deletion (e.g., { _id: '...' } or { email: '...' })
  console.log('Event deletion query:', query);

  // Find the IDs of the users that are about to be deleted
  // This step is necessary because `deleteMany` or `deleteOne` might not give you the `_id` directly in `this`
  // if the query is not on `_id`.
  const eventsToDelete = await Event.find(query).select('_id');
  const eventIdsToDelete = eventsToDelete.map(event => event._id);

  if (eventIdsToDelete.length > 0) {
    console.log(`Pre-delete hook for user(s): ${eventIdsToDelete}. Deleting associated registration.`);
    // Delete all posts where userId is in the list of evntIdsToDelete
    await RegInEvent.deleteMany({ event: { $in: eventIdsToDelete } });
  }

  next();
});
const event = mongoose.model('Event',eventSchema)

export default event
