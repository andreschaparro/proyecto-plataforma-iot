import mqtt from "mqtt"
import { timProcess } from "./tim.service.js"

// Se conecta a Mosquitto mediante su url y se subscribe a un array de topics 
export const connectToMQTT = (url, topics) => {
    const client = mqtt.connect(url)

    // Se subscribe a los topics luego de conectarse a Mosquitto
    client.on("connect", () => {
        console.log("El core se conectó a Mosquitto")

        topics.forEach(topic => {
            client.subscribe(topic, { qos: 0 }, (err) => {
                if (err) {
                    console.error(`Error al suscribirse al tópico ${topic}: ${err.message}`)
                } else {
                    console.log(`Suscripción exitosa al tópico: ${topic}`)
                }
            })
        })
    })

    // Muestra los errores cliente MQTT
    client.on("error", (err) => {
        console.error(`Se produjo el error en el cliente MQTT del core: ${err.message}`)
    })

    // Muestra si se produjo una desconexión de Mosquitto
    client.on("close", () => {
        console.log("El core se desconectó de Mosquitto")
    })

    // Muestra si se produjo un intento de reconexión a Mosquitto
    client.on("reconnect", () => {
        console.log("El core está intentando reconectarse a Mosquitto")
    })

    // Cuando llega un mensaje lo envía al TIM o Telemetry Input Management
    client.on("message", timProcess)
}