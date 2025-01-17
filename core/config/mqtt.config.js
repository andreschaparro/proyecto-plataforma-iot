const {
    BROKER_URL = 'mqtt://172.16.36.141',
    USERNAME = '',
    PASSWORD = '',
    RECONNECT_PERIOD = 2000,
    COMMAND_TOPIC = 'devices/me/command',
    ATTRIBUTE_TOPIC = 'devices/me/attribute',
    TELEMETRY_TOPIC = 'devices/me/telemetry',
    ACTION_TOPIC = 'devices/me/action'
} = process.env;

export const MQTT_CONFIG = {
    BROKER_URL,
    USERNAME,
    PASSWORD,
    RECONNECT_PERIOD,
    COMMAND_TOPIC,
    ATTRIBUTE_TOPIC,
    TELEMETRY_TOPIC,
    ACTION_TOPIC
};