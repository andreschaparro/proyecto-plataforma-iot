import { Device } from "../models/device.model.js"

// Devuelve todos los dispositivos
export const getAllDevices = async (req, res) => {
    try {
        const result = await Device.find()

        if (result.length === 0) {
            return res.status(204).json()
        }

        res.json(result)
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Devuelve un dispositivo
export const getOneDevice = async (req, res) => {
    try {
        const { name } = req.params

        const result = await Device.findOne({ name })

        if (!result) {
            return res.status(204).json()
        }

        res.json(result)
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Registra un nuevo dispositivo
export const createDevice = async (req, res) => {
    try {
        const { name, type } = req.body

        if (!name || !type) {
            return res.status(400).json({ message: "Los campos name y type son obligatorios" })
        }

        if (name.trim() === "") {
            return res.status(400).json({ message: "El name no puede estar vacío" })
        }

        if (type.trim() === "") {
            return res.status(400).json({ message: "El type no puede estar vacío" })
        }

        const existingDevice = await Device.findOne({ name })

        if (existingDevice) {
            return res.status(409).json({ message: "El device ya está registrado" })
        }

        const newDevice = new Device({
            name: name.trim(),
            type: type.trim(),
            group: "",
            connectivity: false
        })

        await newDevice.save()

        res.status(201).json({ message: "El device fue registrado con éxito" })
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Actualiza el estado de la conexión de un dispositivo
export const updateDeviceConnectivity = async (req, res) => {
    try {
        const { name, connectivity } = req.body

        if (!name || connectivity === undefined) {
            return res.status(400).json({ message: "Los campos name y connectivity son obligatorios" })
        }

        if (typeof connectivity !== "boolean") {
            return res.status(400).json({ message: "connectivity es inválido" })
        }

        const updatedDevice = await Device.findOneAndUpdate(
            { name },
            { $set: { connectivity } },
            { new: true, upsert: false }
        )

        if (!updatedDevice) {
            return res.status(404).json({ message: "El device no está registrado" })
        }

        res.status(200).json({ message: "Se actualizó el estado de la conexión del device" })
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}