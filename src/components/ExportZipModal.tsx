import React, { useState } from 'react';
import {
  Check,
  Cloud,
  Code2,
  Copy,
  Download,
  FolderTree,
  Loader2,
  Terminal,
} from 'lucide-react';
import { generatePortfolioZip } from '../lib/zipGenerator';
import type { CourseResource, StudentProfile } from '../types/portfolio';

interface ExportZipViewProps {
  profile: StudentProfile;
  resources: CourseResource[];
}

export const ExportZipView: React.FC<ExportZipViewProps> = ({
  profile,
  resources,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const audioCount = resources.filter((r) => r.podcastAudioBase64).length;
  const videoCount = resources.filter((r) => r.videoWebmBase64).length;
  const summaryCount = resources.filter((r) => r.generatedPack).length;

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const blob = await generatePortfolioZip(profile, resources);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profile.repoName || 'portfolio-numerique'}.zip`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } finally {
      setDownloading(false);
    }
  };

  const copyCommand = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 1800);
  };

  const gitCommands = `cd ${profile.repoName || 'portfolio-numerique'}
code .
git init
git add .
git commit -m "Initialisation Portfolio Numérique ISET Nabeul"
git branch -M main
git remote add origin https://github.com/${profile.githubUsername || 'prenom-nom'}/${profile.repoName || 'portfolio-numerique'}.git
git push -u origin main`;

  const gcloudCommand = `gcloud run deploy ${profile.repoName || 'portfolio-numerique'} \\
  --source . \\
  --platform managed \\
  --region europe-west1 \\
  --allow-unauthenticated`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-medium tracking-wide text-blue-700 dark:text-blue-400">
            Livrable Final · GitHub Pages · Visual Studio Code · Google Cloud Run
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
            Exporter le site complet en archive ZIP
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Téléchargez l’arborescence exacte exigée par le guide d’accompagnement (HTML, CSS,
            JavaScript, fiches « Transparence IA », configuration VS Code, Dockerfile Google
            Cloud et tous vos résumés, podcasts WAV et vidéos WebM générés).
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadZip}
          disabled={downloading}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-3 text-sm font-semibold text-white shrink-0 cursor-pointer disabled:opacity-60"
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span>
            {downloading
              ? 'Compression ZIP...'
              : `Télécharger ${profile.repoName || 'portfolio-numerique'}.zip`}
          </span>
        </button>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Pages HTML</div>
          <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            10 pages
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">TP & Cours inclus</div>
          <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {resources.length}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Résumés & Podcasts</div>
          <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {summaryCount} · {audioCount} WAV
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Vidéos exportées</div>
          <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {videoCount} WebM
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Repo Tree */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-base">
            <FolderTree className="h-4 w-4 text-blue-600" />
            Structure du dépôt ZIP
          </div>
          <pre className="rounded-lg bg-slate-950 text-slate-200 p-4 text-xs font-mono leading-relaxed overflow-x-auto">
{`${profile.repoName || 'portfolio-numerique'}/
├── index.html
├── css/style.css
├── js/script.js
├── digital-skills/
│   ├── cybersecurite.html
│   ├── prompt-engineering.html
│   └── creation-contenu.html
├── developpement/
│   ├── python.html
│   ├── langage-c.html
│   └── algorithmique.html
├── systemes/
│   ├── systemes-exploitation.html
│   └── architecture-electronique.html
├── tp-iset-nabeul/
│   └── index.html
├── medias/          (${summaryCount} .md, ${audioCount} .wav, ${videoCount} .webm)
├── .vscode/
│   ├── settings.json
│   └── extensions.json
├── Dockerfile
├── nginx.conf
└── README.md`}
          </pre>
        </div>

        {/* VS Code + GitHub + Google Cloud */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                <Code2 className="h-4 w-4 text-blue-600" />
                1. Ouvrir dans VS Code & publier sur GitHub Pages
              </div>
              <button
                type="button"
                onClick={() => copyCommand('git', gitCommands)}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 cursor-pointer"
              >
                {copiedCmd === 'git' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedCmd === 'git' ? 'Copié' : 'Copier'}
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Extrayez le ZIP, ouvrez le dossier dans <strong>VS Code</strong> (les extensions
              Live Server, Prettier, Python et C/C++ sont pré-configurées), puis exécutez :
            </p>
            <pre className="rounded-lg bg-slate-950 text-slate-200 p-4 text-xs font-mono overflow-x-auto">
              {gitCommands}
            </pre>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Sur GitHub : <strong>Settings → Pages → Branch : main → Save</strong>. Votre site
              sera en ligne sur{' '}
              <span className="font-mono text-blue-700 dark:text-blue-400">
                https://{profile.githubUsername || 'prenom-nom'}.github.io/
                {profile.repoName || 'portfolio-numerique'}/
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                <Cloud className="h-4 w-4 text-blue-600" />
                2. Déployer avec Google Cloud (Cloud Run)
              </div>
              <button
                type="button"
                onClick={() => copyCommand('gcloud', gcloudCommand)}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 cursor-pointer"
              >
                {copiedCmd === 'gcloud' ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedCmd === 'gcloud' ? 'Copié' : 'Copier'}
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Le fichier <code className="font-mono">Dockerfile</code> inclus dans le ZIP
              permet de déployer directement votre portfolio sur Google Cloud Run via Google
              Cloud CLI :
            </p>
            <pre className="rounded-lg bg-slate-950 text-slate-200 p-4 text-xs font-mono overflow-x-auto">
              {gcloudCommand}
            </pre>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-start gap-3">
            <Terminal className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Sécurité avant publication GitHub
              </p>
              <p>
                L’archive générée ne contient aucune clé API, aucun mot de passe ni aucun jeton
                Google OAuth : elle est prête pour un dépôt GitHub public conforme à la règle
                d’or n°5 du guide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
