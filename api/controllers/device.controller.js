import { Device } from "../models/device.model.js"

// Devuelve todos los devices
export const getDevices = async (req, res) => {
    try {
        const result = await Device.find()

        if (result.length === 0) {
            return res.status(404).json({ message: "No existen devices" })
        }

        res.json(result)
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Devuelve un device
export const getDevice = async (req, res) => {
    try {
        const { name } = req.params

        // Devuelve el documento de un device
        const result = await Device.findOne({ name })

        if (!result) {
            return res.status(404).json({ message: "El device no existe" })
        }

        res.json(result)
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Registra un nuevo device
export const createDevice = async (req, res) => {
    try {
        const { name, type } = req.body

        // Verifica que existan los campos del body
        if (!name || !type) {
            return res.status(400).json({ message: "Los campos name y type son obligatorios" })
        }

        // Verifica que name y type sean strings no vacíos
        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ message: "El campo name debe ser es un string no vacío" })
        }

        if (typeof type !== "string" || type.trim() === "") {
            return res.status(400).json({ message: "El campo type debe ser es un string no vacío" })
        }

        // Verifica que el device no exista
        const existingDevice = await Device.findOne({ name })

        if (existingDevice) {
            return res.status(409).json({ message: "El device ya existe" })
        }

        // Crea el device en la base de datos
        const newDevice = new Device({
            name: name.trim(),
            type: type.trim(),
            group: "",
            connectivity: false
        })

        await newDevice.save()

        res.status(201).json({ message: "El device fue creado con éxito" })
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Actualiza el estado de la conexión de un device
export const updateDeviceConnectivity = async (req, res) => {
    try {
        const { name } = req.params

        // Verifica que existan los campos del body
        const { connectivity } = req.body

        if (connectivity === undefined) {
            return res.status(400).json({ message: "El campo connectivity es obligatorio" })
        }

        // Verifica que connectivity sea boolean
        if (typeof connectivity !== "boolean") {
            return res.status(400).json({ message: "El campo connectivity debe ser boolean" })
        }

        // Actualiza el valor del campo connectivity del device en la base de datos
        const updatedDevice = await Device.findOneAndUpdate(
            { name },
            { $set: { connectivity } },
            // Evita que se cree un documento si el device no existe
            { new: true, upsert: false }
        )

        if (!updatedDevice) {
            return res.status(404).json({ message: "El device no existe" })
        }

        res.status(200).json({ message: "Se actualizó el estado de la conectividad del device" })
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}
// Actualiza group al que pertenece un device
export const updateDeviceGroup = async (req, res) => {
    try {
        const { name } = req.params

        // Verifica que existan los campos del body
        const { group } = req.body

        if (!group) {
            return res.status(400).json({ message: "El campo group es obligatorio" })
        }

        // Verifica que group sea un string
        if (typeof group !== "string") {
            return res.status(400).json({ message: "El campo group debe ser un string" })
        }

        // Actualiza el valor del campo group del device en la base de datos
        const updatedDevice = await Device.findOneAndUpdate(
            { name },
            { $set: { group } },
            // Evita que se cree un documento si el device no existe
            { new: true, upsert: false }
        )

        if (!updatedDevice) {
            return res.status(404).json({ message: "El device no existe" })
        }

        res.status(200).json({ message: "Se actualizó el group del device" })
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}