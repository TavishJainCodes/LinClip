const express = require("express");
const app = express();
const cache = require("./services/cache");
const { shortenLimiter } = require("./middleware/rateLimiter");
const path = require("path");

app.use(express.json());

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
}

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/shorten", shortenLimiter, require("./routes/shorten"));

app.use("/api/analytics", require("./routes/analytics"));

app.use("/", require("./routes/redirect"));

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

module.exports = app;
