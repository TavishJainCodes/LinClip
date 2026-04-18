const express = require("express");
const app = express();
const cache = require("./services/cache");

app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/shorten", require("./routes/shorten"));

app.use("/api/analytics", require("./routes/analytics"));

app.use("/", require("./routes/redirect"));

module.exports = app;
