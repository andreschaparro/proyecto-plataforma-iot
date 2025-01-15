import { Router } from "express"
import { getAllDevices, getOneDevice, createDevice, updateDeviceConnectivity } from "../controllers/device.controller.js"
import { verifyJwtFromHeader, ensureAdminRole } from "../middlewares/user.middleware.js"

export const deviceRouter = Router()

// Ruta para que un usuario obtenga todos los dispositivos 
deviceRouter.get("/", verifyJwtFromHeader, getAllDevices)

// Ruta para que un usuario autenticado obtenga un dispositivo
deviceRouter.get("/:name", verifyJwtFromHeader, getOneDevice)

// Ruta que un usuario administrador autenticado registre nuevos dispositivos
deviceRouter.post("/register", verifyJwtFromHeader, ensureAdminRole, createDevice)

// Ruta para actualizar el estado de la conexión de un dispositivo
deviceRouter.put("/connectivity", updateDeviceConnectivity)