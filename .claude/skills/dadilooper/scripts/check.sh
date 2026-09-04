#!/usr/bin/env bash
# Vérif rapide d'un fichier HTML mono-page de DadiLooper.
# Usage : check.sh [fichier]   (défaut : v2.html)
set -euo pipefail
f="${1:-v2.html}"
[ -f "$f" ] || { echo "introuvable : $f" >&2; exit 1; }

# 1) syntaxe du/des <script> inline
node -e '
const fs = require("fs");
const h = fs.readFileSync(process.argv[1], "utf8");
const m = h.match(/<script>([\s\S]*?)<\/script>/g) || [];
let all = "";
for (const s of m) all += s.replace(/<\/?script>/g, "") + "\n";
require("vm").compileFunction(all);
console.log("JS OK (" + m.length + " bloc(s) <script> inline)");
' "$f"

# 2) équilibre des balises structurantes
node -e '
const h = require("fs").readFileSync(process.argv[1], "utf8");
const n = (re) => (h.match(re) || []).length;
const dO = n(/<div\b/g), dC = n(/<\/div>/g);
const sO = n(/<section\b/g), sC = n(/<\/section>/g);
const ok = dO === dC && sO === sC;
console.log(
  "div " + dO + "/" + dC + (dO === dC ? " OK" : "  <-- DÉSÉQUILIBRE") +
  "   section " + sO + "/" + sC + (sO === sC ? " OK" : "  <-- DÉSÉQUILIBRE")
);
process.exit(ok ? 0 : 1);
' "$f"
