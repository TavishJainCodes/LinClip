const { createClient } = require("redis");
require("dotenv").config();

const client = createClient({ url: process.env.REDIS_URL });

client.on("error", (err) => console.error("Redis Error:", err));

async function connect() {
  if (!client.isOpen) await client.connect();
}

async function get(key) {
  await connect();
  return client.get(key);
}

async function set(key, value, ttlSeconds = 86400) {
  await connect();
  await client.set(key, value, { EX: ttlSeconds });
}

async function del(key) {
  await connect();
  await client.del(key);
}

async function flushAll() {
  await connect();
  await client.flushAll();
}

module.exports = { get, set, del, flushAll };
