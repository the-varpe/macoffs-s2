// ════════════════════════════════════════════════════
//  MacOffs Season 2 — Stable Storage & API Sync Data
// ════════════════════════════════════════════════════

// 1. Configure your Tournament Host (The account hosting the private rooms)
const TOURNAMENT_HOST = "thevarpe";

// 2. Set your Current Block: 1, 2, or 3 (3 = Finals)
const currentBlock = 1;

// 3. Define your static player rosters
const groupA = [
  { name: "imnotnyle", tier: "emerald", status: "alive" },
  { name: "ReaganMCSR", tier: "emerald", status: "alive" },
  { name: "Marinos353", tier: "emerald", status: "alive" },
  { name: "rouxzzcfop", tier: "emerald", status: "alive" },
  { name: "blzako", tier: "emerald", status: "alive" },
  { name: "PoloTheElephant", tier: "emerald", status: "alive" },
  { name: "BlueFalcon1423", tier: "emerald", status: "alive" },
  { name: "FrenchFryJ ", tier: "emerald", status: "alive" },
  { name: "magga1a", tier: "emerald", status: "alive" },
  { name: "winterfairs", tier: "emerald", status: "alive" },
  { name: "johnplumber", tier: "emerald", status: "alive" },
  { name: "K1lby", tier: "diamond", status: "alive" },
  { name: "FlaxyB", tier: "diamond", status: "alive" },
  { name: "aurazz_", tier: "diamond", status: "alive" },
  { name: "Plyers8", tier: "diamond", status: "alive" },
  { name: "Crazyfly072", tier: "diamond", status: "alive" },
  //{ name: "ZeRoIsNot0", tier: "iron", status: "alive" },
  // ... add the rest of Group A players
];

const groupB = [
  { name: "Aannini", tier: "coal", status: "alive" },
  { name: "WarpedKun", tier: "coal", status: "alive" },
  { name: "theredpro", tier: "iron", status: "alive" },
  { name: "FBiaLS", tier: "iron", status: "alive" },
  { name: "Yeetone1", tier: "iron", status: "alive" },
  { name: "dreadedguy", tier: "iron", status: "alive" },
  { name: "ZeRoIsNot0", tier: "iron", status: "alive" },
  { name: "voidexed", tier: "iron", status: "alive" },
  { name: "ItzSteller", tier: "iron", status: "alive" },
  { name: "Samyli", tier: "gold", status: "alive" },
  { name: "Chees_It", tier: "gold", status: "alive" },
  { name: "badbreath", tier: "gold", status: "alive" },
  { name: "Beatricee_", tier: "gold", status: "alive" },
  // ... add the rest of Group B players
];

// Load locked seed results from localStorage on page boot
let seedResults =
  JSON.parse(localStorage.getItem("macoffs_seed_results")) || [];

// Helper: Convert milliseconds into MM:SS format
function formatMsToTime(ms) {
  if (!ms || ms >= 1200000) return "—"; // 20-minute cap threshold
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Helper: Calculate points based on finish position
function calculatePoints(position) {
  const pointsMap = { 1: 12, 2: 9, 3: 7, 4: 5, 5: 4, 6: 3, 7: 2, 8: 1, 9: 1 };
  return pointsMap[position] || 0;
}

// ── LOCK LATEST MATCH OPERATION ──
async function lockLatestMatch() {
  try {
    console.log("Fetching latest match from API...");
    // Fetch only the single most recent private room match from the host (type=3 is Private Room)
    const response = await fetch(
      `https://api.mcsrranked.com/users/${TOURNAMENT_HOST}/matches?type=3&count=1`,
    );
    const json = await response.json();

    if (json.status !== "success" || !json.data || json.data.length === 0) {
      alert("No private room matches found for this host user.");
      return;
    }

    const match = json.data[0];

    // Avoid double-locking to ensure points aren't awarded twice
    const storedMatchIds =
      JSON.parse(localStorage.getItem("macoffs_saved_match_ids")) || [];
    if (storedMatchIds.includes(match.id)) {
      alert(`Match ID #${match.id} has already been captured and stored!`);
      return;
    }

    // Retrieve advanced match data containing completion runtimes
    const detailResponse = await fetch(
      `https://api.mcsrranked.com/matches/${match.id}`,
    );
    const detailJson = await detailResponse.json();
    if (detailJson.status !== "success") {
      alert("Could not load advanced run parameters from the API.");
      return;
    }
    const advancedMatch = detailJson.data;

    // Check match players to see who is active in this instance
    const matchPlayerNames = advancedMatch.players.map((p) =>
      p.nickname.toLowerCase(),
    );
    const hasGroupA = groupA.some((p) =>
      matchPlayerNames.includes(p.name.toLowerCase()),
    );
    const hasGroupB = groupB.some((p) =>
      matchPlayerNames.includes(p.name.toLowerCase()),
    );

    let determinedGroup = "pending";
    let blockNum = currentBlock; // Locked under whatever block you are currently running

    if (hasGroupA && hasGroupB) {
      determinedGroup = "f";
      blockNum = 3;
    } else if (hasGroupA) {
      determinedGroup = "a";
    } else if (hasGroupB) {
      determinedGroup = "b";
    } else {
      alert(
        "This match was ignored. None of the players belong to Group A or Group B.",
      );
      return;
    }

    // Count existing runs to figure out the sequential seed count index
    const existingGroupSeeds = seedResults.filter(
      (s) => s.group === determinedGroup && s.block === blockNum,
    );
    let seedNum = existingGroupSeeds.length + 1;
    if (determinedGroup === "a" && blockNum === 2) seedNum += 3;
    if (determinedGroup === "b" && blockNum === 2) seedNum += 3;
    if (determinedGroup === "f") seedNum += 6;

    // Map completion records
    const completions = (advancedMatch.completions || []).sort(
      (a, b) => a.time - b.time,
    );
    const parsedResults = completions.map((comp, index) => {
      const playerProfile = advancedMatch.players.find(
        (p) => p.uuid === comp.uuid,
      );
      return {
        name: playerProfile ? playerProfile.nickname : "Unknown",
        time: formatMsToTime(comp.time),
        pts: calculatePoints(index + 1),
      };
    });

    const newSeedRecord = {
      group: determinedGroup,
      block: blockNum,
      seedNum: seedNum,
      overworld: advancedMatch.seed?.overworld || null,
      bastion: advancedMatch.seed?.nether || null,
      results: parsedResults.length > 0 ? parsedResults : null,
    };

    // Append to local arrays and write straight to localStorage
    seedResults.push(newSeedRecord);
    storedMatchIds.push(match.id);

    localStorage.setItem("macoffs_seed_results", JSON.stringify(seedResults));
    localStorage.setItem(
      "macoffs_saved_match_ids",
      JSON.stringify(storedMatchIds),
    );

    alert(
      `Success! Captured Match #${match.id} as Seed ${seedNum} for Group ${determinedGroup.toUpperCase()}.`,
    );

    // Trigger window UI refreshes if functions exist on the current tab
    if (typeof refreshUI === "function") refreshUI();
    if (typeof setGroup === "function") setGroup(currentGroup || "a");
  } catch (error) {
    console.error("Lock sequence crash:", error);
    alert("Failed to track match: check network or logs.");
  }
}

// Administrative clear data tool
function resetTournamentBoard() {
  if (
    confirm(
      "Are you absolutely sure you want to completely wipe all saved matches from storage? This cannot be undone.",
    )
  ) {
    localStorage.removeItem("macoffs_seed_results");
    localStorage.removeItem("macoffs_saved_match_ids");
    seedResults = [];
    location.reload();
  }
}
