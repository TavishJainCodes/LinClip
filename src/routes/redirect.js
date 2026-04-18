const express = require("express");
const router = express.Router();
const pool = require("../db/index");
const cache = require("../services/cache");
const geo = require("../services/geo");
const parser = require("../services/parser");

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    let originalUrl = await cache.get(slug);

    if (!originalUrl) {
      const result = await pool.query(
        `SELECT id, original_url, is_active, expires_at FROM urls WHERE slug = $1`,
        [slug],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Slug not found" });
      }

      const row = result.rows[0];

      if (!row.is_active) {
        return res.status(410).json({ error: "Link is inctive" });
      }

      if (row.expires_at && new Date(row.expires_at) < new Date()) {
        return res.status(410).json({ error: "Link has expired" });
      }

      // Re-warm cache
      await cache.set(slug, row.original_url);
      originalUrl = row.original_url;

      // Fire async analytics
      await fireAnalytics(slug, req);

      return res.redirect(302, originalUrl);
    }

    // Cache hit — still fire analytics
    await fireAnalytics(slug, req);

    return res.redirect(302, originalUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
});

async function fireAnalytics(slug, req) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  const referrer = req.headers["referer"] || null;
  const ua = req.headers["user-agent"] || null;

  const { country, city } = geo.lookup(ip);
  const { device, browser, os } = parser.parse(ua);

  const result = await pool.query(`SELECT id FROM urls WHERE slug = $1`, [
    slug,
  ]);

  if (result.rows.length === 0) return;

  const slugId = result.rows[0].id;

  await Promise.all([
    pool.query(
      `INSERT INTO clicks (slug_id, referrer, country, city, device_type, browser, os)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [slugId, referrer, country, city, device, browser, os],
    ),
    pool.query(`UPDATE urls SET click_count = click_count + 1 WHERE id = $1`, [
      slugId,
    ]),
  ]);
}

module.exports = router;
