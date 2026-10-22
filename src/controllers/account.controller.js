
const accountModel = require("../models/account.model");


/**
 * @description Create Account Controller
 * @route POST /api/account/create-account
 * @access Private
 */



async function createAccount(req, res) {
    try {
        const user = req.user?._id;
        const { currency } = req.body;

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const accountExists = await accountModel.findOne({ user });
        if (accountExists) {
            return res.status(400).json({ success: false, message: "Account already exists" });
        }

        const accountData = { user };
        if (currency) {
            accountData.currency = currency;
        }

        const account = await accountModel.create(accountData);

        return res.status(201).json({ success: true, message: "Account created successfully", account });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}



module.exports = { createAccount }