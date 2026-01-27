const express = require('express');
const path = require('path');
const cors = require('cors');

const userRouter = require('./routes/userRouter');

const app = express();
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, "public")));


app.use("/api/users", userRouter);

module.exports = app;

