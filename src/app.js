const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* Routes import */
const userRoutes = require("./routes/user.route");
const moverRoutes = require("./routes/mover.route");

/* Routes config */
app.use("/api/users", userRoutes);
app.use("/api/movers", moverRoutes);

module.exports = app;