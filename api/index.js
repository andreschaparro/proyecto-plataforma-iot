import express from "express"
import { connectToMongo } from "./services/database.service.js"
import { MONGO_URL } from "./config/database.config.js"
import { userRouter } from "./routes/user.routes.js"
import { dataRouter } from "./routes/data.routes.js"
import { deviceRouter } from "./routes/device.routes.js"

// Crea la aplicación con express
const app = express()
const { PORT = 3000 } = process.env

// Se conecta a la base de datos Mongo
await connectToMongo(MONGO_URL)

// Middleware para parsear los body que llegan en formato json
app.use(express.json())

// Rutas
app.use("/api/v1/", userRouter)
app.use("/api/v1/", dataRouter)
app.use("/api/v1/", deviceRouter)

app.use("/", (req, res) => {
    res.status(404).json({ message: "La API está funcionando" })
})

// Escucha requests
app.listen(PORT, () => {
    console.log(`La API está funcionando en el port ${PORT}`)
})