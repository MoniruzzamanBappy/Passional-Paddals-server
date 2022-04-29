const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId  } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@bappy-practice-db.nb2hg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productsCollection = client
      .db("Passional_Pedals")
      .collection("products");
    const aboutsCollection = client
      .db("Passional_Pedals")
      .collection("abouts");

    // add products
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });
    //   get all products
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    // delete one product
    app.delete('/products/:_id', async (req, res)=>{
      const _id = req.params._id;
      const query = {_id: ObjectId(_id)}
      const result = await productsCollection.deleteOne(query);
      res.send(result);
  });
    // get one product
    app.get('/products/:_id' , async (req, res)=>{
      const _id = req.params._id;
      const query = {_id: ObjectId(_id)}
      const product = await productsCollection.findOne(query);
      res.send(product);
  });
    // get about padals
    app.get("/abouts", async (req, res) => {
      const query = {};
      const cursor = aboutsCollection.find(query);
      const abouts = await cursor.toArray();
      res.send(abouts);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Server");
});

app.listen(port, () => {
  console.log("listening to port: ", port);
});
