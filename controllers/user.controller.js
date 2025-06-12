import {validationResult} from "express-validator"
import jwt from "jsonwebtoken"

import User from "../models/User.js"
import Event from "../models/Event.js"
import RegInEvent from "../models/RegisteredEvent.js"
import { generateAccessToken, generateRefreshToken } from "../auth/auth.js"

const registerUser = async(req,res)=>{	
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		console.error(errors.array())
		return res.status(400).json({errors:errors.array()})
	}
	
	const {name,email,password} = req.body 
	try{
		const user = new User(req.body)
		await user.save()
		return res.status(200).send(user)
	}catch(err){
		console.error(err)
		return res.status(400).json({error:"Already exists!"})
	}
}


const loginUser = async(req,res)=>{
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		return res.status(400).json({errors:errors.array()})
	}
	const {email,password} = req.body
	const user = await User.findOne({email})
	if(!user) return res.status(400).json({error:'Invalid credentials'})

	const isMatch = await user.comparePassword(password)
	if(!isMatch) return res.status(400).json({error:'Invalid credentials'})
	
	const accessToken = generateAccessToken({id:user._id})
	const refreshToken = generateRefreshToken({id:user._id})
	
	res.cookie("refreshToken",refreshToken,{
		httpOnly : true,
		secure : true,
		sameSite : "Lax",
		maxAge : 7*24*60*60*1000
	})

	res.status(200).json({
		accessToken,
		user
	})
}

const getRefresh = async(req,res)=>{
	  const token = req.cookies.refreshToken;
	  if (!token) return res.status(401).json({error:"No Token"});

	  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
	    if (err) return res.status(403).json({error:"Invalid Token"});

	    const newAccessToken = generateAccessToken({ id: user.id });
	    res.json({ accessToken: newAccessToken });
	  });
}

const logoutUser = async(req,res)=>{
	try{
		res.clearCookie("refreshToken")
		res.status(200).send("Logout Successfull!")
	}catch(err){
		console.error(err)
		res.status(500).json({error:"Logout Error"})
	}
}

const getEvents = async(req,res)=>{
	try{
	const events = await Event.find({}).lean();

	if (req.user.role === "admin" || req.user.role === "organizer") {
	  const populatedEvents = await Promise.all(
	    events.map(async (event) => {
	      const participants = await RegInEvent.find({ event_id: event._id })
		.populate("student_id", "_id name email")
		.lean();

	      return {
		...event,
		participants: participants.map((p) => p.student_id),
	      };
	    })
	  );

	  return res.status(200).send(populatedEvents);
	}
	return res.status(200).send(events)
	}catch(err){
		console.error(err)
		res.status(400).json({error:err})
	}	
}

const getRegisteredEvents = async(req,res)=>{
	try{
		const events = await RegInEvent.find({student_id:req.user._id}).populate('event_id')
		if(events.length===0) return res.status(404).json({error:"No registered Events"})
		
		res.status(200).send(events)
	}catch(err){
		console.error(err)
		res.status(500).json({error:"Internal server error"})
	}
}

const getEventById = async (req, res, next) => {
  try {
    const event_id = req.params.id;
    let event = await Event.findOne({ _id: event_id }).lean();

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const ifRegistered = await RegInEvent.exists({
      event_id: event._id,
      student_id: req.user._id,
    });

    event.isRegistered = ifRegistered;

    if (req.user.role === "admin" || req.user.role === "organizer") {
      const participants = await RegInEvent.find({ event_id: event._id })
        .populate("student_id", "name email") // adjust fields as needed
        .lean();

      event.participants = participants;
    }

    res.status(200).send(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};


const getProfile = async(req,res)=>{
	res.status(200).send("Profile Sent")
}

const updateProfile = async(req,res)=>{
	try{
		const user_id = req.user._id
		const update = req.body
		
		const user = await User.findById(user_id)
		
		if(!user) return res.status(404).json({error:"User not found"})

		Object.keys(updates).forEach((key)=>{
			if(updates[key]!==undefined) user[key] = updates[key] 
		})

		await user.save()
		
		res.status(200).send("User updated")

	}catch(err){
		console.error(err)
		res.status(500).json({error:"Internal server error"})
	}
}

export default {registerUser,loginUser,logoutUser,getProfile,getEvents,getEventById,getRefresh,updateProfile}
