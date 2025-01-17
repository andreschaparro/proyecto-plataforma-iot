import express from 'express'

const app = express()
const { PORT = 3001 } = process.env

// Middleware para parsear los body que llegan en formato json
app.use(express.json())
