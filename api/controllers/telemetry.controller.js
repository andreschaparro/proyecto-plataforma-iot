import { Data } from "../models/data.model.js"
import { DATA_N_SAMPLES } from "../config/database.config.js"

// Guarda una telemetría de un device dentro dentro de un documento diario
export const updateTodayDeviceTelemetries = async (req, res) => {
    try {
        const { device, ts, values } = req.body

        if (!device || !ts || !values) {
            return res.status(400).json({ message: "Los campos device, ts, y values son obligatorios" })
        }

        if (typeof device !== "string" || device.trim() === "") {
            return res.status(400).json({ message: "El campo device debe ser un string" })
        }

        // https://espanol.epochconverter.com/
        if (typeof ts !== "number" || !Number.isInteger(ts) || ts < 0) {
            return res.status(400).json({ message: "El campo ts debe ser un número epoch" })
        }

        if (typeof values !== "object") {
            return res.status(400).json({ message: "El campo values debe ser un objeto" })
        }

        const today = new Date(ts * 1000)
        today.setHours(0, 0, 0, 0)
        const day = today.toISOString().slice(0, 10)

        const existingData = await Data.findOne({
            day,
            device: device.trim(),
        })

        if (existingData && existingData.nSamples >= DATA_N_SAMPLES) {
            return res.status(400).json({ message: "Se superó la cantidad máxima de telemetrías del device que se pueden guardar durante hoy" })
        }

        await Data.updateOne(
            {
                day,
                device: device.trim(),
                nSamples: { $lt: DATA_N_SAMPLES }
            },
            {
                $push: {
                    telemetry: {
                        ts: ts,
                        values
                    }
                },
                $min: { first: ts },
                $max: { last: ts },
                $inc: { nSamples: 1 }
            },
            {
                upsert: true
            }
        )

        res.json({ message: "Telemetría guardada" })
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}