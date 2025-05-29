import express from "express"
import dbConnect from "../db/db.js"
import "dotenv/config"
import cookieParser from "cookie-parser"

import userRoutes from "./user.router.js"
import studentRoutes from "./student.router.js"
import organizerRoutes from "./organizer.router.js"
import adminRoutes from "./admin.router.js"

import swaggerDocs from "../swagger.js"
const app = express()
app.use(express.json())

app.use(cookieParser())
app.use('/user',userRoutes)
app.use('/student',studentRoutes)
app.use('/organizer',organizerRoutes)
app.use('/admin',adminRoutes)

const PORT = process.env.PORT

await dbConnect()
/**
 * @swagger
 * /refresh:
 *   post:
 *     tags:
 *       - Root Auth
 *     summary: Refresh access token using refresh token
 *     description: Generate a new access token using a valid refresh token stored in cookies
 *     parameters:
 *       - name: refreshToken
 *         in: cookie
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token stored in HTTP-only cookie
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New JWT access token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDVlY2I1NGIyNGEwM2Q4YzhiNDU2NyIsImlhdCI6MTYyNDYyMzQ4NSwiZXhwIjoxNjI0NjI3MDg1fQ.xyz"
 *       401:
 *         description: No refresh token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No Token"
 *       403:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid Token"
 */
app.post('/refresh',(req,res)=>{
	  const token = req.cookies.refreshToken;
	  if (!token) return res.status(401).json({error:"No Token"});

	  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
	    if (err) return res.status(403).json({error:"Invalid Token"});

	    const newAccessToken = generateAccessToken({ id: user.id });
	    res.json({ accessToken: newAccessToken });
	  });
})

app.listen(PORT,()=>{
	console.log(`App listening at ${3000}`)
})

swaggerDocs(app,PORT)

export default app
