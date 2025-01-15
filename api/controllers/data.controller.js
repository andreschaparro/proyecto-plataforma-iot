import { Data } from "../models/data.model.js"
import { DATA_N_SAMPLES } from "../config/database.config.js"

// Devuelve todos los datos de un dispositivo
export const getAllDeviceData = async (req, res) => {
    try {
        const { device } = req.params

        const result = await Data.find({ device })

        if (result.length === 0) {
            return res.status(204).json()
        }

        res.json(result)
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Devuelve los datos de un día de un dispositivo
export const getOneDayDeviceData = async (req, res) => {
    try {
        const { device, day } = req.params

        // Verifica day utilizando REGEX
        const dayPattern = /^\d{4}-\d{2}-\d{2}$/

        if (!dayPattern.test(day)) {
            return res.status(400).json({ message: "El day es inválido" })
        }

        const result = await Data.find({ device, day })

        if (result.length === 0) {
            return res.status(204).json()
        }

        res.json(result)
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Devuelve los datos entre dos fechas de un dispositivo
export const getFromToDeviceData = async (req, res) => {
    try {
        const { device, from, to } = req.params

        // Verifica from y to utilizando REGEX
        const dayPattern = /^\d{4}-\d{2}-\d{2}$/

        if (!dayPattern.test(from)) {
            return res.status(400).json({ message: "El from es inválido" })
        }

        if (!dayPattern.test(to)) {
            return res.status(400).json({ message: "El to es inválido" })
        }

        const firstDay = new Date(from)
        firstDay.setUTCHours(0, 0, 0, 0)
        const lastDay = new Date(to)
        lastDay.setUTCHours(23, 59, 59, 999)

        if (firstDay > lastDay) {
            return res.status(400).json({ message: "from es posterior a to" })
        }

        const result = await Data.find(
            {
                device,
                day: { $gte: firstDay, $lte: lastDay }
            }
        )

        if (result.length === 0) {
            return res.status(204).json()
        }

        res.json(result)
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Guarda una telemetría de un device dentro dentro de un documento diario
export const updateTodayDeviceData = async (req, res) => {
    try {
        const { device, ts, values } = req.body

        if (!device || !ts || !values) {
            return res.status(400).json({ message: "Los campos device, ts, y values son obligatorios" })
        }

        if (device.trim() === "") {
            return res.status(400).json({ message: "El device no puede estar vacío" })
        }

        // https://espanol.epochconverter.com/
        if (!Number.isInteger(ts) || ts < 0) {
            return res.status(400).json({ message: "El ts debe ser un número epoch" })
        }

        if (typeof values !== "object") {
            return res.status(400).json({ message: "values debe ser un objeto" })
        }

        const day = new Date(ts * 1000)
        day.setUTCHours(0, 0, 0, 0)

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