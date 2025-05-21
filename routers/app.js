import express from "express"
import dbConnect from "../db/db.js"
import "dotenv/config"
import cookieParser from "cookie-parser"

import userRoutes from "./user.router.js"
import studentRoutes from "./student.router.js"

const app = express()
app.use(express.json())

app.use(cookieParser())
app.use('/user',userRoutes)
app.use('/student',studentRoutes)

const PORT = process.env.PORT

await dbConnect()

app.post('/refresh',(req,res)=>{
	  const token = req.cookies.refreshToken;
	  if (!token) return res.sendStatus(401);

	  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
	    if (err) return res.sendStatus(403);

	    const newAccessToken = generateAccessToken({ id: user.id });
	    res.json({ accessToken: newAccessToken });
	  });
})

app.listen(PORT,()=>{
	console.log(`App listening at ${3000}`)
})

export default app
