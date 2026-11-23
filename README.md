# StudyHub — ISET Nabeul

Version statique de StudyHub publiée dans le dépôt **portfolio-num-rique-**.

## Contenu
- Mind map interactif des six matières.
- Recherche instantanée dans les matières.
- Dix raccourcis directs vers les classes Google Classroom partagées.
- Design responsive pour ordinateur, tablette et mobile.

## Google Classroom
Les dix URL de classes déjà communiquées sont intégrées dans `script.js`. Les liens ouvrent Google Classroom dans un nouvel onglet. L'utilisateur doit être connecté au compte Google autorisé.

Cette version affiche des raccourcis vers Classroom ; elle ne synchronise pas automatiquement les devoirs ou fichiers. Une synchronisation réelle nécessite Google Classroom API et OAuth 2.0.

## GitHub Pages
Le site utilise les fichiers statiques à la racine du dépôt. Dans **Settings → Pages**, sélectionner **Deploy from a branch**, branche `main`, dossier `/(root)`, puis enregistrer.

URL attendue : https://bensassiachraf4-cell.github.io/portfolio-num-rique-/

## Fichiers
- `index.html` : structure du site
- `style.css` : design responsive
- `script.js` : interactions et liens Classroom