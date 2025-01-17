const {
    MQTT_HOSTNAME = "172.16.36.141",
} = process.env

export const MQTT_URL = `mqtt://${MQTT_HOSTNAME}`

export const TOPICS = [
    'devices/telemetry',
    'devices/attribute',
    'devices/command',
    'devices/action'
]