import jwt from "jsonwebtoken"

const authenticateToken = async(req,res,next)=>{


            try {
              const authHeader = req.headers["authorization"]
              const token = authHeader && authHeader.split(" ")[1] //Bearer TOKEN
              if(!token) throw Error("Unauthorized Access")
              const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
              req.user = decoded; // make user available downstream
              next();
            } catch (err) {
              return res.status(403).json({ message: "Invalid or expired token" });
            }
}


export default authenticateToken
