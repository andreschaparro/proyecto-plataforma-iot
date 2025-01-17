import { connect } from "mongoose"

// Se conecta a una base de datos Mongo
export const connectToMongo = async (url) => {
    try {
        await connect(url)
        console.log(`La API se conectó con la base de datos`)
    } catch (error) {
        console.error(`Error de conexión de la API con la base de datos: ${error.message}`)
        process.exit(1)
    }
}