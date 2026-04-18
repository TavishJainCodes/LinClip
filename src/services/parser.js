const UAParser = require("ua-parser-js");

function parse(uaString) {
  if (!uaString) return { browser: null, os: null, device: null };

  const parser = new UAParser(uaString);
  const result = parser.getResult();

  return {
    device: result.device.type || "desktop", // ua-parser returns undefined for desktops, so we default to "desktop"
    browser: result.browser.name || null,
    os: result.os.name || null,
  };
}

module.exports = { parse };
