const fs = require("fs");
const path = require("path");
const pool = require("./index");

const files = ["001_create_urls.sql", "002_create_clicks.sql"];

async function migrate() {
  for (const file of files) {
    const sql = fs.readFileSync(
      path.join(__dirname, "migrations", file),
      "utf8",
    );
    await pool.query(sql);
    console.log(`Ran ${file}`);
  }
  await pool.end();
}

migrate().catch(console.error);
