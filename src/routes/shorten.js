const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const pool = require("../db/index");
const cache = require("../services/cache");

router.post("/", async (req, res) => {
  const { url, slug: customSlug, expiresAt } = req.body;

  if (!url) {
    return res.status(400).json({ error: "url is required" });
  }

  // Normalize URL
  let normalizedUrl = url.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = "https://" + normalizedUrl;
  }

  try {
    const parsed = new URL(normalizedUrl);
    // Ensure there's a valid hostname like youtube.com, not just "https://garbage"
    if (!parsed.hostname.includes(".")) {
      return res.status(400).json({ error: "invalid url" });
    }
  } catch {
    return res.status(400).json({ error: "invalid url" });
  }

  const slug = customSlug || nanoid(7);

  try {
    const result = await pool.query(
      `INSERT INTO urls (slug, original_url, expires_at)
            VALUES ($1, $2, $3)
            RETURNING id, slug, original_url, created_at, expires_at`,
      [slug, normalizedUrl, expiresAt || null],
    );

    const row = result.rows[0];

    await cache.set(slug, normalizedUrl);

    return res.status(201).json({
      slug: row.slug,
      shortUrl: `${process.env.BASE_URL}/${row.slug}`,
      originalUrl: row.original_url,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
    });
  } catch (err) {
    if (err.code === "23505") {
      // unique violation
      return res.status(409).json({ error: "Slug already exists" });
    }
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
