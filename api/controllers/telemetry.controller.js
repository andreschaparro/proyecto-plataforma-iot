import { Data } from "../models/data.model.js"
import { DATA_N_SAMPLES } from "../config/database.config.js"

// Guarda una telemetría de un dispositivo dentro de su documento diario
export const saveTelemetry = async (req, res) => {
    try {
        const { device, ts, values } = req.body

        if (!device || !ts || !values) {
            return res.status(400).json({ message: "Los campos device, ts, y values son obligatorios" })
        }

        if (typeof device !== "string" || device.trim() === "") {
            return res.status(400).json({ message: "El campo device debe ser un string válido" })
        }

        // https://espanol.epochconverter.com/
        if (typeof ts !== "number" || ts < 0 || isNaN(ts)) {
            return res.status(400).json({ message: "El campo ts debe ser un número epoch válido" })
        }

        if (typeof values !== "object" || values === null) {
            return res.status(400).json({ message: "El campo ts debe ser un objeto válido" })
        }

        const tsMilliseconds = ts * 1000

        const day = new Date(tsMilliseconds)
        day.setHours(0, 0, 0, 0)

        const existingData = await Data.findOne({
            day,
            device: device.trim(),
        })

        if (existingData && existingData.nSamples >= DATA_N_SAMPLES) {
            return res.status(400).json({ message: "Se superó la cantidad de telemetrías del dispositivo que se pueden guardar hoy" })
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
                        ts: tsMilliseconds,
                        values
                    }
                },
                $min: { first: tsMilliseconds },
                $max: { last: tsMilliseconds },
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