const express = require('express');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const router = require("./routes/userRoute");

const app = express()
app.use(express.json());
dotenv.config()

const port = process.env.PORT || 3000;

app.use("/api",router);

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))