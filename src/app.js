const express = require("express");
const app = express();

app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/shorten", require("./routes/shorten"));

module.exports = app;
