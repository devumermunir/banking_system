const userModel = require("../models/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


/**
 * @description User Register Controller
 * @route POST /api/auth/register
 * @access Public

 */

async function userRegister(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const userExist = await userModel.findOne({ $or: [{ email }, { username }] });

        if (userExist) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            username,
            email,
            password: hashPassword
        })

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            },
            token
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @description User Login Controller
 * @route POST /api/auth/login
 * @access Public

 */
async function userLogin(req, res) {
    try {
        const { username, email, password } = req.body;
        const identifier = email || username;

        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: "Password and email or username are required" })
        }

        const user = await userModel.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        }).select("+password");

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid password" })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000
        })
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            },
            token
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = { userRegister, userLogin };