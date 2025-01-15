import { User } from "../models/user.model.js"
import { comparePasswords, generateToken, hashPassword, sendMail } from "../services/user.service.js"

// Procesa una solicitud de login y devuelve un token JWT que expira en una hora en caso de éxito
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Los campos email y password son obligatorios" })
        }

        // Verifica email utilizando REGEX
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(email)) {
            return res.status(400).json({ message: "El email es inválido" })
        }

        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            return res.status(401).json({ message: "El email o el password son incorrectos" })
        }

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
export const register = async (req, res) => {
    try {
        const { name, email, password, rol } = req.body

        if (!name || !email || !password || !rol) {
            return res.status(400).json({ message: "Los campos name, email, password y rol son obligatorios" })
        }

        // Verifica el email utilizando REGEX
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(email)) {
            return res.status(400).json({ message: "El email es inválido" })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(409).json({ message: "El email ya está registrado" })
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "El password debe tener al menos 8 caracteres" })
        }

        if (rol !== "admin" && rol !== "user") {
            return res.status(400).json({ message: "El rol debe ser admin o user" })
        }

        const hashedPassword = await hashPassword(password)

        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            rol
        })

        await newUser.save()

        res.status(201).json({ message: "El usuario fue registrado con éxito" })
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Devuelve los datos de un usuario autenticado
export const profile = (req, res) => {
    const { name, email, rol } = req.user
    res.json({ name, email, rol })
}

// Cambia el password de un usuario autenticado
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Los campos oldPassword y newPassword son obligatorios" })
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "El newPassword debe tener al menos 8 caracteres" })
        }

        const { email, password } = req.user

        const matchOldPassword = await comparePasswords(oldPassword, password)

        if (!matchOldPassword) {
            return res.status(401).json({ message: "El oldPassword es incorrecto" })
        }

        const matchNewPassword = await comparePasswords(newPassword, password)

        if (matchNewPassword) {
            return res.status(400).json({ message: "El newPassword no puede ser el mismo que el oldPassword" })
        }

        const hashedPassword = await hashPassword(newPassword)

        await User.findOneAndUpdate({ email }, { password: hashedPassword })

        res.json({ message: "El password fue modificado" })
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Envía por email un token JWT que expira en 15 minutos para restablecer el password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ message: "El campo email es obligatorio" })
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(email)) {
            return res.status(400).json({ message: "El email es inválido" })
        }

        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            return res.status(404).json({ message: "El email no está registrado" })
        }

        const token = generateToken(existingUser._id, "15m")

        // https://ethereal.email/messages
        const message = `<p>Para restablecer su password utilice el siguiente token:<p><h4>${token}<h4>`

        await sendMail(email, "Restablecer password", message)

        res.json({ message: "Se ha enviado un email para restablecer el password" })
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Restablece el password de un usuario
export const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body

        if (!newPassword) {
            return res.status(400).json({ message: "El campo newPassword es obligatorio" })
        }
    
        if (newPassword.length < 8) {
            return res.status(400).json({ message: "El newPassword debe tener al menos 8 caracteres" })
        }
        const { email, password } = req.user

        const matchNewPassword = await comparePasswords(newPassword, password)

        if (matchNewPassword) {
            return res.status(400).json({ message: "El newPassword no puede ser el mismo que el actual" })
        }

        const hashedPassword = await hashPassword(newPassword)

        await User.findOneAndUpdate({ email }, { password: hashedPassword })

        res.json({ message: "El password fue modificado" })
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}