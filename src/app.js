const cors = require("cors");
const express = require("express");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes import */
const userRoutes = require("./routes/user.route");

/* Routes config */
app.use("/api/users", userRoutes);

module.exports = app;