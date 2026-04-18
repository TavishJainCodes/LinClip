const geoip = require("geoip-lite");

function lookup(ip) {
  if (ip === "::1" || ip === "127.0.0.1") return { country: null, city: null };

  const geo = geoip.lookup(ip);
  if (!geo) return { country: null, city: null };

  return {
    country: geo.country || null,
    city: geo.city || null,
  };
}

module.exports = { lookup };
