# GardeFou, prototype

L'anti-arnaque qui protège toute la famille. Prototype de démonstration pour le Hackathon 36h Chrono : deux téléphones, celui de **Monique** (la personne protégée) et celui de **Julie** (l'aidante), reliés en direct. Aucun vrai appel ni SMS : tout est simulé.

Adresse de l'appli : **https://djebrilelfeddi.github.io/gardefou/**

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Toute l'appli. Les textes, noms, numéros et prix sont regroupés en haut, dans `CONFIG`. |
| `config.js` | Configuration Firebase (liaison entre les deux téléphones). |
| `sw.js` | Service worker : appli hors ligne et mises à jour. |
| `manifest.webmanifest`, `icons/` | Installation sur l'écran d'accueil, en plein écran. |
| `.github/workflows/publier.yml` | À chaque envoi sur `main`, numérote la version et publie sur GitHub Pages. |
| `firebase-regles.json` | Règles à coller dans Firebase. |

## Mise en place (une seule fois)

1. **GitHub Pages** : dépôt > Settings > Pages > Source : **GitHub Actions**.
2. **Firebase** (gratuit) : [console.firebase.google.com](https://console.firebase.google.com) > Ajouter un projet.
   - Build > **Realtime Database** > Créer une base (Belgique, `europe-west1`) > mode verrouillé.
   - Onglet **Règles** : collez le contenu de `firebase-regles.json`, puis Publier.
   - Paramètres du projet > Vos applications > icône **Web `</>`** > enregistrez l'appli, puis copiez `apiKey`, `authDomain`, `databaseURL`, `projectId`, `appId` dans `config.js`.
3. Envoyez la modification sur `main` : l'appli est en ligne 1 à 2 minutes plus tard.

## Installer sur un téléphone Android

1. Ouvrez l'adresse dans **Chrome**.
2. Menu ⋮ > **Ajouter à l'écran d'accueil** (ou **Installer l'appli**).
3. Ouvrez GardeFou depuis son icône, choisissez **Monique** sur un téléphone et **Julie** sur l'autre, avec le **même code de démo**.
4. « Relié au téléphone de… » s'affiche quand les deux sont connectés. L'appli rouvre ensuite directement le dernier rôle choisi.

## Mises à jour

- **Automatiques** : chaque envoi sur `main` crée une version `1.0.N` et un `version.json`. L'appli le vérifie au démarrage, au retour dans l'appli et toutes les 3 minutes.
  - Au démarrage, ou au retour après 30 secondes hors de l'appli, elle se met à jour toute seule **si aucune démo n'est en cours**.
  - Pendant un appel, un écran STOP ou une alerte, elle ne se recharge jamais : une bannière « Nouvelle version » propose la mise à jour.
- **Manuelles** : bouton carré □ en bas à droite > **Rechercher une mise à jour** (la version installée est affichée à côté), ou « Mettre à jour » sur l'écran de choix du rôle.
- Le message du commit s'affiche dans la bannière : écrivez des messages courts et clairs.

## Faire la démo

Le bouton carré □ ouvre les commandes de démonstration (faux SMS, faux appel inconnu, appli bancaire pendant l'appel, remise à zéro). La ligne « Liaison » en haut du menu indique si les deux téléphones sont reliés. Sans liaison, Julie peut simuler une alerte depuis son propre menu □.

## Tester sur un ordinateur

Ouvrez `index.html` dans un navigateur et choisissez **Les deux téléphones sur cet écran**.
