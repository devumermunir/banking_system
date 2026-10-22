const mongoose = require('mongoose')



const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Account is required"],
        index: true,
        immutable: true,
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: [true, "Transaction is required"],
        index: true,
        immutable: true,
    },
    type: {
        type: String,
        enum: {
            values: ["credit", "debit"],
            message: "Invalid type"
        },
        required: [true, "Type is required"]
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0.01, "Amount must be greater than 0"]
    },
    status: {
        type: String,
        enum: {
            values: ["active", "inactive", "frozen"],
            message: "Invalid status"
        },
        default: "active",
        required: true
    },
    balance: {
        type: Number,
        required: [true, "Balance is required"]
    }
}, { timestamps: true })



function invalidUpdateLedger() {
    throw new Error("You cannot update ledger")
}

ledgerSchema.pre("findOneAndUpdate", invalidUpdateLedger)
ledgerSchema.pre("findOneAndDelete", invalidUpdateLedger)
ledgerSchema.pre("findOneAndReplace", invalidUpdateLedger)
ledgerSchema.pre("findOneAndUpdate", invalidUpdateLedger)
ledgerSchema.pre("updateOne", invalidUpdateLedger)
ledgerSchema.pre("update", invalidUpdateLedger)
ledgerSchema.pre("delete", invalidUpdateLedger)
ledgerSchema.pre("deleteOne", invalidUpdateLedger)
ledgerSchema.pre("updateMany", invalidUpdateLedger)
ledgerSchema.pre("deleteMany", invalidUpdateLedger)

const ledgerModel = mongoose.model("Ledger", ledgerSchema);
module.exports = ledgerModel