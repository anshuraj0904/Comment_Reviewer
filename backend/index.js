import express from "express"
import dotenv from "dotenv"
import cors from "cors"

const app = express()
dotenv.config()

app.use(express.json())
app.use(cors())

const PORT=process.env.APP_PORT