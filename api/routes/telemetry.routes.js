import { Router } from "express"
import { saveTelemetry } from "../controllers/telemetry.controller.js"

export const telemetryRouter = Router()

// Ruta para guardar una telemetría
telemetryRouter.put("/", saveTelemetry)