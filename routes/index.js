const express = require("express");

const productRoutes = require("./productRoutes");
const authRoutes = require("./authRoutes");

const Router = express.Router();

Router.use("/products", productRoutes);
Router.use("/auth", authRoutes);

module.exports = Router;
