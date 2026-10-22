const express = require("express");
const accountRouter = express.Router();
const { createAccount } = require("../controllers/account.controller");
const { verifyToken } = require("../middleware/auth.middleware");


accountRouter.post("/create", verifyToken, createAccount);


module.exports = accountRouter;
