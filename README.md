# StudyHub — ISET Nabeul

Plateforme de révision pour la **1ère année Informatique Technologique à l'ISET Nabeul**, publiée avec GitHub Pages.

## Matières
- Digital Skills
- Fundamental IT
- Système électrique
- TP ISET Nabeul

## Fonctionnalités disponibles
- Fiches de révision et notions essentielles par matière.
- Cartes mentales à partir des notions de chaque fiche.
- Lecture audio des fiches par synthèse vocale du navigateur (Web Speech API).
- Liens de recherche vidéo YouTube associés aux matières.
- Connexion Google OAuth en lecture seule pour afficher les classes, supports et devoirs Google Classroom accessibles.
- Import de PDF depuis l'appareil et extraction du texte dans le navigateur avec PDF.js.
- Sauvegarde locale des résumés importés dans le navigateur.

## Publication GitHub Pages
Dépôt : https://github.com/bensassiachraf4-cell/portfolio-num-rique-
Site : https://bensassiachraf4-cell.github.io/portfolio-num-rique/

La publication doit utiliser la branche `main` et le dossier racine `/(root)`.

## Configuration Google Classroom
Le client OAuth est configuré dans `index.html`. Dans Google Cloud Console :
1. Activer l'API Google Classroom.
2. Configurer l'écran de consentement OAuth et autoriser le compte étudiant si l'application est en mode test.
3. Dans le client OAuth de type « Application Web », ajouter l'origine JavaScript autorisée : `https://bensassiachraf4-cell.github.io`.
4. Autoriser les scopes de lecture : `classroom.courses.readonly`, `classroom.courseworkmaterials.readonly` et `classroom.coursework.me.readonly`.

Aucun secret OAuth n'est placé dans le dépôt. Le jeton d'accès est conservé uniquement en mémoire pendant la session.

## Limites actuelles
- L'audio est lu avec la synthèse vocale de l'appareil : aucun MP3 studio n'est encore généré ou hébergé.
- Les vidéos sont des liens vers les résultats YouTube, pas des vidéos de cours personnalisées déjà produites.
- Les fiches de démarrage sont des rappels généraux à vérifier avec les supports officiels des enseignants.
- L'import PDF produit un résumé local simple ; les PDF scannés nécessitent une étape OCR.
- Les documents et résumés enregistrés dans localStorage restent sur le navigateur utilisé et ne sont pas synchronisés entre appareils.

## Technologies
HTML, CSS, JavaScript, Google Identity Services, Google Classroom REST API, PDF.js, Web Speech API, GitHub Pages.
