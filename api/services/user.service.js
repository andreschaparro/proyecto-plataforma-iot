import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import { JWT_SECRET } from "../config/jwt.config.js"
import { SALT_ROUNDS } from "../config/bcrypt.config.js"
import { EMAIL_USER, EMAIL_PASS } from "../config/nodemailer.config.js"

// Compara una contraseña en texto plano contra una cifrada
export const comparePasswords = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword)
}

// Genera un JWT utilizando el _id de Mongo como payload
export const generateToken = (_id, expiresIn) => {
    // https://jwt.io/
    return jwt.sign({ _id }, JWT_SECRET, { expiresIn })
}

// Cifra una contraseña
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS)
}

// Envía un email en formato HTML
export const sendMail = async (to, subject, html) => {
    try {
        // Configuración del servidor de email
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        })

        // Contenido del email
        const mailOptions = {
            from: "iot",
            to,
            subject,
            html
        }

        // Envía el email
        await transporter.sendMail(mailOptions)
    } catch (error) {
        // Este mensaje va a salir por el catch con status 500
        throw new Error(`Error al enviar un email a ${to}: ${error.message}`)
    }
}