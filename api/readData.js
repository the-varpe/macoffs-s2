module.exports = async (req, res) => {
  try {
    const response = await fetch(
      `https://api.jsonbin.io/v3/b/${process.env.JSONBIN_ID}/latest`,
      {
        headers: { "X-Master-Key": process.env.JSONBIN_KEY },
      },
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
