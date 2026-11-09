# Empereur, Citoyen, Esclave

Le projet reprend l'interface originale du dépôt : fond slate, accents ambre, navigation simple et composants Tailwind. Le HTML initial a été étendu pour intégrer le jeu et l'historique sans remplacer l'identité visuelle.

## Lancer le projet
1. Décompresser le dossier et l'ouvrir dans VS Code.
2. Lancer `index.html` avec Live Server (les modules JavaScript doivent être servis en HTTP).
3. Créer un profil, le sélectionner, puis ouvrir l'onglet « Jouer ».

Les données sont conservées dans le LocalStorage du navigateur. Les clés `players` et `activePlayer` de la première version sont conservées afin de retrouver les profils déjà créés ; les nouvelles parties sont enregistrées dans `history`.

## Fonctionnalités
- Profils : création, modification, suppression avec confirmation, unicité du pseudo sans distinction de casse, sélection du joueur et nombre de parties.
- Jeu : 12 manches, camps alternés tous les trois tours, alternance du camp qui commence, égalités avec retrait des deux cartes, animation et verrouillage des clics, points 1 côté Empereur et 5 côté Esclave.
- Historique : enregistrement en fin de partie, tri récent, recherche insensible à la casse, filtres combinés par résultat et période, suppression d'une partie. Les parties restent visibles sous « Joueur supprimé » après suppression du profil.
- Responsive : mise en page adaptée aux petits écrans.

## Organisation
- `index.html` : structure HTML et navigation.
- `src/main.js` : événements et coordination de l'application.
- `src/ui.js` : affichage des profils, de la main et de l'historique.
- `src/game.js` : règles et fonctions du jeu, sans accès au DOM.
- `src/player.js` : gestion des profils.
- `src/history.js` : enregistrement, recherche et filtres.
- `src/storage.js` : accès LocalStorage.
- `src/input.css` : entrée Tailwind conservée du projet initial.
- `src/output.css` : feuille CSS compilée originale, complétée avec les composants de l'interface slate/ambre.
- `src/game-page.js` : ancien prototype conservé comme référence, non chargé par l'application.

## Tests
Avec Node.js installé, lancer `npm test`. Les tests vérifient les relations du duel, les mains, la copie des tableaux, les points et l'alternance des camps.

## Git conseillé
Conserver `main` pour la version stable et `develop` pour l'intégration. Créer une branche par fonctionnalité, ouvrir une Pull Request vers `develop`, demander une relecture, puis fusionner après validation. Publier `main` sur GitHub Pages.
