import mongoose from "mongoose";


const economySchema = mongoose.Schema({

    userId: {
        type: String,
        required: true
    },

    userName: {
        type: String,
        required: true,
    },

    wallet: {
        type: Number,
        required: true
    },

    bank: {
        type: Number,
        required: true
    }
},
    { timestamps: true }
);


export const Economy = mongoose.model('economy', economySchema);