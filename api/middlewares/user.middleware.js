import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/jwt.config.js"
import { User } from "../models/user.model.js"

// Verifica el JWT que viene el header de autenticación
export const verifyJwt = async (req, res, next) => {
    try {
        // Recupera el JWT del header de autenticación
        const token = req.headers.authorization?.split(" ")[1]

        // Verifica que exista el JWT
        if (!token) {
            return res.status(401).json({ message: "Se necesita un JWT" })
        }

        // Verifica el JWT
        const decoded = jwt.verify(token, JWT_SECRET)

        // Recupera el usuario de la base de datos con el _id de Mongo que vino en el payload del JWT
        const user = await User.findById(decoded._id)

        // Si existe el usuario lo agrega al request y procede al siguiente middleware o controlador
        if (!user) {
            return res.status(404).json({ message: "El usuario no existe" })
        }

        req.user = user

        next()
    } catch (error) {
        // Estos estos errores se producen al verificar el JWT
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token inválido" })
        }

        if ((error.name === "TokenExpiredError")) {
            return res.status(401).json({ message: "Token expirado" })
        }

        return res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}

// Verifica que el usuario tenga el role de admin
export const ensureAdminRole = (req, res, next) => {
    // Recupera el role del usuario que fue agregado al request por el middleware verifyJwtFromHeader
    const { role } = req.user

    // Si el role es admin procede al siguiente middleware o controlador
    if (role !== "admin") {
        return res.status(403).json({ message: "El role del usuario no es admin" })
    }

    next()
}