import type { CourseResource, StudentProfile } from '../types/portfolio';

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  fullName: 'Achraf Ben Sassi',
  filiere: '1ère Année TI — Fondamental IT & Systèmes Électriques',
  campus: 'ISET Nabeul',
  githubUsername: 'achraf-bensassi',
  repoName: 'portfolio-numerique',
  bio: "Étudiant en 1ère année à l'ISET Nabeul. Ce portfolio numérique rassemble mes travaux pratiques, résumés de cours, podcasts audio, vidéos explicatives et projets réalisés dans les modules Digital Skills, Développement, Systèmes d'exploitation et Systèmes Électriques.",
};

export const EVALUATION_RUBRIC = [
  {
    critere: 'Contenu de chaque module (exactitude, complétude)',
    points: 8,
  },
  {
    critere: 'Qualité et variété des productions (visuel, audio, vidéo, code)',
    points: 4,
  },
  {
    critere: "Usage maîtrisé de l'IA (prompts, vérification, transparence)",
    points: 3,
  },
  {
    critere: 'Site web (structure, design, interactivité, GitHub Pages)',
    points: 3,
  },
  {
    critere: 'Présentation orale et capacité à expliquer son travail',
    points: 2,
  },
];

export const FINAL_CHECKLIST = [
  { id: 'c1', label: 'Le site est accessible en ligne via GitHub Pages' },
  { id: 'c2', label: 'Une page existe pour chaque module (Digital Skills, IT, Systèmes, TP)' },
  { id: 'c3', label: 'Chaque production indique les outils utilisés (Fiche Transparence IA)' },
  { id: 'c4', label: 'Les sources officielles sont citées et vérifiées' },
  { id: 'c5', label: "Aucun mot de passe, clé API ou donnée personnelle n'est publié" },
  { id: 'c6', label: 'Le README.md est complet (nom, filière, outils, lien du site)' },
  { id: 'c7', label: 'Le site fonctionne correctement sur téléphone (responsive)' },
  { id: 'c8', label: 'La présentation orale de 5 minutes est préparée' },
];

export const MALWARES = [
  {
    name: 'Virus',
    definition:
      "Programme malveillant qui s'attache à un fichier sain (exécutable, macro) et se propage lorsque l'utilisateur ouvre ce fichier.",
    impact: 'Altération ou suppression de fichiers, ralentissement du système.',
  },
  {
    name: 'Ver (Worm)',
    definition:
      "Logiciel autonome capable de se dupliquer et de se propager automatiquement à travers un réseau sans intervention humaine.",
    impact: 'Saturation de la bande passante et propagation rapide sur le campus.',
  },
  {
    name: 'Cheval de Troie (Trojan)',
    definition:
      "Programme déguisé en logiciel légitime (utilitaire gratuit, fichier cracké) qui installe discrètement une porte dérobée.",
    impact: "Prise de contrôle à distance ou installation d'autres malwares.",
  },
  {
    name: 'Ransomware (Rançongiciel)',
    definition:
      'Logiciel qui chiffre tous les documents personnels ou professionnels et exige une rançon pour fournir la clé de déchiffrement.',
    impact: 'Perte totale des cours, TP et données sans sauvegarde hors ligne.',
  },
  {
    name: 'Spyware (Logiciel espion)',
    definition:
      "Programme discret qui collecte les habitudes de navigation, frappes clavier (keylogger) ou identifiants à l'insu de l'utilisateur.",
    impact: 'Vol de mots de passe, comptes étudiants et données bancaires.',
  },
];

export const CYBER_QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: "J'utilise un mot de passe unique et long (12+ caractères) pour chacun de mes comptes importants.",
    tip: 'Utilisez un gestionnaire de mots de passe (Bitwarden, KeePassXC) pour éviter la réutilisation.',
  },
  {
    id: 'q2',
    question: "L'authentification à deux facteurs (2FA) est activée sur mon compte Google Classroom, GitHub et e-mail.",
    tip: "Préférez une application TOTP (Google Authenticator, Aegis) aux SMS dès que possible.",
  },
  {
    id: 'q3',
    question: "Je vérifie systématiquement l'adresse complète de l'expéditeur et l'URL avant de cliquer sur un lien reçu par e-mail.",
    tip: "Le hameçonnage (phishing) imite les logos officiels avec un domaine légèrement modifié.",
  },
  {
    id: 'q4',
    question: "Mon système d'exploitation (Windows/Linux) et mon navigateur sont tenus à jour automatiquement.",
    tip: 'Les mises à jour corrigent les failles critiques exploitées par les vers et ransomwares.',
  },
  {
    id: 'q5',
    question: 'Je dispose de sauvegardes régulières de mes TP et projets sur un disque externe ou un cloud chiffré.',
    tip: 'Appliquez la règle 3-2-1 : 3 copies, 2 supports différents, 1 copie hors site.',
  },
  {
    id: 'q6',
    question: "Sur un Wi-Fi public (café, campus ouvert), j'évite les opérations sensibles ou j'utilise un VPN fiable.",
    tip: 'Les réseaux ouverts exposent le trafic non chiffré aux attaques Man-in-the-Middle.',
  },
  {
    id: 'q7',
    question: 'Je ne publie jamais de clés API, mots de passe ou jetons OAuth dans un dépôt GitHub public.',
    tip: 'Utilisez un fichier .env ignoré via .gitignore et des secrets côté serveur.',
  },
  {
    id: 'q8',
    question: "Je n'installe jamais de logiciels ou de clés d'activation piratés (sources de chevaux de Troie).",
    tip: 'Privilégiez les versions gratuites, open source (VS Code, LibreOffice, KiCad) ou licences éducatives.',
  },
];

export const PROMPT_CASES = [
  {
    id: 'case1',
    title: 'Cas 1 — Comprendre les pointeurs en Langage C',
    tool: 'Claude / Gemini',
    weakPrompt: 'Explique les pointeurs en C.',
    weakResult:
      'Réponse théorique très dense et abstraite parlant d’adressage mémoire sans exemple progressif ni analogie adaptée à un débutant.',
    improvedPrompt:
      "Rôle : Tu es un enseignant en informatique à l'ISET Nabeul. Contexte : Je suis étudiant de 1ère année et je débute en langage C. Tâche : Explique le concept de pointeur (opérateurs & et *) avec une analogie simple (boîte aux lettres), puis donne un exemple commenté de 10 lignes qui échange deux entiers via une fonction. Format : 1 analogie courte, 1 bloc de code C compilable avec gcc, 2 erreurs classiques à éviter.",
    improvedResult:
      'Explication limpide avec schéma mémoire adresse/valeur, fonction swap(int *a, int *b) complète, et rappel sur le déréférencement de pointeur NULL.',
    analysis:
      "L'ajout du rôle, du niveau (1ère année ISET), des contraintes de format et de la demande d'erreurs fréquentes transforme une définition générique en fiche de révision exploitable en TP.",
  },
  {
    id: 'case2',
    title: 'Cas 2 — Analyser un circuit électrique diviseur de tension',
    tool: 'ChatGPT / Perplexity',
    weakPrompt: 'Calcule la tension de sortie R1=10k R2=10k.',
    weakResult:
      'Donne juste une valeur numérique sans préciser le schéma, la tension d’entrée supposée, ni la formule générale.',
    improvedPrompt:
      "Rôle : Assistant de TP en Systèmes Électriques. Contexte : Montage pont diviseur de tension alimenté en Vin = 12 V DC avec R1 = 10 kΩ (côté +) et R2 = 10 kΩ (côté masse). Tâche : Calcule pas à pas Vout, le courant I qui traverse les résistances et la puissance dissipée. Format : Étapes numérotées avec unités SI, puis tableau récapitulatif et vérification avec la loi d'Ohm.",
    improvedResult:
      'Détail complet : Vout = 12 * 10k / (10k + 10k) = 6 V, I = 0,6 mA, P = 7,2 mW, avec vérification de la somme des tensions.',
    analysis:
      'Préciser les grandeurs d’entrée, les unités et le raisonnement étape par étape évite les ambiguïtés et permet de vérifier chaque calcul.',
  },
  {
    id: 'case3',
    title: 'Cas 3 — Déboguer une page HTML/CSS responsive pour GitHub Pages',
    tool: 'Claude / Gemini',
    weakPrompt: 'Mon menu casse sur téléphone, corrige mon CSS.',
    weakResult:
      'Propose des règles CSS génériques sans savoir si la barre utilise Flexbox ou Grid, ni les classes exactes du projet.',
    improvedPrompt:
      "Rôle : Développeur front-end senior. Contexte : Site statique HTML5/CSS3 hébergé sur GitHub Pages. Problème : Sur mobile (< 640px), les 5 liens de navigation débordent horizontalement. Contraintes : Utiliser uniquement CSS pur (Flexbox + media query @media (max-width: 640px)) et un bouton menu accessible, sans framework externe. Format : Code CSS commenté + explication de 3 lignes.",
    improvedResult:
      'Fournit une media query propre passant la navigation en colonne escamotable avec bouton aria-expanded.',
    analysis:
      'Décrire la contrainte technique (CSS pur, seuil 640px, accessibilité) évite d’importer des bibliothèques inutiles et donne un code prêt à intégrer dans VS Code.',
  },
];

export const REUSABLE_PROMPTS = [
  {
    title: '1. Fiche de révision structurée avant examen',
    prompt:
      "Agis comme un tuteur universitaire à l'ISET. Résume le cours suivant pour un étudiant de 1ère année en 3 parties : (1) 5 concepts clés en une phrase chacun, (2) les formules ou commandes à mémoriser, (3) 3 questions d'entraînement avec corrigé caché. N'invente rien hors du texte fourni : [COLLER LE COURS].",
  },
  {
    title: '2. Débogage guidé Python / C sans solution toute faite',
    prompt:
      "Voici mon code [PYTHON/C] et l'erreur affichée par le compilateur/interpréteur. Ne réécris pas tout le programme : explique-moi la cause exacte de l'erreur en 2 phrases et donne-moi un indice précis pour que je corrige la ligne moi-même.",
  },
  {
    title: '3. Générateur de script Podcast pédagogique',
    prompt:
      "Transforme ce support de cours en un dialogue de podcast de 2 minutes entre deux étudiants (Amira et Yassine). Ton naturel, clair, pédagogique, avec une introduction accrocheuse, un exemple concret et une conclusion récapitulative.",
  },
  {
    title: '4. Préparation de compte-rendu de TP ISET',
    prompt:
      "À partir des mesures et de l'énoncé de TP ci-dessous, aide-moi à structurer le plan de mon compte-rendu (But du TP, Schéma/Algorithme, Tableau des résultats, Interprétation des écarts, Conclusion) et vérifie la cohérence des unités SI.",
  },
  {
    title: '5. Vérification critique et recherche de sources',
    prompt:
      "Sur le sujet [SUJET], donne-moi les définitions standards et cite uniquement des sources institutionnelles ou documentation officielle (ANSSI, MDN, python.org, IEEE). Indique clairement ce qui doit être vérifié.",
  },
];

export const PYTHON_PROJECTS = [
  {
    title: 'Projet 1 — Calculatrice scientifique & électrique CLI',
    problem:
      'Concevoir un outil en ligne de commande capable d’effectuer les opérations arithmétiques de base ainsi que le calcul de résistance équivalente (série/parallèle) et la loi d’Ohm.',
    code: `def loi_ohm():
    print("\\n--- Calcul Loi d'Ohm (U = R * I) ---")
    r = float(input("Résistance R (en Ohms) : "))
    i = float(input("Intensité I (en Ampères) : "))
    u = r * i
    p = u * i
    print(f"Tension U = {u:.2f} V | Puissance P = {p:.3f} W")

def resistance_parallele(r1: float, r2: float) -> float:
    if r1 <= 0 or r2 <= 0:
        raise ValueError("Les résistances doivent être strictement positives.")
    return (r1 * r2) / (r1 + r2)

if __name__ == "__main__":
    loi_ohm()
    print("Req(100, 100) =", resistance_parallele(100, 100), "Ohms")`,
    explanation:
      'Le script sépare chaque calcul dans une fonction typée avec validation des valeurs nulles ou négatives pour éviter la division par zéro.',
    output: `--- Calcul Loi d'Ohm (U = R * I) ---
Résistance R (en Ohms) : 220
Intensité I (en Ampères) : 0.02
Tension U = 4.40 V | Puissance P = 0.088 W
Req(100, 100) = 50.0 Ohms`,
    difficulty:
      "Gestion de l'erreur ZeroDivisionError lorsque R1 + R2 = 0 ou saisie non numérique. Résolu avec une levée ValueError et un bloc try/except.",
  },
  {
    title: 'Projet 2 — Jeu de devinettes avec compteur de tentatives',
    problem:
      'Créer un jeu interactif où l’ordinateur tire un entier aléatoire entre 1 et 100 et guide le joueur par dichotomie ("Plus grand" / "Plus petit").',
    code: `import random

secret = random.randint(1, 100)
essais = 0
trouve = False

while not trouve and essais < 7:
    guess = int(input(f"Essai {essais + 1}/7 - Nombre (1-100) : "))
    essais += 1
    if guess == secret:
        print(f"Bravo ! Trouvé en {essais} essais.")
        trouve = True
    elif guess < secret:
        print("Plus grand !")
    else:
        print("Plus petit !")

if not trouve:
    print(f"Perdu ! Le nombre était {secret}.")`,
    explanation:
      'Utilise la bibliothèque standard random et une boucle while bornée à 7 tentatives (car log2(100) ≈ 6,64 en recherche dichotomique).',
    output: `Essai 1/7 - Nombre (1-100) : 50
Plus grand !
Essai 2/7 - Nombre (1-100) : 75
Plus petit !
Essai 3/7 - Nombre (1-100) : 63
Bravo ! Trouvé en 3 essais.`,
    difficulty:
      'Condition d’arrêt oubliée au départ (boucle infinie quand essais atteignait 7). Corrigé avec le booléen trouve et essais < 7.',
  },
  {
    title: 'Projet 3 — Gestionnaire de notes étudiant ISET',
    problem:
      'Saisir les notes des modules (Digital Skills, Algo/C, Systèmes Électriques), calculer la moyenne pondérée et afficher la mention obtenue.',
    code: `notes = [
    {"module": "Digital Skills", "note": 16.5, "coef": 1.5},
    {"module": "Algorithmique & C", "note": 14.0, "coef": 3.0},
    {"module": "Systèmes Électriques", "note": 15.0, "coef": 2.0},
    {"module": "Systèmes d'Exploitation", "note": 15.5, "coef": 1.5},
]

total_points = sum(n["note"] * n["coef"] for n in notes)
total_coefs = sum(n["coef"] for n in notes)
moyenne = total_points / total_coefs

mention = "Très Bien" if moyenne >= 16 else "Bien" if moyenne >= 14 else "Assez Bien"
print(f"Moyenne générale : {moyenne:.2f}/20 — Mention : {mention}")`,
    explanation:
      'Exploite une liste de dictionnaires et les compréhensions Python (sum) pour calculer une moyenne pondérée proprement.',
    output: `Moyenne générale : 14.94/20 — Mention : Bien`,
    difficulty:
      'Confusion initiale entre moyenne arithmétique simple et moyenne pondérée par les coefficients. Corrigé en divisant par total_coefs.',
  },
];

export const C_PROGRAMS = [
  {
    title: 'Programme 1 — Calcul de moyenne & structure conditionnelle',
    notions: 'Variables, entrées/sorties (scanf/printf), conditions if/else',
    code: `#include <stdio.h>

int main(void) {
    float ds, examen, moyenne;
    printf("Note DS (40%%) et Examen (60%%) : ");
    if (scanf("%f %f", &ds, &examen) != 2) return 1;

    moyenne = 0.4f * ds + 0.6f * examen;
    printf("Moyenne module = %.2f/20 -> ", moyenne);

    if (moyenne >= 10.0f) {
        printf("Module Validé\\n");
    } else {
        printf("Session de rattrapage\\n");
    }
    return 0;
}`,
  },
  {
    title: 'Programme 2 — Recherche du minimum et maximum dans un tableau',
    notions: 'Tableaux statiques, boucles for, passage à une fonction',
    code: `#include <stdio.h>

void min_max(const int tab[], int n, int *min, int *max) {
    *min = tab[0];
    *max = tab[0];
    for (int i = 1; i < n; i++) {
        if (tab[i] < *min) *min = tab[i];
        if (tab[i] > *max) *max = tab[i];
    }
}

int main(void) {
    int mesures[5] = {12, 4, 19, 7, 15};
    int mn, mx;
    min_max(mesures, 5, &mn, &mx);
    printf("Min = %d, Max = %d\\n", mn, mx);
    return 0;
}`,
  },
  {
    title: 'Programme 3 — Permutation par pointeurs & allocation dynamique',
    notions: 'Pointeurs (*, &), malloc / free',
    code: `#include <stdio.h>
#include <stdlib.h>

void echanger(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main(void) {
    int *val = malloc(2 * sizeof(int));
    if (val == NULL) return 1;
    val[0] = 25;
    val[1] = 80;
    echanger(&val[0], &val[1]);
    printf("Après échange : %d et %d\\n", val[0], val[1]);
    free(val);
    return 0;
}`,
  },
];

export const PYTHON_VS_C_TABLE = [
  {
    critere: 'Syntaxe',
    python: 'Épurée, basée sur l’indentation, sans point-virgule ni accolades.',
    c: 'Rigide, délimitée par des accolades { } et terminée par ;.',
  },
  {
    critere: 'Typage',
    python: 'Dynamique (le type est déduit à l’exécution).',
    c: 'Statique et fort (chaque variable déclare int, float, char...).',
  },
  {
    critere: 'Gestion mémoire',
    python: 'Automatique via le ramasse-miettes (Garbage Collector).',
    c: 'Manuelle via pointeurs, malloc() et free().',
  },
  {
    critere: 'Rapidité',
    python: 'Interprété (plus lent sur les boucles intensives).',
    c: 'Compilé en code machine natif via GCC (très rapide).',
  },
  {
    critere: 'Usages typiques',
    python: 'Data Science, IA, scripts d’automatisation, web backend.',
    c: 'Systèmes embarqués, microcontrôleurs, noyaux OS, temps réel.',
  },
];

export const ALGORITHMS_DATA = [
  {
    id: 'max',
    title: '1. Recherche du maximum dans un tableau',
    idea: "Initialiser le maximum avec le premier élément du tableau, puis parcourir les éléments suivants en mettant à jour le maximum dès qu'une valeur supérieure est rencontrée.",
    stepByStep: 'Tableau [8, 3, 14, 6] → max=8 → compare 3 (8) → compare 14 (max=14) → compare 6 (14). Résultat : 14.',
    pseudocode: `Algorithme RechercheMax
Variables T : tableau[1..N] d'entiers, i, max : entier
Début
  max ← T[1]
  Pour i ← 2 à N Faire
    Si T[i] > max Alors
      max ← T[i]
    FinSi
  FinPour
  Afficher("Maximum = ", max)
Fin`,
    cCode: `int max = T[0];
for (int i = 1; i < N; i++) {
    if (T[i] > max) max = T[i];
}`,
  },
  {
    id: 'bubble',
    title: '2. Tri à bulles (Bubble Sort)',
    idea: 'Comparer deux éléments adjacents et les permuter s’ils sont dans le mauvais ordre, ce qui fait remonter la plus grande valeur à la fin à chaque passe.',
    stepByStep: '[5, 2, 8, 1] → [2, 5, 1, 8] → [2, 1, 5, 8] → [1, 2, 5, 8]. Complexité O(n²).',
    pseudocode: `Algorithme TriBulles
Pour i ← N à 2 pas -1 Faire
  Pour j ← 1 à i - 1 Faire
    Si T[j] > T[j + 1] Alors
      Permuter(T[j], T[j + 1])
    FinSi
  FinPour
FinPour`,
    cCode: `for (int i = n - 1; i > 0; i--) {
    for (int j = 0; j < i; j++) {
        if (T[j] > T[j+1]) { int t = T[j]; T[j] = T[j+1]; T[j+1] = t; }
    }
}`,
  },
  {
    id: 'binary',
    title: '3. Recherche dichotomique (tableau trié)',
    idea: 'Diviser l’intervalle de recherche par 2 à chaque itération en comparant la cible à l’élément médian.',
    stepByStep: 'Chercher 18 dans [2, 5, 9, 12, 18, 25] → milieu=9 (<18) → sous-tableau [12, 18, 25] → milieu=18 (trouvé !). Complexité O(log n).',
    pseudocode: `Algorithme RechercheDichotomique
Variables debut, fin, mil : entier
Début
  debut ← 1 ; fin ← N
  TantQue debut <= fin Faire
    mil ← (debut + fin) DIV 2
    Si T[mil] = x Alors Retourner mil
    Sinon Si T[mil] < x Alors debut ← mil + 1
    Sinon fin ← mil - 1
  FinTantQue
  Retourner -1
Fin`,
    cCode: `int d = 0, f = n - 1;
while (d <= f) {
    int m = (d + f) / 2;
    if (T[m] == x) return m;
    if (T[m] < x) d = m + 1; else f = m - 1;
}`,
  },
];

export const INITIAL_COURSE_RESOURCES: CourseResource[] = [
  {
    id: 'tp-iset-1',
    title: 'TP 1 ISET Nabeul — Hygiène Numérique & Cybersécurité',
    moduleTarget: 'tp-iset-nabeul',
    sourceType: 'iset-default',
    courseName: 'Digital Skills · ISET Nabeul',
    description:
      'Analyse des vecteurs de phishing, sécurisation de comptes par 2FA, audit de mots de passe et bonnes pratiques sur réseau de campus.',
    rawContent: `TP 1 Digital Skills — ISET Nabeul : Se protéger sur Internet.
Objectifs : Identifier les principaux logiciels malveillants (virus, ver, cheval de Troie, ransomware, spyware), détecter un courriel d'hameçonnage (phishing) et configurer l'authentification à deux facteurs (2FA).
Travail demandé :
1. Analyser un exemple d'e-mail frauduleux imitant le portail universitaire (vérification de l'adresse d'expédition, du domaine URL et des pièces jointes suspectes).
2. Évaluer la robustesse d'un mot de passe et mettre en place un gestionnaire de mots de passe (Bitwarden ou KeePassXC).
3. Rédiger la fiche d'audit cybersécurité et citer les référentiels ANSSI et ANSI Tunisie.`,
    createdAt: '2026-10-05',
  },
  {
    id: 'tp-iset-2',
    title: 'TP 2 ISET Nabeul — Algorithmique, Tableaux & Pointeurs en C',
    moduleTarget: 'tp-iset-nabeul',
    sourceType: 'iset-default',
    courseName: 'Fondamental IT · ISET Nabeul',
    description:
      'Manipulation de tableaux statiques, tri à bulles, recherche dichotomique et passage par adresse en langage C sous VS Code + GCC.',
    rawContent: `TP 2 Fondamental IT — ISET Nabeul : Tableaux et Pointeurs en Langage C.
Objectifs : Comprendre l'adressage mémoire (& et *), implémenter le tri à bulles et comparer la complexité avec la recherche dichotomique.
Travail demandé :
1. Écrire une fonction void saisirTableau(int *T, int n) et void afficherTableau(const int *T, int n).
2. Implémenter la fonction echanger(int *a, int *b) et l'utiliser dans le tri à bulles.
3. Compiler avec gcc -Wall -Wextra tp2.c -o tp2 dans le terminal de VS Code et vérifier l'absence d'avertissements.`,
    createdAt: '2026-10-18',
  },
  {
    id: 'tp-iset-3',
    title: 'TP 3 ISET Nabeul — Systèmes Électriques : Loi d’Ohm & Portes Logiques',
    moduleTarget: 'tp-iset-nabeul',
    sourceType: 'iset-default',
    courseName: 'Systèmes Électriques & Architecture · ISET Nabeul',
    description:
      'Étude expérimentale du pont diviseur de tension (U = R·I), lois de Kirchhoff et synthèse de fonctions combinatoires avec portes AND, OR, NAND et XOR.',
    rawContent: `TP 3 Systèmes Électriques & Logique Combinatoire — ISET Nabeul.
Partie A — Circuits électriques en courant continu :
- Loi d'Ohm : U = R * I. Puissance dissipée : P = U * I = R * I^2.
- Pont diviseur de tension : Vout = Vin * R2 / (R1 + R2). Application avec Vin = 12V, R1 = 4.7 kOhm, R2 = 10 kOhm.
- Loi des mailles et loi des nœuds de Kirchhoff.
Partie B — Électronique numérique :
- Vérification des tables de vérité des portes de base : AND (S = A·B), OR (S = A+B), NOT (S = Ā), NAND, NOR et XOR (S = A ⊕ B).
- Réalisation d'un demi-additionneur (Half Adder) : Somme S = A ⊕ B et Retenue C = A · B.`,
    createdAt: '2026-11-02',
  },
  {
    id: 'tp-iset-4',
    title: 'TP 4 ISET Nabeul — Systèmes d’Exploitation & Commandes Linux',
    moduleTarget: 'tp-iset-nabeul',
    sourceType: 'iset-default',
    courseName: "Systèmes d'Exploitation · ISET Nabeul",
    description:
      'Gestion de l’arborescence Linux, droits d’accès (chmod), redirections de flux, surveillance de processus (ps, top) et scripts Bash.',
    rawContent: `TP 4 Systèmes d'Exploitation — ISET Nabeul : Initiation au Terminal Linux.
Objectifs : Maîtriser le rôle du noyau (processus, mémoire, fichiers, E/S) et les commandes essentielles.
Commandes étudiées :
- Navigation : pwd, ls -la, cd, mkdir, cp, mv, rm.
- Droits et permissions : chmod 755 script.sh, chown.
- Processus : ps aux, top, kill -9 PID.
- Redirections et filtres : grep, pipe |, >, >>.`,
    createdAt: '2026-11-12',
  },
];
