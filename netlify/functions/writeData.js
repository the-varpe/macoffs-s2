exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST")
    return { statusCode: 405, body: "Method Not Allowed" };

  const binId = process.env.JSONBIN_ID;
  const binKey = process.env.JSONBIN_KEY;

  // 1. Force the terminal to show us exactly what ID is being loaded
  console.log(`[DEBUG] Attempting to write to Bin ID: '${binId}'`);

  if (!binId || !binKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Missing Environment Variables. Check Netlify settings.",
      }),
    };
  }

  try {
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString("utf-8")
      : event.body;

    const requestBody = JSON.parse(rawBody);

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
      console.error("JSONBin Error:", errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "JSONBin rejected the request",
          details: errorText,
        }),
      };
    }

    const data = await response.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (error) {
    console.error("Backend Crash:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
