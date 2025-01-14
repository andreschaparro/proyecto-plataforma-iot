import { Schema, model } from "mongoose"

const userSchema = Schema({
    name: String,
    email: String,
    password: String,
    rol: String
})

export const User = model("User", userSchema, "iotUsuarios")