import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
// import dotenv from "dotenv"
// import dayjs from "dayjs"

const app = express()
app.use(cors())
app.use(express.json())

const PORT = 5000

// dotenv.config()
const mongoClient = new MongoClient("mongodb://localhost:27017")
let db
const promise = mongoClient.connect()
promise.then(() => (db = mongoClient.db("bate_papo_uol"),
console.log("Conectado ao MongoDB")))
promise.catch(e => console.log("deu ruim na conexão", e))


app.post("/participants", async (req, res) => {
	const { name } = req.body;
	try {
		const participant = await db.collection("participants")
		.findOne({ name })
		if (participant) return res.sendStatus(409) // o ususario ja exist

		await db.collection("participants")
		.insertOne({ name: name })
		
		let users = await db.collection("participants").find().toArray()
		console.log(users)

		res.status(201).send({ name })
	} catch (error) {
		console.log(error)
		res.sendStatus(500)
	}
})

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`)
})