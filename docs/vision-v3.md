# DadiLooper — vision v3

État des lieux et plan technique, après les tests « en conditions réelles ».
Ce document sert de repère : il n'engage rien tant qu'on ne l'a pas validé point par point.

---

## 1. Ce qu'on veut vraiment (recadrage)

Un seul outil, pour iPad, déployé simplement (dépôt GitHub public, fichiers
statiques lisibles comme une app), qui combine :

| Pilier | Rôle | Inspiration |
|---|---|---|
| **Harmonie** | aide à la composition et à l'apprentissage : cycle des quintes, accords diatoniques de la tonalité, manche / clavier, explorateur accords / gammes, accompagnement pour répéter | *la Règle à Dadi* |
| **Looper** | enregistrer / superposer des boucles micro, calées au tempo, avec effets, sauvegarde / export | *Jam Looper* |
| **Sampler** | déclencher des extraits audio (enregistrés ou importés) en grille, calés au tempo, pour se faire un fond et jouer par-dessus | *Loopy Pro* |

L'idée n'a pas dérivé : elle s'est **précisée**. La structure à écrans dédiés
(un pour la compo/entraînement, un pour la production) est validée par les tests.
Ce qui coince, c'est la **qualité audio du looper** et quelques interactions.

---

## 2. Le point bloquant : le moteur audio

### Diagnostic
Le looper capture le micro avec **`ScriptProcessorNode`**, une API dépréciée qui
tourne sur le **thread principal**. Dès que l'affichage travaille (redessin,
ramasse-miettes, reconstruction de listes), le flux audio saute → **freezes,
craquements, « déchirements de bande », bips**. Les autres loopers n'ont pas ça
parce qu'ils traitent l'audio sur un thread temps-réel dédié.

S'ajoutent :
- clic au **point de bouclage** (longueur pas calée à l'échantillon, pas de
  micro-fondu au raccord) ;
- artefacts des **effets** appliqués *pendant* l'enregistrement ;
- **métronome / décompte** qui peut passer dans le fichier.

### La solution : rester web, changer de moteur
`AudioWorklet` remplace `ScriptProcessorNode` : le traitement tourne sur le
thread audio temps-réel, **insensible aux ralentissements de l'affichage**.
Supporté sur iOS Safari 14.5+. Le déploiement ne change pas (fichiers statiques,
PWA, `git push`).

Principes à adopter, comme les vrais loopers :
1. **Enregistrer à sec.** Les effets ne s'appliquent qu'à la lecture, et ne sont
   « cuits » que dans l'export. Supprime une classe entière d'artefacts.
2. **Boucle sans couture** : longueur en **nombre d'échantillons exact**,
   `loopEnd` aligné, micro-fondu de 3–5 ms au raccord, toutes les couches
   démarrent d'un échantillon 0 commun.
3. **Métronome hors du chemin d'enregistrement** : sortie séparée, jamais mélangée
   à ce qui est capté ; recommandation écouteurs pour l'overdub.
4. **Pas de gros travail sur le thread principal pendant l'enregistrement**
   (pas de reconstruction DOM des couches, rendu différé).

### Autres routes techniques envisagées (et pourquoi non)

| Route | Son | Déploiement | Verdict |
|---|---|---|---|
| Web + `AudioWorklet` | ⭐⭐⭐⭐ | inchangé | **retenu** |
| App native iOS (Swift / AudioKit) | ⭐⭐⭐⭐⭐ | Xcode + compte dev 99 $/an + App Store/TestFlight | non : casse la simplicité |
| Capacitor (web emballé en natif) | ⭐⭐⭐⭐ | build Xcode + TestFlight par version | non : friction de mise à jour |
| `MediaRecorder` seul | ⭐⭐⭐ | inchangé | partiel : blob compressé, overdub calé plus dur |

---

## 3. Revue des fonctions du looper (esprit *Jam Looper*)

*Jam Looper* : multi-pistes (4, puis 8 en Pro), timeline visuelle, longueur de
boucle pré-choisie, modes de boucle multiples, métronome, trim par piste, effets
par piste, export.

### À garder / consolider
- Décompte d'une mesure avant la 1ʳᵉ boucle ; overdub armé qui démarre au tour
  suivant (déjà en place, à fiabiliser avec le nouveau moteur).
- Volume + mute par couche, en direct.
- Sauvegarde locale (IndexedDB) + export `.wav`, renommer.
- Métronome paramétrable (BPM, temps/mesure) partagé avec l'accompagnement.

### À revoir / ajouter
- **Pistes indépendantes** plutôt qu'un seul empilement : 3–4 boucles séparées
  (ex. batterie / basse / accords / mélodie), chacune avec son propre
  enregistrement, mute, volume, longueur (multiple de la boucle maîtresse).
- **Longueur pré-choisie** : « 2 / 4 / 8 mesures » avant d'enregistrer, plutôt que
  « la 1ʳᵉ prise fixe tout ».
- **Trim** début / fin par boucle (poignées sur la forme d'onde).
- **Undo / redo** par piste (pas seulement « annuler la dernière »).
- **Quantisation** de lancement : une piste démarre/s'arrête au prochain temps
  ou à la prochaine mesure.
- **Forme d'onde** visible par boucle (repère visuel du contenu).
- Effets : choix **par piste** en plus du master.
- Export : mixdown **et** pistes séparées (déjà proposé).

---

## 4. Concept : un sampler dans le même esprit (*Loopy Pro*) — **phase ultérieure, sous condition**

> Décision (sept. 2026) : **un seul projet**, mais le sampler n'est pas construit
> tant que Harmonie + Looper ne sont pas solides. Les modes ne tournant jamais en
> même temps, la charge processeur n'est pas le vrai risque ; l'archi partage un
> seul `AudioContext` / transport / bus master, et seul le mode actif est branché.
> La lecture de samples (`AudioBufferSourceNode`) est le point le **moins** risqué
> côté qualité. Le vrai enjeu est ergonomique : garder chaque mode focalisé.
>
> **Enregistrer en jouant les samples en même temps** : oui, c'est le flux
> standard. Avec un **casque**, le fond (samples / accompagnement) part dans le
> casque et **pas dans l'air** → le micro ne capte que l'instrument acoustique, la
> piste enregistrée est propre, et elle est déjà calée puisque tout partage le même
> transport. Côté web, la capture micro (`AudioWorklet`) et la sortie de l'app sont
> deux chemins séparés : le numérique enregistré ne contient jamais la sortie de
> l'app — seule une fuite acoustique par le haut-parleur pourrait polluer, que le
> casque supprime.


*Loopy Pro* : un **canevas** de widgets déclenchables (boucles, one-shots,
boutons, curseurs, XY, découpe de clips, grilles), tout calé au tempo,
jouable en live ; lancement de clips, scènes, séquenceur MIDI, hôte AUv3.

### Version web réaliste (sans plugins AUv3)

**Grille de pads** (démarrage simple ; canevas libre plus tard) :
- chaque pad contient un extrait audio : **enregistré au micro** ou **importé**
  (Fichiers, glisser-déposer, URL) ;
- **modes de déclenchement** par pad : one-shot · maintenu (gate) · boucle ·
  bascule ;
- **lancement quantifié** : le pad démarre au prochain temps / à la prochaine
  mesure (clip-launching façon session Ableton) ;
- **scènes** : une rangée de pads déclenchée d'un coup ;
- par pad : volume, pan, **hauteur** (± demi-tons), trim début/fin, **reverse**,
  **groupes d'étouffement** (choke) ;
- **découpe** : chop d'un extrait en N tranches réparties sur les pads
  (parfait pour un break de batterie) ;
- master : tempo, métronome, effets master, **enregistrement de la performance**
  vers un fichier ;
- persistance : **jeux de samples** en IndexedDB, comme la bibliothèque du looper.

### Faisabilité
- Jouer des samples = `AudioBufferSourceNode` → **solide, aucun glitch** (contrairement
  à la capture micro). Un sampler est techniquement **moins risqué** que le looper
  côté qualité.
- Pitch sans changer la vitesse = worklet phase-vocoder (moyen) ; sinon
  `playbackRate` (hauteur + vitesse liées, acceptable au début).
- Time-stretch pour caler au tempo = phase-vocoder (plus tard, optionnel).
- Canevas libre = `div` en position absolue ; la grille d'abord.

---

## 5. Comment tout s'articule

**Une seule app, trois modes**, tempo et transport communs :

```
┌───────────────────────────────────────────────┐
│  [ Harmonie ]  [ Looper ]  [ Sampler ]        │  ← barre de modes
├───────────────────────────────────────────────┤
│  Harmonie = roue + manche + accords/gammes     │
│             + accompagnement (référence,       │
│             toujours consultable)              │
│  Looper   = pistes de boucles micro            │
│  Sampler  = grille de pads / scènes            │
├───────────────────────────────────────────────┤
│  Tempo · métronome · master FX · enregistrer   │  ← transport commun
└───────────────────────────────────────────────┘
```

La couche « pédagogique » (Règle à Dadi) est ce qui rend cet outil unique par
rapport à Jam Looper / Loopy Pro : on **compose et on apprend** en même temps
qu'on fait de la boucle.

---

## 6. Conteneur technique

Aujourd'hui : un seul `index.html` de ~2500 lignes. Ça marche mais devient dur à
maintenir, et un worklet **doit** de toute façon être un fichier à part.

Proposition — toujours 100 % statique, toujours `git push` pour déployer :

```
index.html            ← page + styles + point d'entrée <script type="module">
js/theorie.js         ← notes, accords, gammes, cycle des quintes
js/audio-engine.js    ← contexte, transport, tempo, bus, master FX
js/looper-worklet.js  ← AudioWorklet : capture / lecture sans couture
js/looper.js          ← pistes, overdub, sauvegarde
js/sampler.js         ← pads, scènes, découpe (phase 2)
js/ui/*.js            ← rendu des écrans
sw.js, manifest.webmanifest, icon-*.png   ← PWA (déjà en place)
```

Pas de build : les modules ES natifs se chargent directement sur GitHub Pages
(même origine). Option build (esbuild) seulement si le besoin s'en fait sentir.

---

## 7. Feuille de route proposée

1. **Nouveau moteur audio** (`AudioWorklet`) — isolé, testable seul : capture
   propre, boucle sans couture, effets à la lecture. *C'est le point make-or-break.*
2. **3 corrections d'interaction** (faites) : note seule sur la roue, tonalités
   mineures cliquables, timing d'arpège = vitesse.
3. **Looper repensé** : pistes indépendantes, longueur pré-choisie, trim, undo/redo,
   quantisation, formes d'onde.
4. **Découpage en modules** (au fil de l'eau, sans build).
5. **Sampler** : grille de pads, import, déclenchement quantifié, scènes, chop.
6. Polissage visuel et ergonomique.

Rien n'est lancé tant que ce document n'est pas validé.
