const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1ikru.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// console.log(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanic");
    const serviceCollection = database.collection("services");

    //get api

    app.get("/services", async (req, res) => {
      const query = serviceCollection.find({});
      const services = await query.toArray();
      res.send(services);
    });

    //get single item
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(filter);
      res.send(service);
    });

    //post api
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("services got hit", service);

      const result = await serviceCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    // delete api
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(filter);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello world mongo");
});

app.listen(port, () => {
  console.log("running genius car mechanic", port);
});
