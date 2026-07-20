module.exports = async (req, res) => {
  try {
    const hostName = process.env.MCSR_HOST;
    const privateKey = process.env.MCSR_PRIVATE_KEY;

    if (!hostName) {
      return res
        .status(500)
        .json({ error: "Missing MCSR_HOST environment variable." });
    }

    // 1. Fetch the recent matches list
    const listResponse = await fetch(
      `https://api.mcsrranked.com/users/${hostName}/matches?type=3&count=1`,
    );
    const listJson = await listResponse.json();

    if (
      listJson.status !== "success" ||
      !listJson.data ||
      listJson.data.length === 0
    ) {
      return res
        .status(404)
        .json({ error: "No private room matches found for this host." });
    }

    const matchId = listJson.data[0].id;

    // 2. Fetch the advanced completion data securely
    const detailResponse = await fetch(
      `https://api.mcsrranked.com/matches/${matchId}`,
      {
        headers: { "Private-Key": privateKey },
      },
    );
    const detailJson = await detailResponse.json();

    if (detailJson.status !== "success") {
      return res
        .status(500)
        .json({ error: "Could not load advanced run parameters." });
    }

    return res.status(200).json({ data: detailJson.data });
  } catch (error) {
    return res.status(500).json({ error: "Backend failed." });
  }
};
