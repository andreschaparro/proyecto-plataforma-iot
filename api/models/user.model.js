import { Schema, model } from "mongoose"

const userSchema = Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: String
})

export const User = model("User", userSchema, "iotUsuarios")