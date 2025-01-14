import { JWT_SECRET } from "../config/jwt.config.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const SALT_ROUNDS = 10

// Compara una contraseña en texto plano contra una cifrada
export const comparePasswords = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword)
}

// Genera un token JWT para un usuario que expira en un determinado tiempo
export const generateToken = (_id, expiresIn) => {
    // https://jwt.io/
    return jwt.sign({ _id }, JWT_SECRET, { expiresIn })
}

// Cifra una contraseña
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS)
}