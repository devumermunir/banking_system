const express = require("express");
const authRouter = express.Router();
const { userRegister, userLogin } = require("../controllers/auth.controller");




authRouter.post("/register", userRegister);
authRouter.post("/login", userLogin);


module.exports = authRouter;