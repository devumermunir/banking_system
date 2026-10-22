const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [30, "Username must be at most 30 characters long"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/, 'Please fill a valid email address']

    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        trim: true,
        select: false
    },
    role: {
        type: String,
        enum: { values: ["admin", "user"], message: "Invalid role" },
        default: "user",
        immutable: true
    }

}, { timestamps: true })

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
