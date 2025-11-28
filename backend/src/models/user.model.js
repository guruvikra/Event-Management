import { Schema, model } from "mongoose";


const userSchema = new Schema({

    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },

})

export const User = model("User", userSchema)