import { Schema, model } from "mongoose"

const dataSchema = Schema({
    day: Date,
    device: String,
    nSamples: Number,
    first: Number,
    last: Number,
    telemetry: [{
        ts: Number,
        values: Schema.Types.Mixed
    }]
})

export const Data = model("Data", dataSchema, "iotDatos")