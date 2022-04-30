import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dayjs from "dayjs"
import dotenv from "dotenv"

const PORT = 5000

dotenv.config()
const mongoClient = new MongoClient(process.env.DATABASE_URL)
let db
mongoClient.connect(() => (db = mongoClient.db("bate_papo_uol")))
let time
const getTime = () => (time = dayjs().format("HH:mm:ss"))

const app = express()
app.use(cors())
app.use(express.json())

//teste
function teste(){
    console.log("teste");
}

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`)
})