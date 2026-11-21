import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Edit3,
  FileCode2,
  Headphones,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  SkipForward,
  Sparkles,
  Terminal,
  Video,
} from 'lucide-react';
import {
  ALGORITHMS_DATA,
  C_PROGRAMS,
  CYBER_QUIZ_QUESTIONS,
  EVALUATION_RUBRIC,
  FINAL_CHECKLIST,
  MALWARES,
  PROMPT_CASES,
  PYTHON_PROJECTS,
  PYTHON_VS_C_TABLE,
  REUSABLE_PROMPTS,
} from '../data/curriculumData';
import type { CourseResource, ModuleId, StudentProfile } from '../types/portfolio';

export const AiTransparencyFooter: React.FC<{
  tools: string;
  aiRole: string;
  selfWork: string;
  sources: string;
}> = ({ tools, aiRole, selfWork, sources }) => (
  <section className="mt-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3">
    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
      Fiche « Transparence IA »
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
      <p>
        <span className="font-semibold text-slate-900 dark:text-slate-200">
          Outils utilisés :{' '}
        </span>
        {tools}
      </p>
      <p>
        <span className="font-semibold text-slate-900 dark:text-slate-200">
          Rôle de l'IA :{' '}
        </span>
        {aiRole}
      </p>
      <p>
        <span className="font-semibold text-slate-900 dark:text-slate-200">
          Ce que j'ai fait moi-même :{' '}
        </span>
        {selfWork}
      </p>
      <p>
        <span className="font-semibold text-slate-900 dark:text-slate-200">
          Sources vérifiées :{' '}
        </span>
        {sources}
      </p>
    </div>
  </section>
);

const CodeBlock: React.FC<{ code: string; language?: string }> = ({
  code,
  language = 'code',
}) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-xs font-mono text-slate-400">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white cursor-pointer"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copié' : 'Copier'}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-slate-100 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

/* =========================================================
   1. ACCUEIL VIEW
========================================================= */
export const AccueilView: React.FC<{
  profile: StudentProfile;
  onUpdateProfile: (p: StudentProfile) => void;
  onNavigate: (id: ModuleId) => void;
  resources: CourseResource[];
}> = ({ profile, onUpdateProfile, onNavigate, resources }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    c2: true,
    c3: true,
    c4: true,
    c5: true,
    c6: true,
    c7: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(draft);
    setEditing(false);
  };

  const moduleCards: Array<{
    id: ModuleId;
    index: string;
    title: string;
    desc: string;
    meta: string;
  }> = [
    {
      id: 'cybersecurite',
      index: '01',
      title: 'Digital Skills — Cybersécurité',
      desc: 'Malwares, risques quotidiens, infographie et quiz interactif de protection.',
      meta: 'Chapitre 1 · Quiz JS',
    },
    {
      id: 'prompt-engineering',
      index: '02',
      title: 'Digital Skills — Prompt Engineering',
      desc: 'Les 6 piliers d’un prompt efficace, 3 cas pratiques et 5 prompts réutilisables.',
      meta: 'Chapitre 2 · 3 cas',
    },
    {
      id: 'creation-contenu',
      index: '03',
      title: 'Digital Skills — Création de contenu',
      desc: 'Résumés, podcasts audio, cartes mentales et diaporama interactif avec voix.',
      meta: 'Chapitre 3 · Multimédia',
    },
    {
      id: 'python',
      index: '04',
      title: 'Fondamental IT — Python',
      desc: 'Calculatrice loi d’Ohm, jeu dichotomique et gestionnaire de notes ISET.',
      meta: '3 mini-projets',
    },
    {
      id: 'langage-c',
      index: '05',
      title: 'Fondamental IT — Langage C',
      desc: 'Tableaux, fonctions, pointeurs, malloc/free et comparatif Python / C.',
      meta: '3 programmes · GCC',
    },
    {
      id: 'algorithmique',
      index: '06',
      title: 'Fondamental IT — Algorithmique',
      desc: 'Pseudo-codes, recherche dichotomique et simulateur animé de tri à bulles.',
      meta: 'Visualiseur interactif',
    },
    {
      id: 'systemes-exploitation',
      index: '07',
      title: "Systèmes d'exploitation",
      desc: 'Architecture du noyau OS, comparatif Windows/Linux/macOS et commandes.',
      meta: 'Bash & PowerShell',
    },
    {
      id: 'architecture-electronique',
      index: '08',
      title: 'Architecture & Systèmes Électriques',
      desc: "Von Neumann, convertisseur binaire/hexa, loi d'Ohm et simulateur portes logiques.",
      meta: 'Simulateur logique',
    },
    {
      id: 'tp-iset-nabeul',
      index: '09',
      title: 'TP ISET Nabeul & Classroom',
      desc: `${resources.length} travaux pratiques et cours prêts à résumer ou transformer en podcast.`,
      meta: 'ISET Nabeul · Classroom',
    },
  ];

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="space-y-12">
      {/* Split Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-wide text-blue-700 dark:text-blue-400">
              {profile.campus} · {profile.filiere}
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance leading-[1.1]">
              Portfolio Numérique & Studio de Cours
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {profile.bio}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('classroom')}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-medium text-white cursor-pointer transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Connecter Google Classroom
            </button>
            <button
              type="button"
              onClick={() => onNavigate('studio')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 cursor-pointer transition-colors"
            >
              <Headphones className="h-4 w-4" />
              Studio Résumé, Podcast & Vidéo
            </button>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between space-y-5">
          {!editing ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-blue-600 text-white flex items-center justify-center font-display text-xl font-bold shrink-0">
                    {profile.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {profile.fullName}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {profile.campus} · 1ère Année
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(profile);
                    setEditing(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Modifier
                </button>
              </div>

              <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-400">Filière</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100 text-right">
                    {profile.filiere}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-400">Dépôt GitHub</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">
                    {profile.githubUsername}/{profile.repoName}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-400">URL GitHub Pages</span>
                  <span className="font-mono text-blue-700 dark:text-blue-400 truncate">
                    https://{profile.githubUsername}.github.io/{profile.repoName}/
                  </span>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleSave} className="space-y-3">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Personnaliser votre profil étudiant
              </div>
              <input
                type="text"
                value={draft.fullName}
                onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                placeholder="Nom et Prénom"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-sm"
              />
              <input
                type="text"
                value={draft.filiere}
                onChange={(e) => setDraft({ ...draft, filiere: e.target.value })}
                placeholder="Filière"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={draft.githubUsername}
                  onChange={(e) =>
                    setDraft({ ...draft, githubUsername: e.target.value })
                  }
                  placeholder="Pseudo GitHub"
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs font-mono"
                />
                <input
                  type="text"
                  value={draft.repoName}
                  onChange={(e) => setDraft({ ...draft, repoName: e.target.value })}
                  placeholder="Nom dépôt"
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-medium text-white cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Unités couvertes</div>
          <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            4 UE · 9 Modules
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Cours & TP chargés</div>
          <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {resources.length} fiches
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Podcasts & Vidéos</div>
          <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {resources.filter((r) => r.podcastAudioBase64).length} WAV ·{' '}
            {resources.filter((r) => r.videoWebmBase64).length} WebM
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Checklist rendu</div>
          <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {completedCount} / {FINAL_CHECKLIST.length}
          </div>
        </div>
      </section>

      {/* Module Cards Grid */}
      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Modules du Portfolio Numérique
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Accédez directement aux productions de chaque unité d’enseignement.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {moduleCards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => onNavigate(card.id)}
              className="group text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-4 hover:border-blue-600 dark:hover:border-blue-500 transition-colors cursor-pointer"
            >
              <div className="space-y-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {card.index}. {card.meta}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                Ouvrir le module
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Rubric & Final Checklist */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Grille d'évaluation officielle (/20)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs text-slate-500 dark:text-slate-400">
                  <th className="py-2 pr-4 font-medium">Critère</th>
                  <th className="py-2 text-right font-medium">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {EVALUATION_RUBRIC.map((row) => (
                  <tr key={row.critere}>
                    <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-300">
                      {row.critere}
                    </td>
                    <td className="py-2.5 text-right font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                      {row.points}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="pt-3 text-slate-900 dark:text-slate-100">Total</td>
                  <td className="pt-3 text-right font-mono tabular-nums text-blue-700 dark:text-blue-400">
                    20
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Checklist finale de rendu
            </h3>
            <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              {completedCount}/{FINAL_CHECKLIST.length} validés
            </span>
          </div>
          <div className="space-y-2">
            {FINAL_CHECKLIST.map((item) => (
              <label
                key={item.id}
                className="flex items-start gap-3 rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-sm text-slate-700 dark:text-slate-300"
              >
                <input
                  type="checkbox"
                  checked={Boolean(checkedItems[item.id])}
                  onChange={(e) =>
                    setCheckedItems({ ...checkedItems, [item.id]: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

/* =========================================================
   2. CYBERSECURITE VIEW
========================================================= */
export const CybersecuriteView: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const score = Object.values(answers).filter(Boolean).length;

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
        <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
          Digital Skills · Chapitre 1
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Se protéger sur Internet
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Comprendre les menaces numériques (malwares, phishing, fuites de données) et adopter
          les réflexes d’hygiène informatique pour vos études et projets GitHub.
        </p>
      </div>

      {/* Malwares */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          01. Les principaux logiciels malveillants
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MALWARES.map((m) => (
            <div
              key={m.name}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2"
            >
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {m.name}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {m.definition}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                Impact : {m.impact}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Infographie */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            02. Infographie — Les 6 réflexes de protection quotidienne
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ['Mots de passe & Coffre', '12+ caractères uniques par service, stockés dans Bitwarden ou KeePassXC.'],
            ['Double authentification (2FA)', 'Indispensable sur Google Classroom, GitHub et messagerie universitaire.'],
            ['Vigilance Anti-Phishing', 'Contrôler le domaine exact de l’expéditeur avant d’ouvrir lien ou pièce jointe.'],
            ['Mises à jour & Antivirus', 'Appliquer les correctifs OS/navigateur dès leur publication.'],
            ['Wi-Fi public prudent', 'Éviter les connexions bancaires ou SSH sans tunnel chiffré (VPN).'],
            ['Zéro secret sur GitHub', 'Jamais de clé API, mot de passe ou jeton OAuth dans un dépôt public.'],
          ].map(([title, desc], i) => (
            <div
              key={title}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1.5"
            >
              <div className="text-xs font-mono text-blue-700 dark:text-blue-400">
                0{i + 1}
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Quiz */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              03. Quiz / Checklist interactive : « Suis-je bien protégé ? »
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cochez les pratiques que vous appliquez réellement aujourd’hui.
            </p>
          </div>
          <div className="text-sm font-bold font-mono tabular-nums text-blue-700 dark:text-blue-400">
            Score : {score} / {CYBER_QUIZ_QUESTIONS.length}
          </div>
        </div>

        <div className="space-y-3">
          {CYBER_QUIZ_QUESTIONS.map((q) => {
            const checked = Boolean(answers[q.id]);
            return (
              <div
                key={q.id}
                className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-1.5"
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      setAnswers({ ...answers, [q.id]: e.target.checked })
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {q.question}
                  </span>
                </label>
                {!checked && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 pl-7">
                    Conseil : {q.tip}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-4 text-sm font-medium text-slate-800 dark:text-slate-200">
          {score >= 7
            ? 'Niveau solide : vos comptes étudiants et dépôts GitHub respectent les bonnes pratiques ANSSI.'
            : score >= 4
            ? 'Niveau intermédiaire : activez la 2FA et utilisez un gestionnaire de mots de passe pour combler les écarts.'
            : 'Vigilance requise : appliquez en priorité les conseils affichés ci-dessus.'}
        </div>
      </section>

      <AiTransparencyFooter
        tools="Perplexity, Gemini, VS Code"
        aiRole="Structuration des définitions de menaces et relecture des conseils de sécurité."
        selfWork="Rédaction du quiz interactif en TypeScript/JavaScript et vérification auprès des guides officiels."
        sources="ANSSI (ssi.gouv.fr), Cybermalveillance.gouv.fr, ANSI Tunisie"
      />
    </div>
  );
};

/* =========================================================
   3. PROMPT ENGINEERING VIEW
========================================================= */
export const PromptEngineeringView: React.FC = () => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
        <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
          Digital Skills · Chapitre 2
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Prompt Engineering & Usage Critique de l’IA
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Méthode structurée en 6 éléments (Rôle, Contexte, Tâche, Format, Contraintes,
          Exemples) illustrée par 3 cas pratiques avant/après.
        </p>
      </div>

      {/* 6 Pillars */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          ['Rôle', 'Posture experte attendue'],
          ['Contexte', 'Niveau & environnement ISET'],
          ['Tâche', 'Action précise demandée'],
          ['Format', 'Tableau, code, étapes'],
          ['Contraintes', 'Longueur, sans biblio externe'],
          ['Exemples', 'Few-shot de référence'],
        ].map(([k, v]) => (
          <div
            key={k}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1"
          >
            <div className="text-sm font-bold text-blue-700 dark:text-blue-400">{k}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">{v}</div>
          </div>
        ))}
      </section>

      {/* 3 Practical Cases */}
      <section className="space-y-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          01. 3 Cas pratiques : Prompt initial vs Prompt amélioré
        </h3>
        {PROMPT_CASES.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {c.title}
              </h4>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Outil : {c.tool}
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
                <div className="text-xs font-semibold text-slate-500">
                  Prompt initial (faible)
                </div>
                <p className="text-xs font-mono text-slate-800 dark:text-slate-200">
                  {c.weakPrompt}
                </p>
                <div className="text-xs font-semibold text-slate-500 pt-2">
                  Résultat obtenu
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{c.weakResult}</p>
              </div>
              <div className="rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 p-4 space-y-2">
                <div className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                  Prompt amélioré (méthode complète)
                </div>
                <p className="text-xs font-mono text-slate-900 dark:text-slate-100">
                  {c.improvedPrompt}
                </p>
                <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 pt-2">
                  Résultat obtenu
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {c.improvedResult}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                Analyse :{' '}
              </span>
              {c.analysis}
            </p>
          </div>
        ))}
      </section>

      {/* Reusable Prompt Library */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          02. Bibliothèque de 5 prompts réutilisables pour vos études
        </h3>
        <div className="space-y-3">
          {REUSABLE_PROMPTS.map((item, idx) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(item.prompt);
                    setCopiedIdx(idx);
                    setTimeout(() => setCopiedIdx(null), 1500);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-400 cursor-pointer"
                >
                  {copiedIdx === idx ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copiedIdx === idx ? 'Copié' : 'Copier'}
                </button>
              </div>
              <p className="text-xs font-mono text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.prompt}
              </p>
            </div>
          ))}
        </div>
      </section>

      <AiTransparencyFooter
        tools="Claude, ChatGPT, Grok, Perplexity, Gemini"
        aiRole="Génération des réponses comparatives à partir des prompts testés."
        selfWork="Conception des 3 cas pratiques ISET, itération des prompts et analyse des écarts."
        sources="Documentation Anthropic Prompt Engineering & OpenAI Prompt Guide"
      />
    </div>
  );
};

/* =========================================================
   4. CREATION DE CONTENU VIEW
========================================================= */
export const CreationContenuView: React.FC<{
  resources: CourseResource[];
  onOpenStudio: (resourceId: string) => void;
}> = ({ resources, onOpenStudio }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const interactiveSlides = [
    {
      title: '1. Pourquoi sécuriser son identité numérique ?',
      body: 'Sur un campus connecté comme l’ISET Nabeul, la majorité des incidents proviennent de mots de passe réutilisés ou de liens d’hameçonnage.',
      script:
        'Script voix : Bonjour, dans cette présentation interactive, nous voyons comment protéger nos comptes étudiants grâce à des réflexes simples.',
    },
    {
      title: '2. Détecter le phishing en 10 secondes',
      body: 'Vérifiez toujours le domaine réel de l’expéditeur, méfiez-vous de l’urgence artificielle et survolez le lien avant de cliquer.',
      script:
        'Script voix : Un vrai message universitaire ne vous demandera jamais votre mot de passe par un formulaire externe.',
    },
    {
      title: '3. Protéger ses dépôts GitHub et VS Code',
      body: 'Utilisez .gitignore pour exclure les fichiers .env et activez la double authentification sur votre compte GitHub.',
      script:
        'Script voix : Avant chaque git push, vérifiez qu’aucune clé API ni mot de passe ne figure dans vos fichiers.',
    },
  ];

  const productions = [
    ['Avatar parlant', 'Courte vidéo (30 à 60 s) présentant un sujet à partir d’un script relu.', 'HeyGen / Studio Vidéo'],
    ['Montage vidéo', 'Vidéo avec sous-titres synchronisés, transitions sobres et voix off.', 'CapCut / Export WebM'],
    ['Résumé structuré', 'Synthèse claire du cours ou TP générée puis vérifiée.', 'NotebookLM / Gemini'],
    ['Podcast audio', 'Épisode audio à deux voix (Amira & Yassine) à partir de vos sources.', 'NotebookLM / Gemini TTS'],
    ['Carte mentale', 'Représentation des concepts clés et de leurs liens logiques.', 'NotebookLM / Canva'],
    ['PowerPoint interactif avec voix', 'Diaporama avec menu cliquable et script de narration orale.', 'PowerPoint / Canva / Gamma'],
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
        <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
          Digital Skills · Chapitre 3
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Création de contenu texte, image, audio & vidéo
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Déclinaison d’un même sujet pédagogique en 6 formats complémentaires avec outils
          libres de droits et studio intégré.
        </p>
      </div>

      {/* 6 productions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productions.map(([title, desc, tools]) => (
          <div
            key={title}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2"
          >
            <div className="text-xs font-mono text-blue-700 dark:text-blue-400">{tools}</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
          </div>
        ))}
      </div>

      {/* Interactive PowerPoint with clickable menu */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Diaporama interactif avec menu cliquable et script vocal
          </h3>
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {interactiveSlides.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => setActiveSlide(i)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                  activeSlide === i
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Diapo {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-slate-950 text-slate-100 p-6 space-y-4">
          <h4 className="text-xl font-bold text-blue-400">
            {interactiveSlides[activeSlide].title}
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed">
            {interactiveSlides[activeSlide].body}
          </p>
          <p className="text-xs font-mono text-slate-400 border-t border-slate-800 pt-3">
            {interactiveSlides[activeSlide].script}
          </p>
        </div>
      </section>

      {/* Quick launch into Media Studio for courses */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Résumés, Podcasts & Vidéos générés depuis vos cours
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.slice(0, 6).map((res) => (
            <div
              key={res.id}
              className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {res.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {res.generatedPack ? 'Résumé prêt' : 'À résumer'}
                  {res.podcastAudioBase64 ? ' · Podcast WAV' : ''}
                  {res.videoWebmBase64 ? ' · Vidéo WebM' : ''}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenStudio(res.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-medium text-white shrink-0 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Studio
              </button>
            </div>
          ))}
        </div>
      </section>

      <AiTransparencyFooter
        tools="NotebookLM, Gemini TTS, Canva, CapCut"
        aiRole="Synthèse des scripts de narration et génération audio multi-voix."
        selfWork="Rédaction et relecture des scripts, structuration du diaporama et export."
        sources="Support Digital Skills ISET Nabeul"
      />
    </div>
  );
};

/* =========================================================
   5. PYTHON VIEW
========================================================= */
export const PythonView: React.FC = () => (
  <div className="space-y-8">
    <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
      <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
        Fondamental IT & Développement · Python 3
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
        3 Mini-Projets Python dans VS Code
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
        Problème posé, code source complet, explication du fonctionnement, trace console et
        résolution des difficultés rencontrées.
      </p>
    </div>

    <div className="space-y-6">
      {PYTHON_PROJECTS.map((proj) => (
        <section
          key={proj.title}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <FileCode2 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {proj.title}
            </h3>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-semibold">Problème : </span>
            {proj.problem}
          </p>
          <CodeBlock code={proj.code} language="python" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Explication & difficultés rencontrées
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {proj.explanation}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {proj.difficulty}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Terminal className="h-3.5 w-3.5" />
                Exécution console
              </div>
              <pre className="rounded-lg bg-slate-950 text-emerald-300 p-3 text-xs font-mono overflow-x-auto">
                {proj.output}
              </pre>
            </div>
          </div>
        </section>
      ))}
    </div>

    <AiTransparencyFooter
      tools="VS Code, Python 3.12, Gemini"
      aiRole="Compréhension des exceptions ValueError/ZeroDivisionError après mes propres essais."
      selfWork="Conception de l'algorithme, écriture des fonctions et tests en terminal."
      sources="https://docs.python.org/fr/3/"
    />
  </div>
);

/* =========================================================
   6. LANGAGE C VIEW
========================================================= */
export const LangageCView: React.FC = () => (
  <div className="space-y-8">
    <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
      <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
        Fondamental IT & Développement · Langage C (GCC)
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
        Programmes C & Comparatif Python / C
      </h2>
    </div>

    <div className="space-y-6">
      {C_PROGRAMS.map((prog) => (
        <section
          key={prog.title}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {prog.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Notions : {prog.notions}
          </p>
          <CodeBlock code={prog.code} language="c (gcc -Wall)" />
        </section>
      ))}
    </div>

    <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
        Tableau comparatif Python vs Langage C
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs text-slate-500 dark:text-slate-400">
              <th className="py-2 pr-4 font-medium">Critère</th>
              <th className="py-2 pr-4 font-medium">Python</th>
              <th className="py-2 font-medium">Langage C</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {PYTHON_VS_C_TABLE.map((row) => (
              <tr key={row.critere}>
                <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-slate-100">
                  {row.critere}
                </td>
                <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">
                  {row.python}
                </td>
                <td className="py-3 text-slate-700 dark:text-slate-300">{row.c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <AiTransparencyFooter
      tools="VS Code, Compilateur GCC, Gemini"
      aiRole="Explication des avertissements du compilateur sur les pointeurs."
      selfWork="Écriture des programmes, gestion de malloc/free et rédaction du tableau comparatif."
      sources="Cours Fondamental IT ISET Nabeul · ISO C11"
    />
  </div>
);

/* =========================================================
   7. ALGORITHMIQUE VIEW + INTERACTIVE SORT VISUALIZER
========================================================= */
export const AlgorithmiqueView: React.FC = () => {
  const [arr, setArr] = useState<number[]>([42, 18, 75, 29, 63, 11, 54]);
  const [iIdx, setIIdx] = useState(0);
  const [jIdx, setJIdx] = useState(0);
  const [sorted, setSorted] = useState(false);
  const [running, setRunning] = useState(false);

  const stepBubble = () => {
    if (sorted) return;
    const next = [...arr];
    if (next[jIdx] > next[jIdx + 1]) {
      const tmp = next[jIdx];
      next[jIdx] = next[jIdx + 1];
      next[jIdx + 1] = tmp;
    }
    let nextJ = jIdx + 1;
    let nextI = iIdx;
    if (nextJ >= next.length - 1 - nextI) {
      nextJ = 0;
      nextI += 1;
    }
    if (nextI >= next.length - 1) {
      setSorted(true);
      setRunning(false);
    }
    setArr(next);
    setIIdx(nextI);
    setJIdx(nextJ);
  };

  useEffect(() => {
    if (!running || sorted) return;
    const timer = setTimeout(stepBubble, 450);
    return () => clearTimeout(timer);
  });

  const resetArray = () => {
    setRunning(false);
    setSorted(false);
    setIIdx(0);
    setJIdx(0);
    setArr(
      Array.from({ length: 7 }, () => Math.floor(Math.random() * 80) + 12)
    );
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
        <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
          Fondamental IT · Algorithmique
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Algorithmes fondamentaux & Visualiseur de tri
        </h2>
      </div>

      {/* Interactive Bubble Sort Visualizer */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Animation interactive : Tri à bulles (Bubble Sort)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {sorted
                ? 'Tableau entièrement trié !'
                : `Comparaison des indices ${jIdx} et ${jIdx + 1} (passe ${iIdx + 1})`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRunning(!running)}
              disabled={sorted}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-medium text-white cursor-pointer disabled:opacity-50"
            >
              {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {running ? 'Pause' : 'Démarrer'}
            </button>
            <button
              type="button"
              onClick={stepBubble}
              disabled={running || sorted}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-medium cursor-pointer disabled:opacity-50"
            >
              <SkipForward className="h-3.5 w-3.5" />
              Étape
            </button>
            <button
              type="button"
              onClick={resetArray}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-medium cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Aléatoire
            </button>
          </div>
        </div>

        <div className="h-48 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 flex items-end justify-around gap-2">
          {arr.map((val, idx) => {
            const isComparing = !sorted && (idx === jIdx || idx === jIdx + 1);
            const isDone = sorted || idx >= arr.length - iIdx;
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-end h-full w-full max-w-[64px] gap-1.5"
              >
                <span className="text-xs font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-300">
                  {val}
                </span>
                <div
                  style={{ height: `${val}%` }}
                  className={`w-full rounded-t-md transition-all duration-200 ${
                    isDone
                      ? 'bg-emerald-600'
                      : isComparing
                      ? 'bg-blue-600'
                      : 'bg-slate-400 dark:bg-slate-600'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* 3 Algorithms */}
      <div className="space-y-6">
        {ALGORITHMS_DATA.map((algo) => (
          <section
            key={algo.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {algo.title}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">{algo.idea}</p>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Trace : {algo.stepByStep}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CodeBlock code={algo.pseudocode} language="pseudo-code" />
              <CodeBlock code={algo.cCode} language="traduction C" />
            </div>
          </section>
        ))}
      </div>

      <AiTransparencyFooter
        tools="VS Code, Gemini"
        aiRole="Vérification de la complexité asymptotique et traces pas à pas."
        selfWork="Écriture du pseudo-code, implémentation du visualiseur de tri et traduction en C."
        sources="Cours Algorithmique 1ère année ISET Nabeul"
      />
    </div>
  );
};
