export const {
    MONGO_USERNAME = "iotuser",
    MONGO_PASSWORD = "iot123",
    MONGO_DATABASE = "iot"
} = process.env

export const mongoUrl = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@172.16.36.141:27017/${MONGO_DATABASE}`