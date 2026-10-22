const jwt = require("jsonwebtoken");
const userModel = require("../models/auth.model");




const verifyToken = async (req, res, next) => {
    try {
        const headerToken = req.headers.authorization?.split(" ")[1];
        const cookieToken = req.cookies.token;

        const token = headerToken || cookieToken;

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decodedToken.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        req.user = user;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ success: false, message: "Invalid token." });
        }
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = { verifyToken };