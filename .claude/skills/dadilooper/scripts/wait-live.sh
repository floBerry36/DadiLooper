#!/usr/bin/env bash
# Attend qu'un marqueur apparaisse sur la page GitHub Pages de DadiLooper,
# après un push. À lancer en tâche de fond.
# Usage : wait-live.sh "<marqueur>" [chemin]     (chemin défaut : v2.html)
#   <marqueur> = un bout de texte/CSS/JS que la modif vient d'introduire.
set -euo pipefail
marker="${1:-}"
path="${2:-v2.html}"
base="https://floberry36.github.io/DadiLooper"
[ -n "$marker" ] || { echo "usage : wait-live.sh <marqueur> [chemin]" >&2; exit 1; }

for i in $(seq 1 40); do
  if curl -s "$base/$path?v=$(date +%s)" | grep -q -F -- "$marker"; then
    echo "EN LIGNE apres ~$((i * 8))s  ->  $base/$path"
    exit 0
  fi
  sleep 8
done
echo "pas encore en ligne (marqueur absent apres ~5 min) : $marker"
exit 1
