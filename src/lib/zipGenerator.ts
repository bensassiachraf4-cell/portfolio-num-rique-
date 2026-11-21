import JSZip from 'jszip';
import type { CourseResource, StudentProfile } from '../types/portfolio';
import {
  ALGORITHMS_DATA,
  C_PROGRAMS,
  MALWARES,
  PROMPT_CASES,
  PYTHON_PROJECTS,
  PYTHON_VS_C_TABLE,
  REUSABLE_PROMPTS,
} from '../data/curriculumData';

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function transparencyBox(tools: string, aiRole: string, selfWork: string, sources: string): string {
  return `
    <section class="transparency-box">
      <h3>Fiche « Transparence IA »</h3>
      <p><strong>Outils utilisés :</strong> ${escapeHtml(tools)}</p>
      <p><strong>Rôle de l'IA :</strong> ${escapeHtml(aiRole)}</p>
      <p><strong>Ce que j'ai fait moi-même :</strong> ${escapeHtml(selfWork)}</p>
      <p><strong>Sources vérifiées :</strong> ${escapeHtml(sources)}</p>
    </section>
  `;
}

function layoutHtml(
  title: string,
  depth: number,
  profile: StudentProfile,
  bodyContent: string
): string {
  const prefix = depth === 0 ? './' : '../';
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} — Portfolio ${escapeHtml(profile.fullName)}</title>
  <link rel="stylesheet" href="${prefix}css/style.css" />
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="${prefix}index.html" class="brand">${escapeHtml(profile.fullName)} · ${escapeHtml(profile.campus)}</a>
      <button class="menu-toggle" id="menuToggle" aria-label="Ouvrir le menu">Menu</button>
      <nav class="main-nav" id="mainNav">
        <a href="${prefix}index.html">Accueil</a>
        <a href="${prefix}digital-skills/cybersecurite.html">Cybersécurité</a>
        <a href="${prefix}digital-skills/prompt-engineering.html">Prompts</a>
        <a href="${prefix}digital-skills/creation-contenu.html">Création</a>
        <a href="${prefix}developpement/python.html">Python</a>
        <a href="${prefix}developpement/langage-c.html">Langage C</a>
        <a href="${prefix}developpement/algorithmique.html">Algo</a>
        <a href="${prefix}systemes/systemes-exploitation.html">Systèmes</a>
        <a href="${prefix}systemes/architecture-electronique.html">Électrique</a>
        <a href="${prefix}tp-iset-nabeul/index.html">TP ISET</a>
      </nav>
      <button class="theme-btn" id="themeToggle" type="button">Mode sombre</button>
    </div>
  </header>
  <main class="container page-main">
    ${bodyContent}
  </main>
  <footer class="site-footer">
    <div class="container">
      <p>Portfolio Numérique — ${escapeHtml(profile.fullName)} · ${escapeHtml(profile.filiere)} · ${escapeHtml(profile.campus)}</p>
    </div>
  </footer>
  <script src="${prefix}js/script.js"></script>
</body>
</html>`;
}

function base64ToUint8Array(base64: string): Uint8Array {
  const clean = base64.includes(',') ? base64.split(',')[1] : base64;
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function generatePortfolioZip(
  profile: StudentProfile,
  resources: CourseResource[]
): Promise<Blob> {
  const zip = new JSZip();
  const root = zip.folder(profile.repoName || 'portfolio-numerique')!;

  const cssContent = `:root {
  --bg: #f8fafc;
  --surface: #ffffff;
  --border: #e2e8f0;
  --text: #0f172a;
  --muted: #475569;
  --accent: #1d4ed8;
}
html.dark {
  --bg: #0b1120;
  --surface: #111827;
  --border: #1e293b;
  --text: #f1f5f9;
  --muted: #94a3b8;
  --accent: #3b82f6;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}
.container { max-width: 1120px; margin: 0 auto; padding: 0 1.25rem; }
.site-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 20;
}
.header-inner {
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem; min-height: 64px; flex-wrap: wrap;
}
.brand { font-weight: 700; color: var(--text); text-decoration: none; white-space: nowrap; }
.main-nav { display: flex; gap: 0.9rem; flex-wrap: wrap; }
.main-nav a { color: var(--muted); text-decoration: none; font-size: 0.9rem; white-space: nowrap; }
.main-nav a:hover { color: var(--accent); text-decoration: underline; }
.menu-toggle { display: none; }
.theme-btn, .btn {
  padding: 0.45rem 0.9rem; border: 1px solid var(--border);
  border-radius: 8px; background: var(--surface); color: var(--text); cursor: pointer;
}
.btn-primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.page-main { padding: 2.5rem 1.25rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; }
.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 1.25rem; margin-bottom: 1.25rem;
}
pre {
  background: #0f172a; color: #e2e8f0; padding: 1rem;
  border-radius: 8px; overflow-x: auto; font-size: 0.875rem;
}
table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
th, td { border: 1px solid var(--border); padding: 0.6rem; text-align: left; }
th { background: rgba(148,163,184,0.12); }
.transparency-box {
  margin-top: 2.5rem; padding: 1.25rem; background: var(--surface);
  border: 1px solid var(--border); border-radius: 12px; font-size: 0.9rem;
}
.site-footer {
  border-top: 1px solid var(--border); padding: 1.5rem 0;
  color: var(--muted); font-size: 0.875rem; margin-top: 3rem;
}
@media (max-width: 768px) {
  .menu-toggle { display: inline-block; padding: 0.4rem 0.8rem; border: 1px solid var(--border); border-radius: 6px; background: var(--surface); color: var(--text); }
  .main-nav { display: none; width: 100%; flex-direction: column; padding-bottom: 1rem; }
  .main-nav.open { display: flex; }
}`;

  const jsContent = `document.addEventListener('DOMContentLoaded', function () {
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      document.documentElement.classList.toggle('dark');
      themeBtn.textContent = document.documentElement.classList.contains('dark') ? 'Mode clair' : 'Mode sombre';
    });
  }
  var menuBtn = document.getElementById('menuToggle');
  var nav = document.getElementById('mainNav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }
  var quizForm = document.getElementById('cyberQuiz');
  if (quizForm) {
    quizForm.addEventListener('change', function () {
      var boxes = quizForm.querySelectorAll('input[type="checkbox"]');
      var checked = 0;
      boxes.forEach(function (b) { if (b.checked) checked++; });
      var out = document.getElementById('quizScore');
      if (out) {
        out.textContent = 'Score de protection : ' + checked + ' / ' + boxes.length + (checked >= 7 ? ' (Excellent niveau)' : ' (Pensez à renforcer vos pratiques)');
      }
    });
  }
});`;

  root.file('css/style.css', cssContent);
  root.file('js/script.js', jsContent);

  // Add generated media files into medias/
  const mediaSummaryLinks: string[] = [];
  for (const res of resources) {
    const slug = res.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 48);

    if (res.generatedPack) {
      const md = `# ${res.title}\n\n**Module :** ${res.courseName}\n\n## Résumé\n${res.generatedPack.summary.overview}\n\n## Notions clés\n${res.generatedPack.summary.keyConcepts.map((k) => `- ${k}`).join('\n')}\n\n## Formules & Commandes\n${res.generatedPack.summary.formulasOrCommands.map((f) => `- \`${f}\``).join('\n')}\n\n## Conseils examen ISET\n${res.generatedPack.summary.examTips.map((t) => `- ${t}`).join('\n')}\n\n## Script Podcast\n${res.generatedPack.podcastScript.map((p) => `**${p.speaker}**: ${p.text}`).join('\n\n')}\n`;
      root.file(`medias/${slug}-resume.md`, md);
      mediaSummaryLinks.push(`medias/${slug}-resume.md`);
    }

    if (res.podcastAudioBase64) {
      root.file(`medias/${slug}-podcast.wav`, base64ToUint8Array(res.podcastAudioBase64));
      mediaSummaryLinks.push(`medias/${slug}-podcast.wav`);
    }

    if (res.videoWebmBase64) {
      root.file(`medias/${slug}-video.webm`, base64ToUint8Array(res.videoWebmBase64));
      mediaSummaryLinks.push(`medias/${slug}-video.webm`);
    }
  }

  // index.html
  const indexBody = `
    <section class="card">
      <p>${escapeHtml(profile.campus)} · ${escapeHtml(profile.filiere)}</p>
      <h1>Portfolio Numérique — ${escapeHtml(profile.fullName)}</h1>
      <p>${escapeHtml(profile.bio)}</p>
    </section>
    <section>
      <h2>Modules du Semestre</h2>
      <div class="grid">
        <a class="card" href="./digital-skills/cybersecurite.html"><h3>01. Digital Skills — Cybersécurité</h3><p>Malwares, risques quotidiens et checklist de protection.</p></a>
        <a class="card" href="./digital-skills/prompt-engineering.html"><h3>02. Prompt Engineering</h3><p>3 cas pratiques avant/après et bibliothèque de 5 prompts.</p></a>
        <a class="card" href="./digital-skills/creation-contenu.html"><h3>03. Création de Contenu</h3><p>Résumés, podcasts, cartes mentales et diaporama narré.</p></a>
        <a class="card" href="./developpement/python.html"><h3>04. Développement Python</h3><p>3 mini-projets avec code source et exécution.</p></a>
        <a class="card" href="./developpement/langage-c.html"><h3>05. Langage C</h3><p>3 programmes C et tableau comparatif Python / C.</p></a>
        <a class="card" href="./developpement/algorithmique.html"><h3>06. Algorithmique</h3><p>Pseudo-codes et exemples pas à pas.</p></a>
        <a class="card" href="./systemes/systemes-exploitation.html"><h3>07. Systèmes d'exploitation</h3><p>Rôle de l'OS, Windows/Linux/macOS et commandes.</p></a>
        <a class="card" href="./systemes/architecture-electronique.html"><h3>08. Architecture & Systèmes Électriques</h3><p>Von Neumann, binaire/hexa, loi d'Ohm et portes logiques.</p></a>
        <a class="card" href="./tp-iset-nabeul/index.html"><h3>09. TP ISET Nabeul & Classroom</h3><p>${resources.length} cours/TP avec résumés, podcasts et vidéos.</p></a>
      </div>
    </section>
    ${transparencyBox(
      'VS Code, GitHub Pages, Gemini AI, Google Classroom',
      'Structuration des résumés de cours et synthèse audio/vidéo pédagogique.',
      'Rédaction, sélection des TP ISET Nabeul, vérification technique et mise en page.',
      'Guide d’accompagnement Portfolio Numérique, cours ISET Nabeul.'
    )}
  `;
  root.file('index.html', layoutHtml('Accueil', 0, profile, indexBody));

  // digital-skills/cybersecurite.html
  const cyberBody = `
    <h1>Digital Skills — Chapitre 1 : Se protéger sur Internet</h1>
    <section class="card">
      <h2>Principaux logiciels malveillants</h2>
      ${MALWARES.map((m) => `<p><strong>${escapeHtml(m.name)} :</strong> ${escapeHtml(m.definition)} <em>Impact : ${escapeHtml(m.impact)}</em></p>`).join('')}
    </section>
    <section class="card">
      <h2>Checklist interactive : Suis-je bien protégé ?</h2>
      <form id="cyberQuiz">
        <p><label><input type="checkbox" /> Mot de passe unique (12+ caractères) par compte</label></p>
        <p><label><input type="checkbox" /> Authentification à deux facteurs (2FA) activée</label></p>
        <p><label><input type="checkbox" /> Vérification des expéditeurs et liens (anti-phishing)</label></p>
        <p><label><input type="checkbox" /> Mises à jour OS et navigateur actives</label></p>
        <p><label><input type="checkbox" /> Sauvegarde régulière de mes TP</label></p>
        <p><label><input type="checkbox" /> Aucune clé API ni mot de passe dans GitHub</label></p>
        <p id="quizScore"><strong>Score de protection : 0 / 6</strong></p>
      </form>
    </section>
    ${transparencyBox('Perplexity, Gemini, VS Code', 'Synthèse des définitions de menaces.', 'Rédaction du quiz JS et vérification ANSSI.', 'https://www.cybermalveillance.gouv.fr, https://www.ssi.gouv.fr')}
  `;
  root.file('digital-skills/cybersecurite.html', layoutHtml('Cybersécurité', 1, profile, cyberBody));

  // digital-skills/prompt-engineering.html
  const promptBody = `
    <h1>Digital Skills — Chapitre 2 : Prompt Engineering</h1>
    <section class="card">
      <h2>Les 6 piliers d'un bon prompt</h2>
      <p>Rôle · Contexte · Tâche · Format de sortie · Contraintes · Exemples</p>
    </section>
    ${PROMPT_CASES.map((c) => `
      <section class="card">
        <h3>${escapeHtml(c.title)} (${escapeHtml(c.tool)})</h3>
        <p><strong>Prompt initial :</strong> ${escapeHtml(c.weakPrompt)}</p>
        <p><strong>Résultat initial :</strong> ${escapeHtml(c.weakResult)}</p>
        <p><strong>Prompt amélioré :</strong> ${escapeHtml(c.improvedPrompt)}</p>
        <p><strong>Résultat amélioré :</strong> ${escapeHtml(c.improvedResult)}</p>
        <p><strong>Analyse :</strong> ${escapeHtml(c.analysis)}</p>
      </section>
    `).join('')}
    <section class="card">
      <h2>Bibliothèque de 5 prompts réutilisables</h2>
      ${REUSABLE_PROMPTS.map((p) => `<p><strong>${escapeHtml(p.title)} :</strong><br/><code>${escapeHtml(p.prompt)}</code></p>`).join('')}
    </section>
    ${transparencyBox('Claude, ChatGPT, Grok, Perplexity, Gemini', 'Comparaison des réponses entre prompts faibles et structurés.', 'Tests itératifs, rédaction de l’analyse critique.', 'Documentation officielle prompting.')}
  `;
  root.file('digital-skills/prompt-engineering.html', layoutHtml('Prompt Engineering', 1, profile, promptBody));

  // digital-skills/creation-contenu.html
  const creationBody = `
    <h1>Digital Skills — Chapitre 3 : Création de Contenu Multimédia</h1>
    <section class="card">
      <h2>Productions réalisées & médias générés</h2>
      <ul>
        <li><strong>Résumé structuré</strong> : synthèse relue et corrigée des cours ISET.</li>
        <li><strong>Podcast audio (.wav)</strong> : dialogue à deux voix généré à partir des supports.</li>
        <li><strong>Vidéo de cours (.webm)</strong> : diaporama narré avec sous-titres.</li>
        <li><strong>Carte mentale</strong> : concepts clés reliés visuellement.</li>
      </ul>
      ${mediaSummaryLinks.length > 0 ? `<h3>Fichiers exportés dans medias/</h3><ul>${mediaSummaryLinks.map((m) => `<li><a href="../${escapeHtml(m)}">${escapeHtml(m)}</a></li>`).join('')}</ul>` : ''}
    </section>
    ${transparencyBox('NotebookLM, Gemini TTS, Canva, CapCut', 'Génération des scripts et pistes audio.', 'Relecture, montage et intégration dans le dépôt.', 'Cours Digital Skills ISET Nabeul')}
  `;
  root.file('digital-skills/creation-contenu.html', layoutHtml('Création de contenu', 1, profile, creationBody));

  // developpement/python.html
  const pythonBody = `
    <h1>Fondamental IT — Python (3 mini-projets)</h1>
    ${PYTHON_PROJECTS.map((p) => `
      <section class="card">
        <h2>${escapeHtml(p.title)}</h2>
        <p><strong>Problème :</strong> ${escapeHtml(p.problem)}</p>
        <pre><code>${escapeHtml(p.code)}</code></pre>
        <p><strong>Explication :</strong> ${escapeHtml(p.explanation)}</p>
        <pre>${escapeHtml(p.output)}</pre>
        <p><strong>Difficultés et solutions :</strong> ${escapeHtml(p.difficulty)}</p>
      </section>
    `).join('')}
    ${transparencyBox('VS Code, Python 3, Gemini', 'Explication des erreurs et suggestions de typage.', 'Écriture et exécution des 3 programmes.', 'https://docs.python.org/fr/3/')}
  `;
  root.file('developpement/python.html', layoutHtml('Python', 1, profile, pythonBody));

  // developpement/langage-c.html
  const cBody = `
    <h1>Fondamental IT — Langage C & Comparatif Python / C</h1>
    ${C_PROGRAMS.map((p) => `
      <section class="card">
        <h2>${escapeHtml(p.title)}</h2>
        <p><strong>Notions :</strong> ${escapeHtml(p.notions)}</p>
        <pre><code>${escapeHtml(p.code)}</code></pre>
      </section>
    `).join('')}
    <section class="card">
      <h2>Tableau comparatif Python / Langage C</h2>
      <table>
        <thead><tr><th>Critère</th><th>Python</th><th>Langage C</th></tr></thead>
        <tbody>
          ${PYTHON_VS_C_TABLE.map((r) => `<tr><td>${escapeHtml(r.critere)}</td><td>${escapeHtml(r.python)}</td><td>${escapeHtml(r.c)}</td></tr>`).join('')}
        </tbody>
      </table>
    </section>
    ${transparencyBox('VS Code, GCC, Gemini', 'Aide au débogage des pointeurs.', 'Codage, compilation gcc -Wall et rédaction du comparatif.', 'Cours Langage C ISET Nabeul')}
  `;
  root.file('developpement/langage-c.html', layoutHtml('Langage C', 1, profile, cBody));

  // developpement/algorithmique.html
  const algoBody = `
    <h1>Fondamental IT — Algorithmique</h1>
    ${ALGORITHMS_DATA.map((a) => `
      <section class="card">
        <h2>${escapeHtml(a.title)}</h2>
        <p><strong>Idée générale :</strong> ${escapeHtml(a.idea)}</p>
        <p><strong>Exemple pas à pas :</strong> ${escapeHtml(a.stepByStep)}</p>
        <pre><code>${escapeHtml(a.pseudocode)}</code></pre>
        <pre><code>${escapeHtml(a.cCode)}</code></pre>
      </section>
    `).join('')}
    ${transparencyBox('VS Code, Gemini', 'Validation de la complexité O(n²) vs O(log n).', 'Rédaction des pseudo-codes et exemples.', 'Cours Algorithmique 1ère année')}
  `;
  root.file('developpement/algorithmique.html', layoutHtml('Algorithmique', 1, profile, algoBody));

  // systemes/systemes-exploitation.html
  const osBody = `
    <h1>Systèmes d'Exploitation</h1>
    <section class="card">
      <h2>Rôle du système d'exploitation</h2>
      <p>Le noyau orchestre la gestion des processus, de la mémoire vive (RAM), du système de fichiers et des pilotes de périphériques.</p>
    </section>
    <section class="card">
      <h2>Comparatif Windows / Linux / macOS</h2>
      <table>
        <thead><tr><th>Critère</th><th>Windows</th><th>Linux (Ubuntu/Debian)</th><th>macOS</th></tr></thead>
        <tbody>
          <tr><td>Noyau & Licence</td><td>NT · Propriétaire</td><td>Linux · Open Source (GPL)</td><td>XNU (Darwin) · Propriétaire</td></tr>
          <tr><td>Terminal principal</td><td>PowerShell / CMD</td><td>Bash / Zsh</td><td>Zsh</td></tr>
          <tr><td>Usage ISET / Serveurs</td><td>Bureautique, C#, Windows</td><td>Serveurs, Cloud, Dev C/Python</td><td>Développement Unix, multimédia</td></tr>
        </tbody>
      </table>
    </section>
    ${transparencyBox('Terminal Linux, PowerShell, Gemini', 'Synthèse des commandes essentielles.', 'Tests en TP et tableau comparatif.', 'Documentation Ubuntu & Microsoft Learn')}
  `;
  root.file('systemes/systemes-exploitation.html', layoutHtml("Systèmes d'exploitation", 1, profile, osBody));

  // systemes/architecture-electronique.html
  const archBody = `
    <h1>Architecture des Ordinateurs & Systèmes Électriques</h1>
    <section class="card">
      <h2>Architecture de Von Neumann</h2>
      <p>CPU (Unité Arithmétique et Logique + Unité de Contrôle + Registres) relié à la Mémoire Centrale (RAM) et aux Entrées/Sorties par les Bus de données, d'adresses et de contrôle.</p>
    </section>
    <section class="card">
      <h2>Systèmes Électriques & Électronique Numérique</h2>
      <ul>
        <li><strong>Loi d'Ohm :</strong> U = R · I (Volts = Ohms × Ampères)</li>
        <li><strong>Puissance :</strong> P = U · I (Watts)</li>
        <li><strong>Pont diviseur :</strong> Vout = Vin · R2 / (R1 + R2)</li>
        <li><strong>Portes logiques :</strong> AND (A·B), OR (A+B), NOT (Ā), NAND, NOR, XOR (A⊕B)</li>
      </ul>
    </section>
    ${transparencyBox('Simulateur logique, Gemini', 'Vérification des conversions binaire/hexadécimal.', 'Calculs électriques et tables de vérité.', 'Cours Systèmes Électriques ISET Nabeul')}
  `;
  root.file('systemes/architecture-electronique.html', layoutHtml('Architecture & Électrique', 1, profile, archBody));

  // tp-iset-nabeul/index.html
  const tpBody = `
    <h1>TP ISET Nabeul & Cours Importés (Google Classroom)</h1>
    ${resources.map((r) => `
      <section class="card">
        <h2>${escapeHtml(r.title)}</h2>
        <p><strong>Source :</strong> ${escapeHtml(r.courseName)} · ${escapeHtml(r.createdAt)}</p>
        <p>${escapeHtml(r.description)}</p>
        ${r.generatedPack ? `
          <h3>Résumé structuré</h3>
          <p>${escapeHtml(r.generatedPack.summary.overview)}</p>
          <ul>${r.generatedPack.summary.keyConcepts.map((k) => `<li>${escapeHtml(k)}</li>`).join('')}</ul>
        ` : `<pre>${escapeHtml(r.rawContent.slice(0, 1200))}</pre>`}
      </section>
    `).join('')}
    ${transparencyBox('Google Classroom API, Gemini AI, VS Code', 'Importation et structuration des résumés de TP.', 'Réalisation des TP à l’ISET Nabeul et relecture.', 'Google Classroom ISET Nabeul')}
  `;
  root.file('tp-iset-nabeul/index.html', layoutHtml('TP ISET Nabeul', 1, profile, tpBody));

  // VS Code config
  root.file(
    '.vscode/settings.json',
    JSON.stringify(
      {
        'editor.formatOnSave': true,
        'editor.tabSize': 2,
        'liveServer.settings.port': 5500,
        'files.defaultLanguage': 'html',
      },
      null,
      2
    )
  );
  root.file(
    '.vscode/extensions.json',
    JSON.stringify(
      {
        recommendations: [
          'ritwickdey.LiveServer',
          'esbenp.prettier-vscode',
          'ms-python.python',
          'ms-vscode.cpptools',
        ],
      },
      null,
      2
    )
  );

  // Google Cloud Run Dockerfile + nginx.conf
  root.file(
    'nginx.conf',
    `server {
  listen 8080;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
`
  );
  root.file(
    'Dockerfile',
    `FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
`
  );

  // README.md
  const readme = `# Portfolio Numérique — ${profile.fullName}

**Établissement :** ${profile.campus}  
**Filière :** ${profile.filiere}  
**Lien GitHub Pages :** https://${profile.githubUsername}.github.io/${profile.repoName}/

## Modules couverts
- **Digital Skills** : Cybersécurité, Prompt Engineering, Création de contenu (résumés, podcasts, vidéos)
- **Fondamental IT & Développement** : Python, Langage C, Algorithmique
- **Systèmes & Électrique** : Systèmes d'exploitation, Architecture des ordinateurs, Systèmes électriques & portes logiques
- **TP ISET Nabeul** : Fiches de travaux pratiques et supports importés depuis Google Classroom

## Ouvrir dans VS Code & publier sur GitHub Pages
1. Décompressez cette archive ZIP et ouvrez le dossier \`${profile.repoName}/\` dans **VS Code**.
2. Installez l'extension recommandée **Live Server** pour prévisualiser \`index.html\` localement.
3. Initialisez Git et poussez sur GitHub :
   \`\`\`bash
   git init
   git add .
   git commit -m "Initialisation Portfolio Numérique ISET Nabeul"
   git branch -M main
   git remote add origin https://github.com/${profile.githubUsername}/${profile.repoName}.git
   git push -u origin main
   \`\`\`
4. Sur GitHub : **Settings → Pages → Branch : main → Save**.

## Déployer sur Google Cloud Run
\`\`\`bash
gcloud run deploy ${profile.repoName} --source . --platform managed --region europe-west1 --allow-unauthenticated
\`\`\`
`;
  root.file('README.md', readme);

  return zip.generateAsync({ type: 'blob' });
}
