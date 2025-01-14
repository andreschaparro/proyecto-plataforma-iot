import { login, register, profile} from "../controllers/user.controller.js"
import { verifyJwtFromHeader } from "../middlewares/user.middleware.js"
import { Router } from "express"

export const userRouter = Router()

// Ruta para hacer un login
userRouter.post("/login", login)

// Ruta para que un usuario administrador autenticado registre nuevos usuarios
userRouter.post("/register", verifyJwtFromHeader, ensureAdminRole, register)