import express from "express"
import dbConnect from "../db/db.js"
import "dotenv/config"

import userRoutes from "./user.router.js"


const app = express()
app.use(express.json())

app.use('/user',userRoutes)

const PORT = process.env.PORT

await dbConnect()

app.listen(PORT,()=>{
	console.log(`App listening at ${3000}`)
})

export default app
