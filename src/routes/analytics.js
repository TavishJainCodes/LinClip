const express = require("express");
const router = express.Router();
const pool = require("../db/index");

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    // check slug exists
    const urlResult = await pool.query(
      "SELECT id, original_url, click_count, created_at FROM urls WHERE slug = $1",
      [slug],
    );

    if (urlResult.rows.length === 0) {
      return res.status(404).json({ error: "Slug not found" });
    }

    const url = urlResult.rows[0];
    const slugId = url.id;

    // Run all breakdown queries in parallel
    const [byCountry, byDevice, byBrowser, byOs, byReferrer, byDay] =
      await Promise.all([
        pool.query(
          `SELECT country, COUNT(*) as count FROM clicks
            WHERE slug_id = $1 AND country IS NOT NULL
            GROUP BY country ORDER BY count DESC`,
          [slugId],
        ),
        pool.query(
          `SELECT device_type, COUNT(*) as count FROM clicks
            WHERE slug_id = $1 AND device_type IS NOT NULL
            GROUP BY device_type ORDER BY count DESC`,
          [slugId],
        ),
        pool.query(
          `SELECT browser, COUNT(*) as count FROM clicks
            WHERE slug_id = $1 AND browser IS NOT NULL
            GROUP BY browser ORDER BY count DESC`,
          [slugId],
        ),
        pool.query(
          `SELECT os, COUNT(*) as count FROM clicks
            WHERE slug_id = $1 AND os IS NOT NULL
            GROUP BY os ORDER BY count DESC`,
          [slugId],
        ),
        pool.query(
          `SELECT referrer, COUNT(*) as count FROM clicks
            WHERE slug_id = $1 AND referrer IS NOT NULL
            GROUP BY referrer ORDER BY count DESC`,
          [slugId],
        ),
        pool.query(
          `SELECT DATE(clicked_at)::text as date, COUNT(*) as count FROM clicks
            WHERE slug_id = $1
            GROUP BY date ORDER BY date ASC`,
          [slugId],
        ),
      ]);

    return res.json({
      slug,
      originalUrl: url.original_url,
      createdAt: url.created_at,
      totalClicks: parseInt(url.click_count),
      breakdown: {
        byCountry: byCountry.rows,
        byDevice: byDevice.rows,
        byBrowser: byBrowser.rows,
        byOs: byOs.rows,
        byReferrer: byReferrer.rows,
        byDay: byDay.rows,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
