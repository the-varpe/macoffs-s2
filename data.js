// ════════════════════════════════════════════════════
//  MacOffs Season 2 — Shared Data File
//  Edit ONLY this file to update both the scoreboard
//  and the commentary view simultaneously.
// ════════════════════════════════════════════════════

// ── CURRENT BLOCK (1–4, then Finals) ──
const currentBlock = 1;

// ── PLAYERS ──
// status: "alive" | "eliminated" | "qualified" | "pending"

const groupA = [
  { name: "PlayerName", tier: "netherite", status: "alive" },
];

const groupB = [
  { name: "thevarpe", tier: "gold", status: "alive" },
];

// ── SEED RESULTS ──
// Set results to null until a seed is complete.
// Once complete, replace null with an array of finish objects in order:
//   { name: "PlayerName", time: "8:14", pts: 12 }
// Also fill in overworld and bastion strings when known.

const seedResults = [
  // ── BLOCK 1 ──
  { group:"a", block:1, seedNum:1,  overworld:null, bastion:null, results:null },
  { group:"a", block:1, seedNum:2,  overworld:null, bastion:null, results:null },
  { group:"a", block:1, seedNum:3,  overworld:null, bastion:null, results:null },

  { group:"b", block:1, seedNum:1,  overworld:null, bastion:null, results:[{ name:"thevarpe", time:"10:00", pts:12 }] },
  { group:"b", block:1, seedNum:2,  overworld:null, bastion:null, results:null },
  { group:"b", block:1, seedNum:3,  overworld:null, bastion:null, results:null },

  // ── BLOCK 2 ──
  { group:"a", block:2, seedNum:4,  overworld:null, bastion:null, results:null },
  { group:"a", block:2, seedNum:5,  overworld:null, bastion:null, results:null },
  { group:"a", block:2, seedNum:6,  overworld:null, bastion:null, results:null },

  { group:"b", block:2, seedNum:4,  overworld:null, bastion:null, results:null },
  { group:"b", block:2, seedNum:5,  overworld:null, bastion:null, results:null },
  { group:"b", block:2, seedNum:6,  overworld:null, bastion:null, results:null },

  // ── BLOCK 3 ──
  { group:"a", block:3, seedNum:7,  overworld:null, bastion:null, results:null },
  { group:"a", block:3, seedNum:8,  overworld:null, bastion:null, results:null },
  { group:"a", block:3, seedNum:9,  overworld:null, bastion:null, results:null },

  { group:"b", block:3, seedNum:7,  overworld:null, bastion:null, results:null },
  { group:"b", block:3, seedNum:8,  overworld:null, bastion:null, results:null },
  { group:"b", block:3, seedNum:9,  overworld:null, bastion:null, results:null },

  // ── BLOCK 4 ──
  { group:"a", block:4, seedNum:10, overworld:null, bastion:null, results:null },
  { group:"a", block:4, seedNum:11, overworld:null, bastion:null, results:null },
  { group:"a", block:4, seedNum:12, overworld:null, bastion:null, results:null },

  { group:"b", block:4, seedNum:10, overworld:null, bastion:null, results:null },
  { group:"b", block:4, seedNum:11, overworld:null, bastion:null, results:null },
  { group:"b", block:4, seedNum:12, overworld:null, bastion:null, results:null },

  // ── FINALS ──
  { group:"f", block:5, seedNum:13, overworld:null, bastion:null, results:null },
  { group:"f", block:5, seedNum:14, overworld:null, bastion:null, results:null },
  { group:"f", block:5, seedNum:15, overworld:null, bastion:null, results:null },
];
