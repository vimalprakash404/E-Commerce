// /api/proxy.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const baseUrl = process.env.VITE_API_BASE_URL; // from Vercel env
    if (!baseUrl) {
      return res.status(500).json({ error: "VITE_API_BASE_URL not set" });
    }

    // Remove /api/proxy prefix
    const targetPath = req.url.replace(/^\/api\/proxy/, "");
    const backendUrl = `${baseUrl}${targetPath}`;

    const backendRes = await fetch(backendUrl, {
      method: req.method,
      headers: { ...req.headers, host: undefined },
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    });

    const data = await backendRes.text();
    res.status(backendRes.status).send(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed" });
  }
}
