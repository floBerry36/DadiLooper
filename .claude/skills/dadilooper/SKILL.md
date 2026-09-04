---
name: dadilooper
description: >-
  Travail sur le projet DadiLooper : application musicale (aide à la composition
  + looper) en HTML mono-fichier, déployée sur GitHub Pages et testée sur iPad.
  À charger pour toute édition de index.html ou v2.html, pour le rituel
  « vérifier → commit → push → attendre le déploiement → confirmer », et pour les
  conventions du projet (moteur audio, style des commits, feuille de route dans
  docs/vision-v3.md).
---

# DadiLooper

Réplique numérique de la règle à calcul harmonique de Marcel Dadi et Max Meyer,
enrichie de fonctions de looper. Outil d'aide à la **composition** et à
l'**apprentissage**, utilisable comme une app sur iPad.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | version **1**, en production, ~2500 lignes, tout-en-un (HTML + CSS + JS inline) |
| `v2.html` | **refonte** paysage en cours (deux écrans : Harmonie / Looper), c'est ici qu'on travaille |
| `docs/cahier-des-charges.md` | **la référence** : toutes les fonctions, tranchées pertinent/faisable, en phases. On ne code une fonction que si elle y figure. |
| `docs/vision-v3.md` | le récit : état des lieux audio, inspirations, moteur audio en détail. Complète le cahier des charges. |
| `sw.js`, `manifest.webmanifest`, `icon-*.png` | installation PWA (v1 uniquement ; v2 sans manifest pendant l'itération) |
| `regle-a-dadi.html.old` | ancienne version, ignorée par git |

Il n'y a **pas d'étape de build** : les fichiers sont servis tels quels.

## Déploiement

- Dépôt public : `github.com/floBerry36/DadiLooper`, branche `main`.
- GitHub Pages : `https://floberry36.github.io/DadiLooper/` (v1) et
  `.../v2.html` (v2).
- Le micro exige HTTPS → l'utilisateur teste **sur l'iPad via l'URL Pages**,
  pas en local. Donc **toute modif doit être commitée et poussée** pour être
  testable.

## Rituel à chaque modification

1. Éditer le fichier (`v2.html` en général).
2. **Vérifier** : `bash .claude/skills/dadilooper/scripts/check.sh v2.html`
   (syntaxe du `<script>` inline + équilibre des balises `<div>` / `<section>`).
   Il n'y a pas de linter, cette vérif attrape l'essentiel des casses.
3. **Commit + push** sur `main`. Message en **français**, terminé par le trailer
   `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`. Pas de PR, on
   pousse directement sur `main` (workflow validé par l'utilisateur pour ce
   projet).
4. **Attendre le déploiement** en tâche de fond :
   `bash .claude/skills/dadilooper/scripts/wait-live.sh "<marqueur unique de la modif>" v2.html`
   — le marqueur est un bout de texte/CSS/JS que la modif vient d'introduire.
   Compter ~40 s.
5. **Confirmer** à l'utilisateur que c'est en ligne, avec l'URL, et lui dire
   quoi regarder / tester sur l'iPad.

## Conventions

- **Langue** : interface, commentaires de code et messages de commit en français.
- **Audio** : le moteur actuel du looper utilise `ScriptProcessorNode` (déprécié,
  thread principal) → source des glitches. La cible est `AudioWorklet` +
  **enregistrer à sec** (effets seulement à la lecture et à l'export) + **boucle
  sans couture** (longueur en échantillons exacts, micro-fondu au raccord). Voir
  `docs/vision-v3.md` §2.
- **Tactile** : jamais de `:hover` qui change une couleur de fond/`fill` sur un
  élément tapable — sur iOS le `:hover` reste « collé » après un tap. L'envelopper
  dans `@media (hover:hover) and (pointer:fine)`.
- **v2** : hauteur bornée à `100dvh`, les panneaux scrollent en interne
  (`min-height:0` + `overflow-y:auto`) pour que la roue ne bouge pas.
- Deux « racines » distinctes dans l'état de v2 : `state.key` / `state.keyMinor`
  (tonalité de référence, pilotée par la roue et l'accompagnement) et
  `state.root` / `state.chordType` / `state.scaleType` (note explorée sur l'écran
  Accords).

## Idées / pièges connus

- Un `<link rel="manifest">` fait que iOS lance le `start_url` du manifest, pas la
  page ajoutée → v2.html n'a volontairement pas de manifest pendant l'itération.
- Le service worker (réseau-d'abord) couvre tout `/DadiLooper/` : les mises à jour
  passent en ligne, mais une version « app écran d'accueil » peut rester en cache
  plus longtemps — demander un vrai rechargement.
