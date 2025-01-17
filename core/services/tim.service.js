export const timProcess = (topic, message) => {
    try {
        // Se convierte message a string porque se recibe como un buffer de Node que es similar a un array de bytes
        const messageString = message.toString()

        // Se convierte el message a un objeto
        const { device, ts, values } = JSON.parse(messageString)

        // Verifica que existan los campos del message
        if (!device || !ts || !values) {
            throw new Error("Los campos device, ts y values son obligatorios en los mensajes")
        }

        // Verifica que device sea un string no vacío
        if (typeof device !== "string" || device.trim() === "") {
            throw new Error("El campo device debe ser es un string no vacío")
        }

        // Verifica el campo ts
        if (!Number.isInteger(ts) || ts < 0) {
            throw new Error("El campo ts debe ser un número epoch")
        }

        // Verifica que values sea un objeto
        if (typeof values !== "object") {
            throw new Error("El campo values debe ser un objeto")
        }

        console.log(topic)
        console.log(device)
        console.log(ts)
        console.log(values)

    } catch (error) {
        console.error(`Error al parsear el mensaje recibido en el tópico ${topic}: ${error.message}`)
    }
}