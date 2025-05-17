import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true,
		trim : true,
	},
	email:{
		type : String,
		required : true,
		unique: true,
		index: true
	},
	password : {
		type : String,
		required : true,
		trim : true,
		min : 7
	},
	role : {
		type : String,
		required : true,
		enum : {
			values : ['student','organizer','admin'],
			messages : "Invlaid role type."
		}
	}
})

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
}

userSchema.pre('save',async(next)=>{
	if(!this.isModifed('password')) return next()
	this.password = await bcrypt.hash(this.password,7,(err,hash)=>{
		if(err) throw new Error(err)
		return hash
	})
	next()
})

const user = mongoose.model('User',userSchema)
export default user
