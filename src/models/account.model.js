const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model");




const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    status: {
        type: String,
        enum: { values: ["active", "inactive", "frozen"], message: "Invalid status" },
        default: "active"
    },

    currency: {
        type: String,
        enum: { values: ["USD", "PKR"], message: "Invalid currency" },
        default: "USD",
        required: [true, "Currency is required"]
    },
    balance: {
        type: Number,
        default: 0,

    }


}, { timestamps: true })

accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getBalance = async function () {
    const balanceData = await ledgerModel.aggregate([
        { $match: { account: this._id } },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0]
                    }
                }
            }
        }, {
            $project: {
                _id: 0,
                balance: {
                    $subtract: ["$totalCredit", "$totalDebit"]
                }
            }
        }
    ])

    const balance = balanceData.length > 0 ? balanceData[0].balance : 0;

    return balance;
}


const accountModel = mongoose.model("Account", accountSchema);

module.exports = accountModel;