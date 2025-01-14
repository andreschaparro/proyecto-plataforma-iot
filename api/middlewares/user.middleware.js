import { JWT_SECRET } from "../config/jwt.config.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"

// Verifica el token que viene en el header de autenticación
const verifyJwtFromHeader = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(401).json({ message: "No se proporcionó un token de autenticación" })
        }

        const decoded = jwt.verify(token, JWT_SECRET)

        const user = await User.findById(decoded._id)

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        req.user = user

        next()
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token inválido" })
        }

        if ((error.name === "TokenExpiredError")) {
            return res.status(401).json({ message: "Token expirado" })
        }

        return res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Middleware para verificar que el usuario tenga el rol de administrador
export const ensureAdminRole = (req, res, next) => {
    const role = req.user?.rol

    if (role !== "admin") {
        return res.status(403).json({ message: "El usuario no es administrador" })
    }

    next()
}