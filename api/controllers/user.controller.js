import { User } from "../models/user.model.js"
import { comparePasswords, generateToken, hashPassword } from "../services/user.service.js"

// Procesa una solicitud de login y devuelve un token JWT que expira en una hora en caso de éxito
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Los campos email y password son obligatorios" })
        }

        // Verifica el email utilizando REGEX
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(email)) {
            return res.status(400).json({ message: "El email es inválido" })
        }

        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            return res.status(401).json({ message: "El email o la contraseña son incorrectos" })
        }

        const match = await comparePasswords(password, existingUser.password)

        if (!match) {
            return res.status(401).json({ message: "El email o la contraseña son incorrectos" })
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
            return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" })
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