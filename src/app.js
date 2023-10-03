const express = require("express");
const mongoose = require("mongoose");
const Customer = require("./models/customer");

const app = express();
mongoose.set("strictQuery", false);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const PORT = process.env.PORT || 3000;
const connection = process.env.URI;

const customers = [
  { name: "Ishan", industry: "IT" },
  { name: "Krishan", industry: "BK" },
  { name: "Yakusha", industry: "KT" },
];

const customer = new Customer({
  name: "John",
  industry: "IT",
});

app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.get("/customers", async (req, res) => {
  try {
    const result = await Customer.find();
    res.json({ customers: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/customers", async (req, res) => {
  console.log(req.body);
  const customer = new Customer(req.body);
  try {
    await customer.save();
    res.status(201).json({ customer });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post("/", (req, res) => {
  res.send("Post request");
});

const start = async () => {
  try {
    await mongoose.connect(connection);
    app.listen(PORT, () => {
      console.log("App listening in port: " + PORT);
    });
  } catch (err) {
    console.log(err.message);
  }
};

start();
