import { Schema, model } from "mongoose"

const deviceSchema = Schema({
    name: {
        type: String,
        unique: true
    },
    type: String,
    group: String,
    connectivity: Boolean
})

export const Device = model("Device", deviceSchema, "iotDispositivos")