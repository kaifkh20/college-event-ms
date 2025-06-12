import express from "express"
import dbConnect from "../db/db.js"
import "dotenv/config"
import cookieParser from "cookie-parser"
import cors from "cors"

import path from "path";
import fs from "fs";
import multer from "multer"
import userRoutes from "./user.router.js"
import studentRoutes from "./student.router.js"
import organizerRoutes from "./organizer.router.js"
import adminRoutes from "./admin.router.js"

import authenticateToken from "../auth/middleware.js"

import swaggerDocs from "../swagger.js"
const app = express()

app.use((req, res, next) => {
  if (req.is('application/json')) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: '7mb' }));
app.use("/uploads", express.static("uploads"));
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

const UPLOAD_DIR = "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); // Store in 'uploads/' folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

app.post("/upload/image", authenticateToken, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

app.listen(PORT,()=>{
	console.log(`App listening at ${3000}`)
})

swaggerDocs(app,PORT)

export default app
