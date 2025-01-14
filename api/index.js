import express from "express"
import { connect } from "mongoose"
import { mongoUrl } from "./config/database.config.js"
import { userRouter } from "./routes/user.routes.js"

const app = express()
const { PORT = 3000 } = process.env

// Conexión a la base de datos
const connectToMongo = async (url) => {
    try {
        await connect(url)
        console.log(`La API se conectó con la base de datos`)
    } catch (error) {
        console.error(`Error de conexión de la API con la base de datos: ${error.message}`)
        process.exit(1)
    }
}

await connectToMongo(mongoUrl)

// Middleware para parsear los body que llegan en formato json
app.use(express.json())

// Rutas
app.use("/users", userRouter)

app.use("/", (req, res) => {
    res.status(404).json({ message: "La API está funcionando" })
})

// Escucha requests
app.listen(PORT, () => {
    console.log(`La API está funcionando en el port ${PORT}`)
})