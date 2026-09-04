# DadiLooper — cahier des charges

Document de référence : on liste **toutes** les fonctions envisagées, on tranche
**pertinent / pas pertinent**, **faisable / difficile / impossible** (sur iPad,
Safari), et on range en phases. On ne code une fonction que si elle est ici.

Complète `vision-v3.md` (le récit, les inspirations, le moteur audio en détail).

**Usage cible qui sert de juge de paix** : *aider une personne à composer et à
s'entraîner à l'instrument.* Une fonction qui ne sert pas ça = à écarter, même si
elle est « cool ».

Légende — **Pertinent** : ✅ oui · 🤔 à discuter · ❌ non.
**Faisable web/iPad** : ✅ · ⚠️ difficile · ❌ impossible.

---

## A. Harmonie / apprentissage (cœur « Règle à Dadi »)

| Fonction | Inspiration | Pertinent | Faisable | Verdict |
|---|---|---|---|---|
| Roue cycle des quintes, 2 cercles (majeures / relatifs mineurs) | RàD | ✅ | ✅ | **fait**, à polir |
| Accords diatoniques de la tonalité coloriés (I rouge / iii bleu / V jaune / autres verts) | RàD | ✅ | ✅ | **fait** |
| Choix tonalité majeure/mineure par clic sur la roue (cercle ext./int.) | RàD | ✅ | ✅ | **fait** |
| Explorateur natures d'accord (≈15 types) | RàD | ✅ | ✅ | **fait** |
| Explorateur gammes / modes (≈12) | RàD | ✅ | ✅ | **fait** |
| Fenêtres d'analyse : intervalles, accords synonymes, armure, degrés | RàD | ✅ | ✅ | **fait** |
| Manche guitare (plusieurs accordages) + clavier piano | RàD | ✅ | ✅ | **fait** |
| Note explorée distincte de la tonalité de référence (jeu modal) | propre | ✅ | ✅ | **fait** |
| Note de repère jouée au clic (4 temps, fondu) | propre | ✅ | ✅ | **fait** |
| Écoute de l'accord / de l'arpège | RàD | ✅ | ✅ | **fait** |
| Diapason réglable (La3) | RàD | ✅ | ✅ | **fait** |
| Sélecteur de note dédié sur l'écran Accords | propre | ✅ | ✅ | **fait** |
| Suggérer des progressions types dans la tonalité | propre | 🤔 | ✅ | à discuter, phase 4 |

## B. Looper (inspiration *Jam Looper*)

| Fonction | Inspiration | Pertinent | Faisable | Verdict |
|---|---|---|---|---|
| Enregistrement micro d'une boucle | Jam / Loopy | ✅ | ✅ (`AudioWorklet`) | **à refaire** — moteur |
| Overdub : couches par-dessus | Jam / Loopy | ✅ | ✅ | **à fiabiliser** |
| Décompte d'1 mesure avant la 1ʳᵉ boucle | Jam | ✅ | ✅ | **fait** |
| Overdub armé → démarre au début du tour suivant | Loopy | ✅ | ✅ | **fait** |
| Vrai Stop / Lecture (arrêt réel des sources) | Jam / Loopy | ✅ | ✅ | **fait** |
| Volume + mute par couche, en direct | Jam | ✅ | ✅ | **fait** |
| Navigation dans la barre de lecture (tap/glissé pour sauter à un point de la boucle) | usage iPad | ✅ | ✅ | **fait** — contrainte apparue en test : sur une boucle longue (ex. 1min10), attendre le bouclage naturel pour enchaîner un overdub ou réécouter un passage est trop long |
| **Pistes indépendantes** (3–4 boucles séparées, longueurs multiples de la maîtresse) | Jam / Loopy | ✅ | ✅ | **phase 3** |
| Longueur pré-choisie (2 / 4 / 8 mesures) avant d'enregistrer | Jam | ✅ | ✅ | **phase 3** |
| Undo / redo par piste | Loopy | ✅ | ✅ | **phase 3** |
| Quantisation de lancement / arrêt d'une piste (prochain temps ou mesure) | Loopy | ✅ | ✅ | **phase 3** |
| Effets par piste (en plus du master) | Jam / Loopy | ✅ | ✅ | **phase 3** |
| Effets « à sec » : appliqués à la lecture, cuits seulement à l'export | propre / std | ✅ | ✅ | **règle du moteur** |
| Trim début / fin par boucle | Jam / Loopy | 🤔 | ⚠️ (UI forme d'onde) | à discuter, phase 4 |
| Forme d'onde visible par boucle | Loopy | 🤔 | ✅ (canvas) | phase 4 (confort) |
| Métronome paramétrable (BPM saisi au clavier, temps/mesure) | Jam | ✅ | ✅ | **fait** |
| Calage overdub automatique (mesure de latence par clics) | propre | 🤔 | ⚠️ (dépend de l'annulation d'écho iOS) | garder, « best effort » |
| Sauvegarde locale (IndexedDB) + renommer / exporter par entrée | propre | ✅ | ✅ | **fait** |
| Export `.wav` (mixage) | Jam / Loopy | ✅ | ✅ | **fait** |
| Export pistes séparées | Loopy | 🤔 | ✅ | phase 4 |
| **Audio en arrière-plan** (continuer écran verrouillé / app en fond) | Jam / Loopy | ✅ souhaité | ❌ **impossible** (iOS Safari suspend l'audio) | **écarté** — l'app doit rester au 1er plan, écran allumé |
| Sync **Ableton Link** | Loopy | ❌ (hors usage) | ❌ | **écarté** |
| **Mapping MIDI** / contrôleur externe | Loopy | 🤔 | ❌ (**Web MIDI absent sur iOS Safari**) | **écarté sur iPad** |
| Hôte **AUv3** (plugins audio) | Loopy | ❌ | ❌ (le web ne charge pas de plugin natif) | **écarté** |
| Routage inter-apps (IAA) | Loopy | ❌ | ❌ | **écarté** |

## C. Accompagnement (générateur pour répéter)

| Fonction | Inspiration | Pertinent | Faisable | Verdict |
|---|---|---|---|---|
| Suite d'accords jouée en boucle | propre | ✅ | ✅ | **fait** |
| Clavier d'accords diatoniques de la tonalité (rectangle 3×2) | RàD / propre | ✅ | ✅ | **fait** |
| Mode plaqué / arpège ; la durée par accord règle la **vitesse** de l'arpège | propre | ✅ | ✅ | **fait** |
| Continue quand on passe sur l'écran Looper | propre | ✅ | ✅ (app au 1er plan) | **fait** |
| Enregistrer le looper par-dessus, au casque, sans repisser l'accompagnement | propre | ✅ | ✅ | **cible** |
| Édition de la suite : réordonner, durée variable par accord, boucle A/B | propre | 🤔 | ✅ | phase 3 |
| Basse + batterie synthétisées (au-delà des accords) | propre | 🤔 | ✅ | à discuter, phase 4 |
| Styles rythmiques (pop, bossa, ballade…) | propre | 🤔 | ✅ (patterns) | à discuter, phase 4 |

## D. Sampler (inspiration *Loopy Pro*) — phase ultérieure, sous condition

| Fonction | Inspiration | Pertinent | Faisable | Verdict |
|---|---|---|---|---|
| Grille de pads, un extrait par pad | Loopy | ✅ | ✅ | phase 5 |
| Import audio (app Fichiers, glisser-déposer) | Loopy | ✅ | ✅ (`<input type=file>`) | phase 5 |
| Enregistrer un pad au micro | Loopy | ✅ | ✅ | phase 5 |
| Modes de déclenchement : one-shot / maintenu / boucle / bascule | Loopy | ✅ | ✅ | phase 5 |
| Lancement quantifié (prochain temps / mesure) | Loopy | ✅ | ✅ | phase 5 |
| Scènes (une rangée déclenchée d'un coup) | Loopy | ✅ | ✅ | phase 5 |
| Groupes d'étouffement (choke) | Loopy | ✅ | ✅ | phase 5 |
| Pitch ± demi-tons (`playbackRate`, hauteur + vitesse liées) | Loopy | ✅ | ✅ | phase 5 |
| Découpe (chop) d'un extrait en N tranches réparties sur les pads | Loopy | ✅ | ✅ | phase 5 |
| Pitch **sans** changer la vitesse | Loopy | 🤔 | ⚠️ (worklet phase-vocoder) | phase 6 |
| Time-stretch pour caler un extrait au tempo | Loopy | 🤔 | ⚠️ (idem) | phase 6 |
| Canevas libre (widgets placés / redimensionnés) | Loopy | 🤔 | ✅ (`div` absolus) | phase 6 — grille d'abord |
| Bibliothèque de jeux de samples | Loopy | ✅ | ⚠️ (quota IndexedDB iOS ≈ 1 Go, évictable) | phase 5, avec garde-fous |
| Séquenceur MIDI sur le canevas | Loopy | ❌ | ⚠️ (moteur oui, sortie MIDI iPad non) | **écarté** |

## E. Transversal

| Fonction | Pertinent | Faisable | Verdict |
|---|---|---|---|
| Tempo / transport **unique** partagé entre tous les modes | ✅ | ✅ | **cible archi** |
| Un seul `AudioContext` + bus master + effets master | ✅ | ✅ | **cible archi** |
| Seul le mode actif branché au graphe audio (économie CPU) | ✅ | ✅ | **cible archi** |
| Installable comme app sur iPad (PWA) | ✅ | ✅ | fait (v1) |
| Fonctionne hors ligne | ✅ | ✅ (service worker) | fait (v1) |
| Déploiement `git push` sans étape de build | ✅ | ✅ | **maintenu** |
| Découpage en modules ES (toujours statique, pas de build) | ✅ | ✅ | **phase 2** |
| Écrans : Harmonie / Looper (+ Sampler plus tard), nav claire | ✅ | ✅ | fait (v2) |
| Sauvegarde d'un **projet** complet (pistes + suite + réglages + tempo) | ✅ | ✅ | phase 3–4 |
| Wake Lock (garder l'écran allumé pendant une session) | ✅ | ⚠️ (support iOS partiel) | phase 3, best effort |
| Thème clair / sombre | 🤔 | ✅ | phase 4 |

## F. Moteur audio — exigences (détaillées dans `vision-v3.md` §2)

- Capture micro par **`AudioWorklet`** (thread temps-réel, insensible au rendu).
- **Enregistrer à sec** ; effets uniquement à la lecture, cuits à l'export.
- Boucles : longueur en **échantillons exacts**, `loopEnd` aligné, **micro-fondu
  3–5 ms** au raccord, toutes les couches sur un échantillon 0 commun.
- Métronome / décompte routés **hors** du chemin d'enregistrement.
- Communication worklet → main **par messages** (`SharedArrayBuffer` indisponible
  sans en-têtes COOP/COEP, que GitHub Pages ne pose pas).
- Accepter ≈ 20–40 ms de latence aller-retour sur iOS ; compensation réglable ;
  pas de monitoring « tight » temps réel → **casque** recommandé.

## Limites web à assumer (iPad / Safari) — ne pas re-tenter

| Limite | Conséquence | Contournement |
|---|---|---|
| Pas d'audio en arrière-plan / écran verrouillé | l'app doit rester au 1er plan pendant looper & sampler | prévenir ; Wake Lock partiel |
| Web MIDI absent | aucun contrôleur MIDI sur iPad | tout au tactile |
| Pas d'AUv3 / IAA / Ableton Link | pas d'intégration avec d'autres apps audio | export `.wav` pour aller ailleurs |
| Quota stockage ≈ 1 Go, évictable | bibliothèque de samples limitée | avertir + export manuel des jeux |
| Latence 20–40 ms | monitoring direct imparfait | compensation + casque |
| `getUserMedia` = 1 autorisation Safari | inévitable | déclenchée au 1er appui sur REC |
| Fichiers : `<input>` + téléchargement seulement | pas de « dossier de travail » persistant | IndexedDB comme magasin |

## Phases

1. **Moteur audio `AudioWorklet`** isolé et testable seul : capture propre,
   boucle sans couture, effets à la lecture. *Bloquant — rien d'autre avant.*
2. **Modules ES** (sans build) + intégration du nouveau moteur dans v2 ;
   v2 remplace `index.html`.
3. **Looper repensé** : pistes indépendantes, longueur pré-choisie, undo/redo,
   quantisation, effets par piste, sauvegarde de projet.
4. **Confort** : formes d'onde, trim, thème, export pistes, édition de la suite
   d'accompagnement, styles rythmiques.
5. **Sampler** : grille de pads, import, enregistrement, déclenchement quantifié,
   scènes, chop, pitch simple.
6. **Sampler avancé** : pitch/time-stretch indépendants, canevas libre.

## Hors périmètre (pour éviter la dérive)

- Hébergement de plugins (AUv3), MIDI, Ableton Link, audio inter-apps.
- Édition audio destructive fine dans une timeline (couper/coller à l'échantillon).
- Séquenceur pas-à-pas de batterie complet (grille de pads + patterns simples suffisent).
- Notation / partitions.
- Comptes, cloud, collaboration.
- App native, Capacitor, store (tranché : on reste web, `git push`).
