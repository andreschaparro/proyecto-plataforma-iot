import { Router } from "express"
import {
    getUserProfile,
    authenticateUser,
    createUser,
    sendPasswordResetEmail,
    changePassword,
    resetPassword
} from "../controllers/user.controller.js"
import {
    verifyJwt,
    ensureAdminRole,
} from "../middlewares/user.middleware.js"

export const userRouter = Router()

// Ruta para que un usuario autenticado obtenga sus datos
userRouter.get("/users/me", verifyJwt, getUserProfile)

// Ruta para que un usuario se autentifique
userRouter.post("/auth/login", authenticateUser)

// Ruta para que un usuario administrador autenticado registre nuevos usuarios
userRouter.post("/users", verifyJwt, ensureAdminRole, createUser)

// Ruta para enviar un correo electrónico para restablecer la contraseña
userRouter.post("/auth/forgot-password", sendPasswordResetEmail)

// Ruta para que un usuario autenticado pueda cambiar su contraseña
userRouter.put("/auth/change-password", verifyJwt, changePassword)

// Ruta para restablecer la contraseña de un usuario utilizando un token JWT
userRouter.put("/auth/reset-password", verifyJwt, resetPassword)