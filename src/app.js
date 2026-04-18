const express = require("express");
const app = express();
const cache = require("./services/cache");
const { shortenLimiter } = require("./middleware/rateLimiter");

app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/shorten", shortenLimiter, require("./routes/shorten"));

app.use("/api/analytics", require("./routes/analytics"));

app.use("/", require("./routes/redirect"));

module.exports = app;
