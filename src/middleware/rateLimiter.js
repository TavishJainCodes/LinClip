const rateLimit = require("express-rate-limit");

const shortenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  standardHeaders: true,
  legacyheaders: false,
  message: { error: "Too many requests, slow down." },
});

module.exports = { shortenLimiter };
