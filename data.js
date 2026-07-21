// ════════════════════════════════════════════════════
//  MacOffs Season 2 — Secure Cloud Engine
// ════════════════════════════════════════════════════

let currentBlock = 1;
const syncChannel = new BroadcastChannel("macoffs_sync");

// --- ROSTERS ---
const groupA = [
  { name: "Plyers8", tier: "diamond", status: "alive" },
  { name: "K1lby", tier: "diamond", status: "alive" },
  { name: "FlaxyB", tier: "diamond", status: "alive" },
  { name: "aurazz_", tier: "diamond", status: "alive" },
  { name: "Crazyfly072", tier: "diamond", status: "alive" },
  { name: "johnplumber", tier: "emerald", status: "alive" },
  { name: "qrynch", tier: "emerald", status: "alive" },
  { name: "blzako", tier: "emerald", status: "alive" },
  { name: "PoloTheElephant", tier: "emerald", status: "alive" },
  { name: "BlueFalcon1423", tier: "emerald", status: "alive" },
  { name: "FrenchFryJ ", tier: "emerald", status: "alive" },
  { name: "winterfairs", tier: "emerald", status: "alive" },
  { name: "imnotnyle", tier: "emerald", status: "alive" },
  { name: "ReaganMCSR", tier: "emerald", status: "alive" },
  { name: "Marinos353", tier: "emerald", status: "alive" },
  { name: "rouxzzcfop", tier: "emerald", status: "alive" },
  { name: "XerxthePhyrst", tier: "emerald", status: "alive" },
  { name: "Andysh1sells", tier: "emerald", status: "alive" },
  // ... add the rest of Group A players
];

const groupB = [
  { name: "OrangeLmao", tier: "gold", status: "alive" },
  { name: "badbreath", tier: "gold", status: "alive" },
  { name: "Samyli", tier: "gold", status: "alive" },
  { name: "CheesIt", tier: "gold", status: "alive" },
  { name: "AdditionalRAM", tier: "gold", status: "alive" },
  { name: "thingys_", tier: "gold", status: "alive" },
  { name: "theredpro", tier: "gold", status: "alive" },
  { name: "Yeetone1", tier: "gold", status: "alive" },
  { name: "searchcrafting", tier: "gold", status: "pending" },
  { name: "ItzSteller", tier: "iron", status: "alive" },
  { name: "ZeRoIsNot0", tier: "iron", status: "alive" },
  { name: "voidexed", tier: "iron", status: "alive" },
  { name: "dreadedguy", tier: "iron", status: "alive" },
  { name: "FBiaLS", tier: "iron", status: "alive" },
  { name: "zaaning", tier: "iron", status: "alive" },
  { name: "ducky8x", tier: "iron", status: "alive" },
  { name: "Envilatous", tier: "iron", status: "alive" },
  { name: "Aannini", tier: "coal", status: "alive" },
  { name: "WarpedKun", tier: "coal", status: "alive" },
  // ... add the rest of Group B players
];

let seedResults = [];
let storedMatchIds = [];

// --- CACHE INVALIDATION LISTENER ---
syncChannel.addEventListener("message", (event) => {
  if (event.data === "update_data") {
    // 1. Wipe the old local memory
    sessionStorage.removeItem("macoffs_cache");
    sessionStorage.removeItem("macoffs_cache_time");

    // 2. Force the browser to instantly reload the screen with fresh data!
    window.location.reload();
  }
});

// --- SECURE CLOUD NETWORK FUNCTIONS ---
async function loadCloudData() {
  const cacheKey = "macoffs_cache";
  const cacheTimeKey = "macoffs_cache_time";
  const CACHE_TTL = 60000; // 60 seconds

  try {
    const cachedData = sessionStorage.getItem(cacheKey);
    const cacheTimestamp = sessionStorage.getItem(cacheTimeKey);

    if (
      cachedData &&
      cacheTimestamp &&
      Date.now() - parseInt(cacheTimestamp) < CACHE_TTL
    ) {
      const parsed = JSON.parse(cachedData);
      seedResults = parsed.seedResults || [];
      storedMatchIds = parsed.savedMatchIds || [];
      currentBlock = parsed.currentBlock || 1;
      console.log("Loaded data from local browser cache.");
      return;
    }

    const response = await fetch("/api/readData");
    const data = await response.json();

    if (data.record) {
      seedResults = data.record.seedResults || [];
      storedMatchIds = data.record.savedMatchIds || [];
      currentBlock = data.record.currentBlock || 1;

      sessionStorage.setItem(
        cacheKey,
        JSON.stringify({
          seedResults,
          savedMatchIds: storedMatchIds,
          currentBlock,
        }),
      );
      sessionStorage.setItem(cacheTimeKey, Date.now().toString());
    }
  } catch (err) {
    console.error("Cloud load error:", err);
  }
}

async function saveCloudData() {
  // Force currentBlock to be an integer so JSONBin formats it properly
  const payload = {
    seedResults,
    savedMatchIds: storedMatchIds,
    currentBlock: parseInt(currentBlock, 10),
  };

  const response = await fetch("/api/writeData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Database write failed with status ${response.status}`);
  }

  sessionStorage.setItem("macoffs_cache", JSON.stringify(payload));
  sessionStorage.setItem("macoffs_cache_time", Date.now().toString());

  // Send the ping that triggers the auto-refresh we added in Step 1
  syncChannel.postMessage("update_data");
}

async function lockLatestMatch() {
  try {
    await loadCloudData();

    // Vercel Endpoint
    const matchResponse = await fetch("/api/getLatestMatch");
    const matchData = await matchResponse.json();

    if (matchData.error) {
      alert(`Error: ${matchData.error}`);
      return;
    }

    const advancedMatch = matchData.data;

    if (storedMatchIds.includes(advancedMatch.id)) {
      alert(
        `Match ID #${advancedMatch.id} has already been captured and stored!`,
      );
      return;
    }

    let determinedGroup = null;
    let blockNum = currentBlock;

    if (currentBlock === 3) {
      determinedGroup = "f";
    } else {
      // 1. Get a list of lowercase nicknames from the private room match
      const matchPlayerNames = advancedMatch.players.map((p) =>
        p.nickname.toLowerCase(),
      );

      // 2. Cross-reference them with your tournament roster arrays
      const hasGroupAPlayer = groupA.some((p) =>
        matchPlayerNames.includes(p.name.toLowerCase()),
      );
      const hasGroupBPlayer = groupB.some((p) =>
        matchPlayerNames.includes(p.name.toLowerCase()),
      );

      // 3. Assign the group automatically based on who is inside
      if (hasGroupAPlayer) {
        determinedGroup = "a";
      } else if (hasGroupBPlayer) {
        determinedGroup = "b";
      } else {
        // Safe exit if it's an unrelated private room
        alert(
          "Failed to track match: None of the players in this private room match your Group A or Group B roster. Verify the host is in the correct room!",
        );
        return;
      }
    }

    const existingGroupSeeds = seedResults.filter(
      (s) => s.group === determinedGroup && s.block === blockNum,
    );
    let seedNum = existingGroupSeeds.length + 1;
    if (determinedGroup === "a" && blockNum === 2) seedNum += 3;
    if (determinedGroup === "b" && blockNum === 2) seedNum += 3;
    if (determinedGroup === "f") seedNum += 6;

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

    seedResults.push(newSeedRecord);
    storedMatchIds.push(advancedMatch.id);

    await saveCloudData();
    alert(`Success! Captured Match #${advancedMatch.id} as Seed ${seedNum}.`);
  } catch (error) {
    console.error("Lock sequence crash:", error);
    alert(`Failed to track match: ${error.message}`);
  }
}

// --- LOGIC HELPER FUNCTIONS ---
function formatMsToTime(ms) {
  if (!ms || ms >= 1200000) return "—";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function calculatePoints(position) {
  const pointsMap = { 1: 12, 2: 9, 3: 7, 4: 5, 5: 4, 6: 3, 7: 2, 8: 1, 9: 1 };
  return pointsMap[position] || 0;
}

async function resetTournamentBoard() {
  if (
    confirm(
      "Are you absolutely sure you want to completely wipe the cloud database?",
    )
  ) {
    seedResults = [];
    storedMatchIds = [];
    await saveCloudData();
    alert("Success! Cloud database wiped.");
  }
}
