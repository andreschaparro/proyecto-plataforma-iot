import { User } from "../models/user.model.js"
import {
    comparePasswords,
    generateToken,
    hashPassword,
    sendMail
} from "../services/user.service.js"

// Devuelve los datos de un usuario
export const getUserProfile = (req, res) => {
    // Recupera el email, password y role del usuario que fueron agregados al request por el middleware verifyJwt
    const { name, email, role } = req.user

    res.json({ name, email, role })
}

// Resuelve una solicitud de login utilizando email y password
export const authenticateUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // Verifica que existan los campos del body
        if (!email || !password) {
            return res.status(400).json({ message: "Los campos email y password son obligatorios" })
        }

        // Verifica email utilizando REGEX
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(email)) {
            return res.status(400).json({ message: "El campo email es inválido" })
        }

        // Verifica que el email se encuentre registrado
        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            return res.status(401).json({ message: "El email o el password son incorrectos" })
        }

        // Verifica el password utilizando REGEX para que tenga al menos 8 caracteres que sean letras y/o números
        const passwordRegex = /^[a-zA-Z0-9]{8,}$/

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "El password debe contener al menos 8 caracteres que sean letras y/o números" })
        }

        // Verifica el password y devuelve un JWT que dura 1 hora en caso de éxito
        const match = await comparePasswords(password, existingUser.password)

        if (!match) {
            return res.status(401).json({ message: "El email o el password son incorrectos" })
        }

        const token = generateToken(existingUser._id, "1h")

        res.json({ token: `Bearer ${token}` })
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Registra un nuevo usuario
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        // Verifica que existan los campos del body
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Los campos name, email, password y role son obligatorios" })
        }

        // Verifica que name sea un string no vacío
        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ message: "El campo device debe ser es un string no vacío" })
        }

        // Verifica el email utilizando REGEX
        const emailPattern = /^[^\s@]+@[^\s@]+\ .[^\s@]+$/

        if (!emailPattern.test(email)) {
            return res.status(400).json({ message: "El email es inválido" })
        }

        // Verifica que el email no se encuentre registrado
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(409).json({ message: "El email ya está registrado" })
        }

        // Verifica el password utilizando REGEX para que tenga al menos 8 caracteres que sean letras y/o números
        const passwordRegex = /^[a-zA-Z0-9]{8,}$/

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "El password debe contener al menos 8 caracteres que sean letras y/o números" })
        }

        // Verifica que el role sea admin o user
        if (role !== "admin" && role !== "user") {
            return res.status(400).json({ message: "El role debe ser 'admin' o 'user'" })
        }

        // Registra al nuevo usuario en la base de datos cifrando el password
        const hashedPassword = await hashPassword(password)

        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            role
        })

        await newUser.save()

        res.status(201).json({ message: "El usuario fue registrado con éxito" })
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Envía por email con un token JWT que expira a los 15 minutos para restablecer el password
export const sendPasswordResetEmail = async (req, res) => {
    try {
        const { email } = req.body

        // Verifica que existan los campos del body
        if (!email) {
            return res.status(400).json({ message: "El campo email es obligatorio" })
        }

        // Verifica el email utilizando REGEX
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(email)) {
            return res.status(400).json({ message: "El email es inválido" })
        }

        // Verifica que el email se encuentre registrado
        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            return res.status(404).json({ message: "El email no está registrado" })
        }

        // Genera un JWT que dura 15 minutos y lo envía por email
        const token = generateToken(existingUser._id, "15m")

        // https://ethereal.email/messages
        const message = `<p>Para restablecer su password utilice el siguiente token:<p><h4>${token}<h4>`

        await sendMail(email, "Restablecer password", message)

        res.json({ message: "Se ha enviado un email para restablecer el password" })
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Cambia el password de un usuario
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body

        // Verifica que existan los campos del body
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Los campos oldPassword y newPassword son obligatorios" })
        }

        // Verifica el oldPassword y el newPassword utilizando REGEX para que tengan al menos 8 caracteres que sean letras y/o números
        const passwordRegex = /^[a-zA-Z0-9]{8,}$/

        if (!passwordRegex.test(oldPassword)) {
            return res.status(400).json({ message: "El oldPassword debe contener al menos 8 caracteres que sean letras y/o números" })
        }

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ message: "El newPassword debe contener al menos 8 caracteres que sean letras y/o números" })
        }

        // Recupera el email y password del usuario que fueron agregados al request por el middleware verifyJwt
        const { email, password } = req.user

        // Verifica el oldPassword sea igual al password actual
        const matchOldPassword = await comparePasswords(oldPassword, password)

        if (!matchOldPassword) {
            return res.status(401).json({ message: "El oldPassword es incorrecto" })
        }

        // Verifica que el newPassword no sea igual al password actual
        const matchNewPassword = await comparePasswords(newPassword, password)

        if (matchNewPassword) {
            return res.status(400).json({ message: "El newPassword no puede ser el mismo que el oldPassword" })
        }

        // Cifra y guarda el newPassword en la base de datos
        const hashedPassword = await hashPassword(newPassword)

        await User.findOneAndUpdate({ email }, { password: hashedPassword })

        res.json({ message: "El password fue modificado" })
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Restablece el password de un usuario
export const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body

        // Verifica que existan los campos del body
        if (!newPassword) {
            return res.status(400).json({ message: "El campo newPassword es obligatorio" })
        }

        // Verifica el newPassword utilizando REGEX para que tenga al menos 8 caracteres que sean letras y/o números
        const passwordRegex = /^[a-zA-Z0-9]{8,}$/

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ message: "El newPassword debe contener al menos 8 caracteres que sean letras y/o números" })
        }

        // Recupera el email y password del usuario que fueron agregados al request por el middleware verifyJwt
        const { email, password } = req.user

        // Verifica que el newPassword no sea igual al password actual
        const matchNewPassword = await comparePasswords(newPassword, password)

        if (matchNewPassword) {
            return res.status(400).json({ message: "El newPassword no puede ser el mismo que el actual" })
        }

        // Cifra y guarda el newPassword en la base de datos
        const hashedPassword = await hashPassword(newPassword)

        await User.findOneAndUpdate({ email }, { password: hashedPassword })

        res.json({ message: "El password fue modificado" })
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}