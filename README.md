# La Règle à Dadi — réplique numérique

Réplique interactive, en un seul fichier HTML, de la règle à calcul harmonique
de Marcel Dadi et Max Meyer : molette de fondamentale, natures d'accords,
gammes et modes, positions sur guitare (plusieurs accordages) et clavier,
lecture des intervalles, accords synonymes, armure et tonalité relative.

Comprend aussi une sortie audio (synthèse WebAudio, diapason réglable) et un
**looper micro à couches multiples** (overdub) enregistrant depuis le
microphone.

## Utilisation

Ouvrir `index.html`. Pour le looper, la page doit être servie en **HTTPS**
(ou `http://localhost`) : le microphone est bloqué par les navigateurs depuis
un fichier local ou une origine non sécurisée.

Version en ligne : https://floberry36.github.io/DadiLooper/

## Technique

Aucune dépendance, aucun serveur, aucune donnée envoyée. Tout tourne dans le
navigateur. Seule ressource externe : les polices Google Fonts (repli système
si absentes).
