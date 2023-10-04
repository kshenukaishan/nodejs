"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const Customer = require("./models/customer");
const customer_1 = require("./models/customer");
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
const customer = new customer_1.Customer({
    name: "John",
    industry: "IT",
});
app.get("/", (req, res) => {
    res.send("Welcome!");
});
app.get("/customers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield customer_1.Customer.find();
        res.json({ customers: result });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
app.get("/customers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ requestParams: req.params, requestQuery: req.query });
    try {
        const { id: customerId } = req.params;
        console.log(customerId);
        const customer = yield customer_1.Customer.findById(customerId);
        console.log(customer);
        if (!customer) {
            res.status(404).json({ error: "Not found!" });
        }
        else {
            res.json({ customer });
        }
    }
    catch (err) {
        res.status(500).json({ err: "Something went wrong!" });
    }
}));
app.put("/customers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const customer = yield customer_1.Customer.findOneAndReplace({ _id: customerId }, req.body, { new: true });
        console.log(customer);
        res.json({ customer });
    }
    catch (err) {
        res.status(500).json({ error: "Not found customer" });
    }
}));
app.patch("/customers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const customer = yield customer_1.Customer.findOneAndUpdate({ _id: customerId }, req.body, { new: true });
        console.log(customer);
        res.json({ customer });
    }
    catch (err) {
        res.status(500).json({ error: "Not found customer" });
    }
}));
app.patch("/orders/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    const orderId = req.params.id;
    req.body._id = orderId;
    try {
        const result = yield customer_1.Customer.findByIdAndUpdate({ "orders._id": orderId }, { $set: { "orders.$": req.body } }, { new: true });
        console.log(result);
        if (result) {
            res.send(result);
        }
        else {
            res.status(404).jssn({ error: "Something went wromg" });
        }
    }
    catch (e) {
        res.status(500).json({ error: "Soemthing went wrong" });
    }
}));
app.get("/orders/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield customer_1.Customer.findOne({ "orders._id": req.params.id });
        if (result) {
            res.json(result);
        }
        else {
            res.status(404).json({ error: "Order not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}));
app.delete("/customers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const result = yield customer_1.Customer.deleteOne({ _id: customerId });
        res.json({ deletedCount: result.deletedCount });
    }
    catch (err) {
        res.status(500).json({ error: "content not found" });
    }
}));
app.post("/customers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const customer = new customer_1.Customer(req.body);
    try {
        yield customer.save();
        res.status(201).json({ customer });
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
}));
app.post("/", (req, res) => {
    res.send("Post request");
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose.connect(connection);
        app.listen(PORT, () => {
            console.log("App listening in port: " + PORT);
        });
    }
    catch (err) {
        console.log(err.message);
    }
});
start();
