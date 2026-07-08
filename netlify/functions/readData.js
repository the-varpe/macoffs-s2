exports.handler = async (event, context) => {
  try {
    const response = await fetch(
      `https://api.jsonbin.io/v3/b/${process.env.JSONBIN_ID}/latest`,
      {
        headers: { "X-Master-Key": process.env.JSONBIN_KEY },
      },
    );

    if (!response.ok) {
      return { statusCode: response.status, body: await response.text() };
    }

    const data = await response.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
