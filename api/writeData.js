module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const binId = process.env.JSONBIN_ID;
  const binKey = process.env.JSONBIN_KEY;

  if (!binId || !binKey) {
    return res.status(500).json({
      error: "Missing Environment Variables. Check Vercel settings.",
    });
  }

  try {
    const requestBody =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": binKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: "JSONBin rejected the request",
        details: errorText,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
