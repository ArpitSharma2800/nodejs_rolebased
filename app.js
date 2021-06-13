require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const router = require("./api/router");

app.use("/api/", router);

app.listen(process.env.APP_PORT, () =>
    console.log(`Example app listening on port ${process.env.APP_PORT}!`)
);