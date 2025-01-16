import { Data } from "../models/data.model.js"
import { DATA_N_SAMPLES } from "../config/database.config.js"

// Devuelve los últimos datos de un dispositivo
export const getLastDeviceData = async (req, res) => {
    try {
        const { device } = req.params

        // Recupera el documento de hoy de un device
        const result = await Data.findOne(
            { device },
            {
                // Del documento solo se queda los campos telemetry y last
                _id: 0,
                telemetry: 1,
                last: 1
            },
        ).sort({ day: -1 })

        // Devuelve el objeto del array telemetry cuyo ts sea igual a last
        if (!result) {
            return res.status(404).json({ message: "El device no existe" })
        }

        const lastData = result.telemetry.find(item => item.ts === result.last)

        res.json(lastData)
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Devuelve datos de un dispositivo utilizando query params
export const getDeviceData = async (req, res) => {
    try {
        const { device } = req.params

        // Crea un filtro por device
        const filter = { device }

        // Modifica el filtro en función de los query params que existen
        const { day, from, to } = req.query

        const dayPattern = /^\d{4}-\d{2}-\d{2}$/

        if (day) {
            // Verifica day utilizando REGEX
            if (!dayPattern.test(day)) {
                return res.status(400).json({ message: "El parámetro day no tiene el formato YYYY-MM-DD" })
            }

            // Convierte day de string a date y la verifica
            const date = new Date(day)
            date.setUTCHours(0, 0, 0, 0)

            if (isNaN(date)) {
                return res.status(400).json({ message: "El parámetro day no es una fecha válida" })
            }

            filter.day = date
        } else if (from && to) {
            // Verifica from y to utilizando REGEX
            if (!dayPattern.test(from)) {
                return res.status(400).json({ message: "El parámetro from no tiene el formato YYYY-MM-DD" })
            }

            if (!dayPattern.test(to)) {
                return res.status(400).json({ message: "El parámetro to no tiene el formato YYYY-MM-DD" })
            }

            // Convierte from y to de string a date y las verifica
            const fromDate = new Date(from)
            fromDate.setUTCHours(0, 0, 0, 0)

            const toDate = new Date(to)
            toDate.setUTCHours(23, 59, 59, 999)

            if (isNaN(fromDate)) {
                return res.status(400).json({ message: "El parámetro from no es una fecha válida" })
            }

            if (isNaN(toDate)) {
                return res.status(400).json({ message: "El parámetro to no es una fecha válida" })
            }

            // Verifica que from no sea posterior a to
            if (fromDate > toDate) {
                return res.status(400).json({ message: "La fecha de from es posterior a la fecha de to" })
            }

            filter.day = { $gte: fromDate, $lte: toDate }
        }

        // Devuelve uno o mas documentos de un device
        const result = await Data.find(filter)

        if (result.length === 0) {
            return res.status(404).json({ message: "El device no existe o no hay datos registrados" })
        }

        res.json(result)
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Actualiza los datos de un dispositivo
export const updateDeviceData = async (req, res) => {
    try {
        const { device } = req.params

        const { ts, values } = req.body

        // Verifica que existan los campos del body
        if (!device || !ts || !values) {
            return res.status(400).json({ message: "Los campos device, ts, y values son obligatorios" })
        }

        // Verifica que device sea un string no vacío
        if (typeof device !== "string" || device.trim() === "") {
            return res.status(400).json({ message: "El campo device debe ser es un string no vacío" })
        }

        // Verifica el campo ts
        // https://www.epochconverter.com/
        if (!Number.isInteger(ts) || ts < 0) {
            return res.status(400).json({ message: "El campo ts debe ser un número epoch" })
        }

        if (typeof values !== "object") {
            return res.status(400).json({ message: "El campo values debe ser un objeto" })
        }

        // Convierte ts de number a date
        const day = new Date(ts * 1000)
        day.setUTCHours(0, 0, 0, 0)

        // Recupera el documento del device correspondiente al día del ts
        const existingData = await Data.findOne({
            day,
            device: device.trim(),
        })

        // Verifica que no se haya alcanzado la cantidad máxima de telemetrías que se pueden guardar durante un día
        if (existingData && existingData.nSamples >= DATA_N_SAMPLES) {
            return res.status(400).json({ message: "Se superó la cantidad máxima de telemetrías que el device puede guardar hoy" })
        }

        // Guarda la telemetría en el documento del device correspondiente al día del ts
        await Data.updateOne(
            {
                day,
                device: device.trim(),
                // Verificación adicional de la cantidad máxima de telemetrías que se pueden guardar durante un día
                nSamples: { $lt: DATA_N_SAMPLES }
            },
            {
                $push: {
                    // Se agrega la telemetria como un objeto al array telemetry
                    telemetry: {
                        ts: ts,
                        values
                    }
                },
                // Actualiza los valores first y last cada vez que se guarda una telemetría
                $min: { first: ts },
                $max: { last: ts },
                // Incrementa en 1 nSamples cada vez que se guarda una telemetría
                $inc: { nSamples: 1 }
            },
            {
                // Si el documento no existe lo crea
                upsert: true
            }
        )

        res.json({ message: "Telemetría guardada" })
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}