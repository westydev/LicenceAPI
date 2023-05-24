const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const chalk = require("chalk").default;

const index = require("./src/routers/index");

const app = express();
const PORT = 3003;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use("/", index);

app.listen(3003, async () => {
    await mongoose.connect("mongodbconnection");
    console.log(chalk.green(`Api Started http://localhost:${PORT}`));
})