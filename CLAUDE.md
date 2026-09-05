# DadiLooper — état du projet

Voir `.claude/skills/dadilooper/SKILL.md` pour le rituel de travail (éditer →
vérifier → commit → push → attendre le déploiement → confirmer) et les
conventions (fichiers, audio, tactile). Ce fichier sert de relais entre les
sessions : il résume où en est le projet et ce qu'il reste à valider.

## Dernier travail (session du 5 sept. 2026)

Tout est commité et poussé sur `main`, en ligne sur
`https://floberry36.github.io/DadiLooper/v2.html` :

- Looper migré vers `AudioWorklet` (fini les glitchs du `ScriptProcessorNode`),
  boucle testée sans souci sur 1min10.
- Suppression d'une couche d'overdub individuelle par glissement (glisser la
  couche vers la gauche découvre un bouton ✕).
- Barre de progression naviguable (tap/glissé pour sauter dans la boucle,
  poignée agrandie) — ajouté au cahier des charges comme contrainte apparue à
  l'usage (boucles longues, attendre le bouclage naturel était trop lent).
- Boutons SCRUD + barre de lecture toujours visibles (grisés si vide, "Vide"
  à la place d'un nom de couche) au lieu d'apparaître/disparaître.
- Bouton ⚙ Réglages sur l'écran Looper : choix de l'apparence (Crème / Pédale
  de scène / Régie de nuit / Étui bois), persisté en local. Texte de l'écran
  Looper agrandi d'environ 20%. Les liserés fins autour de la roue (SVG) ne
  sont pas encore adaptés aux habits sombres — resteront peu visibles pour
  l'instant, à peaufiner une fois l'habit préféré choisi.
- Pad vert (lecture) : rond, même traitement visuel que le pad rouge (anneau
  + bombé satiné), à 2/3 de sa taille — la version triangle a été abandonnée
  (trop de complications avec le `clip-path`, moins jolie).
- Bug corrigé : en mode mineur, le VII (ex. Sol en La mineur) restait éteint
  à tort sur la roue — `keyDiatonic()` écartait systématiquement le 7e degré
  en le supposant toujours diminué (vrai en majeur, faux en mineur naturel).

## À faire en priorité

L'utilisateur va faire une passe de tests plus poussée sur l'iPad, en se
concentrant sur l'**ergonomie** (ce qui marche bien / moins bien à l'usage),
pas seulement la fonction : overdub normal, overdub arrêté en cours de route,
calibration auto de latence, les 3 nouveaux habits sombres, la nouvelle barre
naviguable, la suppression de couche. **Ne pas repartir sur une nouvelle
fonctionnalité avant ce retour.**
