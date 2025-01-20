const {
    API_HOSTNAME = "172.16.36.141",
    API_PORT = 3000
} = process.env

export const API_V1_URL = `http://${API_HOSTNAME}:${API_PORT}/api/v1`