const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth")
const menuRoutes = require("./routes/menu")
const mapRoutes = require("./routes/map")
const orderRoutes = require("./routes/order")
const guestRoutes = require("./routes/guest")


const app = express();


// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(cors());

app.use((req, res, next) => {
  
  const allowedOrigin = 'http://localhost:5173';
  const origin = req.headers.origin;
  if (origin === allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/auth", authRoutes);
app.use("/menu", menuRoutes);
app.use("/map", mapRoutes)
app.use("/order", orderRoutes)
app.use("/guest", guestRoutes)

mongoose
  .connect(
    "mongodb+srv://ilija:123ilija123@cluster10956.fnuypdk.mongodb.net/app?retryWrites=true&w=majority&appName=Cluster10956"
  )
  .then((res) => {
    const server = app.listen(8080);
    const io = require('./socket').init(server);
    io.on('connection', socket => {
      console.log('Client connected');
    })
  })
  .catch((err) => {
    console.log(err);
  });
