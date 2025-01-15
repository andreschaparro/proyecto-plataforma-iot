import { Schema, model } from "mongoose"

const dataSchema = Schema({
    day: String,
    device: String,
    nSamples: {
        type: Number,
        default: 0
    },
    first: Number,
    last: Number,
    telemetry: [{
        ts: Number,
        values: Schema.Types.Mixed
    }]
})

export const Data = model("Data", dataSchema, "iotDatos")