import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    // Read from environment variable
    const baseUrl = process.env.VITE_API_BASE_URL;

    if (!baseUrl) {
      return res.status(500).json({ error: "VITE_API_BASE_URL not set" });
    }

    // Build target URL (strip `/api/proxy` from req.url)
    const targetPath = req.url.replace(/^\/api\/proxy/, "");
    const backendUrl = `${baseUrl}${targetPath}`;

    // Forward request
    const backendRes = await fetch(backendUrl, {
      method: req.method,
      headers: { ...req.headers, host: undefined }, // avoid host mismatch
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    });

    // Forward response
    const data = await backendRes.text();
    res.status(backendRes.status).send(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed" });
  }
}
