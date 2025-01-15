import { Router } from "express"
import { getAllDeviceData, getOneDayDeviceData, getFromToDeviceData, updateTodayDeviceData } from "../controllers/data.controller.js"
import { verifyJwtFromHeader } from "../middlewares/user.middleware.js"

export const dataRouter = Router()

// Ruta para que un usuario autenticado obtenga todos los datos de un dispositivo
dataRouter.get("/:device", verifyJwtFromHeader, getAllDeviceData)

// Ruta para que un usuario autenticado obtenga los datos de un día un dispositivo
dataRouter.get("/:device/:day", verifyJwtFromHeader, getOneDayDeviceData)

// Ruta para que un usuario autenticado obtenga los datos entre dos fechas de un dispositivo
dataRouter.get("/:device/:from/:to", verifyJwtFromHeader, getFromToDeviceData)

// Ruta para guardar una telemetría
dataRouter.put("/", updateTodayDeviceData)