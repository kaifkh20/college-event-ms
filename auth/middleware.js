import jwt from "jsonwebtoken"

const authenticateToken = async(req,next,res)=>{
            const authHeader = req.headers["authorization"]
            const token = authHeader && authHeader.split(" ")[1] //Bearer TOKEN
            if(!token) res.sendStatus(401)


            try {
              const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
              req.user = decoded; // make user available downstream
              next();
            } catch (err) {
              return res.status(403).json({ message: "Invalid or expired token" });
            }
}


export default authenticateToken
