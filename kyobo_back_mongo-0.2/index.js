const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

const Router = require("./router");

mongoose
  .connect("mongodb+srv://ford:ford10082@cluster0.hoy5z.mongodb.net/test", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(cors());

app.use(Router);

// next 인자를 통해 넘어온 에러를 처리하기 위한
// 에러 핸들러 추가
app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

module.exports = app;
