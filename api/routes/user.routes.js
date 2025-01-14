import { Router } from "express"
import { login, register, profile, changePassword, forgotPassword, resetPassword } from "../controllers/user.controller.js"
import { verifyJwtFromHeader, ensureAdminRole, verifyJwtFromBody } from "../middlewares/user.middleware.js"

export const userRouter = Router()

// Ruta para hacer un login
userRouter.post("/login", login)

// Ruta para que un usuario administrador autenticado registre nuevos usuarios
userRouter.post("/register", verifyJwtFromHeader, ensureAdminRole, register)

// Ruta para que un usuario autenticado obtenga sus datos
userRouter.get("/profile", verifyJwtFromHeader, profile)

// Ruta para que un usuario autenticado pueda cambiar su contraseña
userRouter.post("/change-password", verifyJwtFromHeader, changePassword)

// Ruta para enviar un correo electrónico para restablecer la contraseña
userRouter.post("/forgot-password", forgotPassword)

// Ruta para reestablecer la contraseña de un usuario utilizando un token JWT
userRouter.post("/reset-password", verifyJwtFromBody, resetPassword)