import express from "express"
import { MQTT_URL, TOPICS } from "./config/mqtt.config.js"
import { connectToMQTT } from "./services/mqtt.service.js"

// Crea la aplicación con express
const app = express()
const { PORT = 3001 } = process.env

// Middleware para parsear los body que llegan en formato json
app.use(express.json())

// Se conecta a Mosquitto y se subscribe a los topics
connectToMQTT(MQTT_URL, TOPICS)

// Rutas
app.use("/", (req, res) => {
    res.status(404).json({ message: "El core está funcionando" })
})

// Escucha requests
app.listen(PORT, () => {
    console.log(`El core está funcionando en el port ${PORT}`)
})