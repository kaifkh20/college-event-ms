import User from "../models/User.js"
import jwt from "jsonwebtoken"

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
        if (!token) throw Error("Unauthorized Access");

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(400).json({ error: "Invalid user" }); // Should ideally not happen if token is valid and user existed

        req.user = user; // make user available downstream
        next();
    } catch (err) {
        console.error(err); // Log the actual error for debugging

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired" }); // 401 Unauthorized is often more appropriate for expired tokens
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" }); // For malformed, invalid signature, etc.
        } else {
            // Catch other potential errors, including the "Unauthorized Access" error thrown earlier
            // or if User.findById fails unexpectedly
            return res.status(403).json({ message: err.message || "Forbidden: An error occurred" });
        }
    }
};
export default authenticateToken
