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

userSchema.methods.comparePassword = function(candidatePassword) {
	if (!candidatePassword || !this.password) {
        throw new Error('Password and hash are required');
    }
    return bcrypt.compare(candidatePassword, this.password);
}

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();    
    try {
        this.password = await bcrypt.hash(this.password, 7);
        next();
    } catch (error) {
        next(error);
    }
})

const user = mongoose.model('User',userSchema)
export default user
