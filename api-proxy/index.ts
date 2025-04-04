export default async function handler(req, res) {
  const {  method } = req;

  // URL: /api/v1/goods → dışarıda sadece path'i almalıyız
  const externalPath = req.url?.replace(/^\/api/, "") || "";
  const externalUrl = `https://c2b-fbusiness.customs.gov.az${externalPath}`;
  

  try {
    const response = await fetch(externalUrl, {
      method,
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy error", details: error.message });
  }
}
