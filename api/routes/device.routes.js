import { Router } from "express"
import {
    getDevices,
    getDevice,
    createDevice,
    updateDeviceConnectivity,
    updateDeviceGroup
} from "../controllers/device.controller.js"
import { verifyJwt, ensureAdminRole } from "../middlewares/user.middleware.js"

export const deviceRouter = Router()

// Ruta para que un usuario obtenga todos los dispositivos 
deviceRouter.get("/devices", verifyJwt, getDevices)

// Ruta para que un usuario autenticado obtenga un dispositivo
deviceRouter.get("/devices/:name", verifyJwt, getDevice)

// Ruta para que un usuario administrador autenticado cree nuevos dispositivos
deviceRouter.post("/devices", verifyJwt, ensureAdminRole, createDevice)

// Ruta para actualizar el estado de la conectividad de un dispositivo
deviceRouter.put("/devices/:name/connectivity", updateDeviceConnectivity)

// Ruta para actualizar el grupo al que pertenece un dispositivo
deviceRouter.put("/devices/:name/group", updateDeviceGroup)