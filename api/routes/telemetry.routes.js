import { Router } from "express"
import { updateTodayDeviceTelemetries } from "../controllers/telemetry.controller.js"

export const telemetryRouter = Router()

// Ruta para guardar una telemetría
telemetryRouter.put("/", updateTodayDeviceTelemetries)