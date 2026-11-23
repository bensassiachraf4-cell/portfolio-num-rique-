import React, { useState } from 'react';
import { Download, ExternalLink, Github, Loader2 } from 'lucide-react';
import type { CourseResource, TargetModuleCategory } from '../types/portfolio';

interface RepositoryImporterProps {
  onImportResource: (resource: CourseResource, openInStudio?: boolean) => void;
}

const TEXT_EXTENSIONS = /\.(md|txt|html?|css|js|jsx|ts|tsx|json|c|h|py|csv|xml|yml|yaml)$/i;
const MAX_FILE_BYTES = 1_000_000;

export const RepositoryImporter: React.FC<RepositoryImporterProps> = ({ onImportResource }) => {
  const [repository, setRepository] = useState('bensassiachraf4-cell/portfolio-num-rique-');
  const [ref, setRef] = useState('main');
  const [files, setFiles] = useState<Array<{ path: string; size: number }>>([]);
  const [targetModule, setTargetModule] = useState<TargetModuleCategory>('fondamental-it');
  const [busy, setBusy] = useState(false);
  const [loadingPath, setLoadingPath] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const browseRepository = async () => {
    const repo = repository.trim().replace(/^https:\/\/github\.com\//, '').replace(/\/$/, '');
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo) || !ref.trim()) {
      setError('Indique un dépôt GitHub public au format propriétaire/dépôt et une branche.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    setFiles([]);
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/git/trees/${encodeURIComponent(ref.trim())}?recursive=1`, {
        headers: { Accept: 'application/vnd.github+json' },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Impossible de lire ce dépôt public.');
      const candidates = (data.tree || [])
        .filter((entry: { type: string; path: string; size?: number }) =>
          entry.type === 'blob' && TEXT_EXTENSIONS.test(entry.path) && (entry.size || 0) <= MAX_FILE_BYTES
        )
        .map((entry: { path: string; size?: number }) => ({ path: entry.path, size: entry.size || 0 }))
        .slice(0, 150);
      setFiles(candidates);
      setMessage(data.truncated ? 'Liste partielle (limite GitHub atteinte).' : `${candidates.length} fichier(s) de cours et de code disponibles.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la lecture du dépôt.');
    } finally {
      setBusy(false);
    }
  };

  const importFile = async (path: string) => {
    const repo = repository.trim().replace(/^https:\/\/github\.com\//, '').replace(/\/$/, '');
    setLoadingPath(path);
    setError('');
    try {
      const rawUrl = `https://raw.githubusercontent.com/${repo}/${encodeURIComponent(ref.trim())}/${path.split('/').map(encodeURIComponent).join('/')}`;
      const response = await fetch(rawUrl);
      if (!response.ok) throw new Error('Le contenu de ce fichier est inaccessible. Vérifie que le dépôt est public.');
      const rawContent = await response.text();
      const title = path.split('/').pop()?.replace(/\.[^.]+$/, '') || path;
      const lower = `${path} ${title}`.toLocaleLowerCase('fr');
      const moduleTarget: TargetModuleCategory = /tp|travaux.?pratiques/.test(lower)
        ? 'tp-iset-nabeul'
        : /electric|electri|circuit/.test(lower)
          ? 'systemes-electriques'
          : /digital|cyber/.test(lower)
            ? 'digital-skills'
            : targetModule;
      const resource: CourseResource = {
        id: `github-${repo.replace(/[^\w-]/g, '-')}-${path.replace(/[^\w-]/g, '-')}`,
        title,
        moduleTarget,
        sourceType: 'upload',
        courseName: `GitHub · ${repo}`,
        description: `Importé depuis ${repo}/${path}`,
        rawContent,
        alternateLink: `https://github.com/${repo}/blob/${ref.trim()}/${path}`,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      onImportResource(resource, true);
      setMessage(`« ${title} » importé dans le Studio Média.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Échec de l’importation.');
    } finally {
      setLoadingPath('');
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6" aria-labelledby="repository-import-title">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-slate-100 p-2.5 text-slate-800 dark:bg-slate-800 dark:text-slate-100"><Github className="h-5 w-5" /></span>
        <div>
          <h3 id="repository-import-title" className="font-semibold text-slate-900 dark:text-slate-100">Importer depuis un dépôt GitHub public</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Parcours les fichiers texte du dépôt, puis importe uniquement les cours ou TP sélectionnés. Les fichiers PDF peuvent être importés depuis Classroom ou ton appareil.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_150px_auto]">
        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Dépôt public
          <input value={repository} onChange={(e) => setRepository(e.target.value)} placeholder="propriétaire/dépôt" className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
        </label>
        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Branche
          <input value={ref} onChange={(e) => setRef(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
        </label>
        <button type="button" onClick={browseRepository} disabled={busy} className="self-end inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}{busy ? 'Chargement…' : 'Parcourir'}
        </button>
      </div>
      <label className="mt-3 block text-xs font-medium text-slate-600 dark:text-slate-300">Classer par défaut
        <select value={targetModule} onChange={(e) => setTargetModule(e.target.value as TargetModuleCategory)} className="ml-2 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950">
          <option value="digital-skills">Digital Skills</option><option value="fondamental-it">Fundamental IT</option><option value="systemes-electriques">Systèmes électriques</option><option value="tp-iset-nabeul">TP ISET Nabeul</option>
        </select>
      </label>
      {message && <p role="status" className="mt-3 text-sm text-emerald-700 dark:text-emerald-300">{message}</p>}
      {error && <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-300">{error}</p>}
      {files.length > 0 && <ul className="mt-4 max-h-72 divide-y divide-slate-200 overflow-auto rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
        {files.map((file) => <li key={file.path} className="flex items-center justify-between gap-3 px-3 py-2.5">
          <div className="min-w-0"><p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{file.path}</p><p className="text-xs text-slate-500">{Math.ceil(file.size / 1024)} Ko</p></div>
          <div className="flex shrink-0 items-center gap-3"><a href={`https://github.com/${repository.trim().replace(/^https:\/\/github\.com\//, '').replace(/\/$/, '')}/blob/${ref}/${file.path}`} target="_blank" rel="noreferrer" aria-label={`Voir ${file.path} sur GitHub`} className="text-slate-500 hover:text-blue-600"><ExternalLink className="h-4 w-4" /></a><button type="button" onClick={() => importFile(file.path)} disabled={Boolean(loadingPath)} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{loadingPath === file.path ? 'Import…' : 'Importer'}</button></div>
        </li>)}
      </ul>}
    </section>
  );
};
