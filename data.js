// ════════════════════════════════════════════════════
//  MacOffs Season 2 — Shared Data File
//  Edit ONLY this file to update both the scoreboard
//  (index.html) and the commentary view (summary.html)
// ════════════════════════════════════════════════════

// ── CURRENT BLOCK: 1, 2, 3, 4, or 5 (5 = Finals) ──
// CHANGE ACCORDING TO CURRENT BLOCK ----------------------------------------------------------------
const currentBlock = 5;

// ── PLAYERS ──
// status: "alive" | "eliminated" | "qualified" | "pending"

const groupA = [
  { name: "thevarpe", tier: "netherite", status: "qualified" },
  { name: "thevarpeagain", tier: "diamond iii", status: "eliminated"},
];

const groupB = [
  { name: "thevarpe", tier: "gold i", status: "alive" },
  { name: "thevarpe", tier: "coal ii", status: "pending"},
];

// ── SEED RESULTS ──
// Set results to null until a seed is complete.
// Once complete, replace null with an array of finish objects in order:
//   { name: "PlayerName", time: "8:14", pts: 12 }
// Also fill in overworld and bastion strings when known.
// CHANGE ONCE EACH SEED IS COMPLETE

const seedResults = [
  // GROUP A — BLOCK 1
  { group: "a", block: 1, seedNum: 1, overworld: null, bastion: null, results: null },
  { group: "a", block: 1, seedNum: 2, overworld: null, bastion: null, results: null },
  { group: "a", block: 1, seedNum: 3, overworld: null, bastion: null, results: null },

  // GROUP B — BLOCK 1
  { group: "b", block: 1, seedNum: 1, overworld: "village", bastion: "housing", results: [{ name: "thevarpe", time: "10:05", pts: 12 }] },
  { group: "b", block: 1, seedNum: 2, overworld: null, bastion: null, results: null },
  { group: "b", block: 1, seedNum: 3, overworld: null, bastion: null, results: null },

  // GROUP A — BLOCK 2
  { group: "a", block: 2, seedNum: 4,  overworld: null, bastion: null, results: null },
  { group: "a", block: 2, seedNum: 5,  overworld: null, bastion: null, results: null },
  { group: "a", block: 2, seedNum: 6,  overworld: null, bastion: null, results: null },

  // GROUP B — BLOCK 2
  { group: "b", block: 2, seedNum: 4,  overworld: null, bastion: null, results: null },
  { group: "b", block: 2, seedNum: 5,  overworld: null, bastion: null, results: null },
  { group: "b", block: 2, seedNum: 6,  overworld: null, bastion: null, results: null },

  // GROUP A — BLOCK 3
  { group: "a", block: 3, seedNum: 7,  overworld: null, bastion: null, results: null },
  { group: "a", block: 3, seedNum: 8,  overworld: null, bastion: null, results: null },
  { group: "a", block: 3, seedNum: 9,  overworld: null, bastion: null, results: null },

  // GROUP B — BLOCK 3
  { group: "b", block: 3, seedNum: 7,  overworld: null, bastion: null, results: null },
  { group: "b", block: 3, seedNum: 8,  overworld: null, bastion: null, results: null },
  { group: "b", block: 3, seedNum: 9,  overworld: null, bastion: null, results: null },

  // GROUP A — BLOCK 4
  { group: "a", block: 4, seedNum: 10, overworld: null, bastion: null, results: null },
  { group: "a", block: 4, seedNum: 11, overworld: null, bastion: null, results: null },
  { group: "a", block: 4, seedNum: 12, overworld: null, bastion: null, results: null },

  // GROUP B — BLOCK 4
  { group: "b", block: 4, seedNum: 10, overworld: null, bastion: null, results: null },
  { group: "b", block: 4, seedNum: 11, overworld: null, bastion: null, results: null },
  { group: "b", block: 4, seedNum: 12, overworld: null, bastion: null, results: null },

  // FINALS — BLOCK 5 (merged group "f", top 5 from each group)
  { group: "f", block: 5, seedNum: 13, overworld: null, bastion: null, results: null },
  { group: "f", block: 5, seedNum: 14, overworld: null, bastion: null, results: null },
  { group: "f", block: 5, seedNum: 15, overworld: null, bastion: null, results: null },
];

// ── FINALS PLAYERS ──
// Populated automatically from groupA/groupB qualified players.
// You do NOT need to edit this — just set status: "qualified" on the
// top 5 players from each group after Block 4 and the finals panel
// will populate itself.

