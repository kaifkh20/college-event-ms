import mongoose from "mongoose"
import "dotenv/config"

const MONGO_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.c4ue0z8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const dbConnect = async()=>{
	console.log("Connecting to Database....")
	try{
		await mongoose.connect(MONGO_URI)
		console.log("Databse Connected...")
	}catch(err){
		throw new Error(err)
		console.error(err)
	}

}

export default dbConnect
