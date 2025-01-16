import { Router } from "express"
import {
    getLastDeviceData,
    getDeviceData,
    updateDeviceData
} from "../controllers/data.controller.js"
import { verifyJwt } from "../middlewares/user.middleware.js"

export const dataRouter = Router()

// Ruta para que un usuario autenticado obtenga los últimos datos de un dispositivo
dataRouter.get("/devices/:device/data/last", verifyJwt, getLastDeviceData)

// Ruta para que un usuario autenticado obtenga datos de un dispositivo utilizando query params
dataRouter.get("/devices/:device/data", verifyJwt, getDeviceData)

// Ruta para actualizar los datos de un dispositivo
dataRouter.put("/devices/:device/data", updateDeviceData)