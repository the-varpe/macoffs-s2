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
  { name: "magga1a", tier: "emerald", status: "alive" },
  { name: "winterfairs", tier: "emerald", status: "alive" },
  { name: "imnotnyle", tier: "emerald", status: "alive" },
  { name: "ReaganMCSR", tier: "emerald", status: "alive" },
  { name: "Marinos353", tier: "emerald", status: "alive" },
  { name: "rouxzzcfop", tier: "emerald", status: "alive" },
  { name: "XerxthePhyrst", tier: "emerald", status: "alive" },
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
  { name: "Beatricee", tier: "iron", status: "alive" },
  { name: "Aannini", tier: "coal", status: "alive" },
  { name: "WarpedKun", tier: "coal", status: "alive" },
  // ... add the rest of Group B players
];

let seedResults = [];
let storedMatchIds = [];

// --- SECURE CLOUD NETWORK FUNCTIONS ---
async function loadCloudData() {
  try {
    const response = await fetch("/.netlify/functions/readData");
    const data = await response.json();
    if (data.record) {
      seedResults = data.record.seedResults || [];
      storedMatchIds = data.record.savedMatchIds || [];
      currentBlock = data.record.currentBlock || 1;
    }
  } catch (err) {
    console.error("Cloud load error:", err);
  }
}

async function saveCloudData() {
  const response = await fetch("/.netlify/functions/writeData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      seedResults,
      savedMatchIds: storedMatchIds,
      currentBlock,
    }),
  });

  if (!response.ok) {
    throw new Error(`Database write failed with status ${response.status}`);
  }

  // Tell other tabs to refresh
  syncChannel.postMessage("update_data");
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

// --- ADMIN CONTROL FUNCTIONS ---
async function lockLatestMatch() {
  try {
    await loadCloudData();

    const matchResponse = await fetch("/.netlify/functions/getLatestMatch");
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
    let blockNum = currentBlock;

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
    alert(
      `Success! Captured Match #${advancedMatch.id} as Seed ${seedNum} for Group ${determinedGroup.toUpperCase()}.`,
    );
  } catch (error) {
    console.error("Lock sequence crash:", error);
    alert(`Failed to track match: ${error.message}`);
  }
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
