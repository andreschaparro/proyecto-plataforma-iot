const {
    MONGO_USERNAME = "iotuser",
    MONGO_PASSWORD = "iot123",
    MONGO_DATABASE = "iot"
} = process.env

export const MONGO_URL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@172.16.36.141:27017/${MONGO_DATABASE}`

// Cantidad máxima de telemetrías que se guardan por device durante un día
export const MAX_SAMPLES = 24 * 60 * 60