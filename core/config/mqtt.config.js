const {
    MQTT_HOSTNAME = "172.16.36.141",
} = process.env

export const MQTT_URL = `mqtt://${MQTT_HOSTNAME}`

export const TELEMETRY_TOPIC = "devices/telemetry"

export const TOPICS = [
    TELEMETRY_TOPIC
]