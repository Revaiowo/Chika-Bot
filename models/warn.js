import mongoose from "mongoose";

const warnSchema = new mongoose.Schema({

    userId: {
        type: Number,
        required: true,
    },

    userName: {
        type: String,
        required: true
    },

    warn: {
        type: [
            {
                reason: { type: String, required: true },
                modName: { type: String, required: true },
                timestamp: { type: Date, required: true, default: Date.now }
            }
        ],
        required: true
    },

}); 

export const Warn =  mongoose.model('warns', warnSchema);
