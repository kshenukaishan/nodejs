const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Customer = require("./models/customer");

const app = express();
app.use(cors());
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

app.get("/customers/:id", async (req, res) => {
  console.log({ requestParams: req.params, requestQuery: req.query });
  try {
    const { id: customerId } = req.params;
    console.log(customerId);
    const customer = await Customer.findById(customerId);
    console.log(customer);
    if (!customer) {
      res.status(404).json({ error: "Not found!" });
    } else {
      res.json({ customer });
    }
  } catch (err) {
    res.status(500).json({ err: "Something went wrong!" });
  }
});

app.put("/customers/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findOneAndReplace(
      { _id: customerId },
      req.body,
      { new: true }
    );
    console.log(customer);
    res.json({ customer });
  } catch (err) {
    res.status(500).json({ error: "Not found customer" });
  }
});

app.patch("/customers/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findOneAndUpdate(
      { _id: customerId },
      req.body,
      { new: true }
    );
    console.log(customer);
    res.json({ customer });
  } catch (err) {
    res.status(500).json({ error: "Not found customer" });
  }
});

app.patch("/orders/:id", async (req, res) => {
  console.log(req.params);
  const orderId = req.params.id;
  req.body._id = orderId;
  try {
    const result = await Customer.findByIdAndUpdate(
      { "orders._id": orderId },
      { $set: { "orders.$": req.body } },
      { new: true }
    );
    console.log(result);
    if (result) {
      res.send(result);
    } else {
      res.status(404).jssn({ error: "Something went wromg" });
    }
  } catch (e) {
    res.status(500).json({ error: "Soemthing went wrong" });
  }
});

app.delete("/customers/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.deleteOne({ _id: customerId });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: "content not found" });
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
