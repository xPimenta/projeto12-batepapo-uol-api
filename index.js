import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
// import dotenv from "dotenv"
import dayjs from "dayjs";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// dotenv.config()
const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;
const promise = mongoClient.connect();
promise.then(
  () => (
    (db = mongoClient.db("bate_papo_uol")), console.log("Conectado ao MongoDB")
  )
);
promise.catch((e) => console.log("deu ruim na conexão", e));

let time;
const getTime = () => (time = dayjs().format("HH:mm:ss"));

app.post("/participants", async (req, res) => {
  const { name } = req.body;
  try {
    const participant = await db.collection("participants").findOne({ name });
    if (participant) return res.sendStatus(409); // o ususario ja exist

    await db
      .collection("participants")
      .insertOne({ name: name, lastStatus: Date.now() });

    res.status(201).send({ name });

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/participants", async (req, res) => {
  try {
    const participants = await db.collection("participants").find({}).toArray();
    res.status(200).send(participants);

  } catch (error) {
    console.log(error);
    res.sendStatus(500); // erro interno
  }
});

app.post("/messages", async (req, res) => {
  // const validation = validate("POST-/messages", req)
  // if (validation) return res.status(422).send(validation.map(e => e.message))
  const { to, text, type } = req.body;
  time = getTime();
  const { user } = req.headers;
  try {
    await db
      .collection("messages")
      .insertOne({ from: user, to, text, type, time });
    res.sendStatus(201);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// app.get("/messages", async (req, res) => {
//   const limit = parseInt(req.query.limit);
//   const { user } = req.headers;
//   const options = {
//     limit,
//     ...(limit && { sort: { $natural: -1 } }),
//   };
//   try {
//     const messages = await db
//       .collection("messages")
//       .find({ $or: [{ to: "Todos" }, { to: user }] }, options)
//       .toArray();
//     res.status(200).send(messages.reverse());

//   } catch (error) {
//     console.log(error);
//     res.send(500, error);
//   }
// });

// app.post("/status", async (req, res) => {
//   // const validation = validate("POST-/status", req)
//   // if (validation) return res.status(422).send(validation.map(e => e.message))
//   const { user } = req.headers;
//   const lastStatus = Date.now();
//   try {
//     const isConnected = await db
//       .collection("participants")
//       .findOneAndUpdate({ name: user }, { $set: { lastStatus } });
//     isConnected.value ? res.sendStatus(200) : res.sendStatus(404);

//   } catch (error) {
//     console.log(error);
//     res.send(500, error);
//   }
// });

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
