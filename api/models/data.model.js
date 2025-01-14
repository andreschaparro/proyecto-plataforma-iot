import { Schema, model } from "mongoose"

const dataSchema = Schema({
    day: Date,
    device: String,
    nSamples: {
        type: Number,
        default: 0
    },
    first: Date,
    last: Date,
    telemetry: [{
        ts: Date,
        values: Schema.Types.Mixed
    }]
})

export const Data = model("Data", dataSchema, "iotDatos")