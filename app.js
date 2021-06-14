require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const router = require("./api/router");

app.use("/api/", router);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.once('open', () => {
    console.log('connect to db');
})

app.listen(process.env.APP_PORT, () =>
    console.log(`Example app listening on port ${process.env.APP_PORT}!`)
);