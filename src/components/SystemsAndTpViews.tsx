import React, { useState } from 'react';
import { Cpu, FolderGit2, Sparkles, Terminal, Zap } from 'lucide-react';
import { AiTransparencyFooter } from './DigitalSkillsAndDevViews';
import type { CourseResource, TargetModuleCategory } from '../types/portfolio';

/* =========================================================
   8. SYSTEMES D'EXPLOITATION VIEW
========================================================= */
export const SystemesExploitationView: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<
    'processus' | 'memoire' | 'fichiers' | 'peripheriques'
  >('processus');

  const rolesInfo = {
    processus: {
      title: 'Gestion des processus (Ordonnanceur)',
      detail:
        "Le noyau alloue le temps CPU entre les programmes actifs (multitâche préemptif), crée et termine les processus, et gère leur état (Prêt, Élu, Bloqué).",
      commands: 'ps aux · top · htop · kill -9 PID',
    },
    memoire: {
      title: 'Gestion de la mémoire vive (RAM)',
      detail:
        "L'OS attribue un espace mémoire isolé à chaque processus, gère la mémoire virtuelle (pagination / swap) et protège les zones système.",
      commands: 'free -h · vmstat · cat /proc/meminfo',
    },
    fichiers: {
      title: 'Système de fichiers & Droits',
      detail:
        "Organisation hiérarchique des répertoires (ext4, NTFS, APFS), contrôle des permissions lecture/écriture/exécution (rwx) et montage des disques.",
      commands: 'ls -la · pwd · chmod 755 · df -h',
    },
    peripheriques: {
      title: 'Gestion des périphériques (Pilotes)',
      detail:
        "Interface matérielle standardisée via les pilotes (drivers) : clavier, écran, carte réseau, ports USB et cartes d'acquisition.",
      commands: 'lsusb · lspci · dmesg | tail',
    },
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
        <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
          Systèmes & Fondements · Chapitre 1
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Systèmes d’exploitation (OS)
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Rôle du noyau, comparaison Windows / Linux / macOS et commandes essentielles sous
          terminal Linux et PowerShell.
        </p>
      </div>

      {/* Interactive OS Kernel Diagram */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          01. Schéma interactif du rôle d’un système d’exploitation
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 grid grid-cols-2 gap-3">
            {(
              [
                ['processus', 'Processus & CPU'],
                ['memoire', 'Mémoire RAM'],
                ['fichiers', 'Fichiers & Droits'],
                ['peripheriques', 'Périphériques & E/S'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedRole(key)}
                className={`rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                  selectedRole === key
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="text-xs font-mono text-blue-600 dark:text-blue-400">
                  Noyau OS
                </div>
                <div className="text-sm font-bold mt-1">{label}</div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 space-y-3">
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {rolesInfo[selectedRole].title}
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {rolesInfo[selectedRole].detail}
            </p>
            <div className="rounded-lg bg-slate-900 text-emerald-300 px-3 py-2 text-xs font-mono">
              $ {rolesInfo[selectedRole].commands}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          02. Comparatif Windows / Linux / macOS
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs text-slate-500 dark:text-slate-400">
                <th className="py-2 pr-4">Critère</th>
                <th className="py-2 pr-4">Windows 11</th>
                <th className="py-2 pr-4">Linux (Ubuntu / Debian)</th>
                <th className="py-2">macOS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-3 pr-4 font-semibold">Licence & Noyau</td>
                <td className="py-3 pr-4">Propriétaire · Noyau NT</td>
                <td className="py-3 pr-4">Open Source (GPL) · Noyau Linux</td>
                <td className="py-3">Propriétaire · XNU (Unix)</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold">Système de fichiers</td>
                <td className="py-3 pr-4">NTFS</td>
                <td className="py-3 pr-4">ext4, Btrfs</td>
                <td className="py-3">APFS</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold">Terminal natif</td>
                <td className="py-3 pr-4">PowerShell / CMD</td>
                <td className="py-3 pr-4">Bash / Zsh</td>
                <td className="py-3">Zsh / Terminal</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold">Points forts ISET</td>
                <td className="py-3 pr-4">Bureautique, CAO électrique</td>
                <td className="py-3 pr-4">Serveurs, Cloud, GCC, Python, Git</td>
                <td className="py-3">Développement Unix & création</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Terminal Tutorial */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            03. Mini-tutoriel de commandes essentielles (Linux Bash & PowerShell)
          </h3>
        </div>
        <pre className="rounded-xl bg-slate-950 text-slate-100 p-4 text-xs font-mono leading-relaxed overflow-x-auto">
{`# 1. Créer un dossier de TP et naviguer (Linux / PowerShell)
mkdir tp-iset-nabeul && cd tp-iset-nabeul
pwd                       # Afficher le chemin courant

# 2. Lister avec droits et fichiers cachés
ls -la                    # Sous PowerShell : Get-ChildItem -Force

# 3. Compiler et exécuter un TP en C
gcc -Wall main.c -o programme
./programme

# 4. Filtrer un fichier de logs ou un cours
grep -i "ohm" notes_electrique.txt`}
        </pre>
      </section>

      <AiTransparencyFooter
        tools="Terminal Linux Ubuntu, PowerShell, Gemini"
        aiRole="Relecture des tableaux comparatifs et équivalences Bash / PowerShell."
        selfWork="Tests des commandes en TP et conception du schéma interactif."
        sources="Documentation Ubuntu, Microsoft Learn PowerShell"
      />
    </div>
  );
};

/* =========================================================
   9. ARCHITECTURE, NUMERATION & SYSTEME ELECTRIQUE VIEW
========================================================= */
type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR';

function computeGate(gate: GateType, a: boolean, b: boolean): boolean {
  switch (gate) {
    case 'AND':
      return a && b;
    case 'OR':
      return a || b;
    case 'NOT':
      return !a;
    case 'NAND':
      return !(a && b);
    case 'NOR':
      return !(a || b);
    case 'XOR':
      return a !== b;
  }
}

export const ArchitectureElectroniqueView: React.FC = () => {
  // Binary / Hex converter
  const [decValue, setDecValue] = useState(42);
  const clamped = Math.max(0, Math.min(255, Number.isFinite(decValue) ? decValue : 0));
  const binStr = clamped.toString(2).padStart(8, '0');
  const hexStr = clamped.toString(16).toUpperCase().padStart(2, '0');

  const toggleBit = (bitPosFromLeft: number) => {
    const mask = 1 << (7 - bitPosFromLeft);
    setDecValue(clamped ^ mask);
  };

  // Logic gate simulator
  const [gate, setGate] = useState<GateType>('AND');
  const [inA, setInA] = useState(true);
  const [inB, setInB] = useState(false);
  const outS = computeGate(gate, inA, inB);

  // Electrical Systems Calculator (Ohm + Voltage Divider)
  const [vin, setVin] = useState(12);
  const [r1, setR1] = useState(4700);
  const [r2, setR2] = useState(10000);
  const totalR = Math.max(1, r1 + r2);
  const currentMa = (vin / totalR) * 1000;
  const vout = vin * (r2 / totalR);
  const powerMw = vin * (vin / totalR) * 1000;

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
        <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
          Systèmes Électriques & Architecture des Ordinateurs
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Architecture Von Neumann, Numération, Électrique & Portes Logiques
        </h2>
      </div>

      {/* Von Neumann */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            01. Architecture d’un ordinateur (Modèle de Von Neumann)
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ['Processeur (CPU)', 'Unité de Contrôle (UC) + Unité Arithmétique et Logique (UAL) + Registres rapides.'],
            ['Mémoire Centrale (RAM)', 'Stocke les instructions du programme en cours et les données manipulées.'],
            ['Entrées / Sorties (E/S)', 'Interfaces avec clavier, écran, stockage SSD, capteurs et réseau.'],
            ['Bus Système', 'Bus de données (bidirectionnel), bus d’adresses et bus de contrôle.'],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1.5"
            >
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {title}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Binary / Hex Interactive Converter */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          02. Systèmes de numération : Binaire, Décimal & Hexadécimal (8 bits)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Valeur décimale (0 – 255)
            </label>
            <input
              type="number"
              min={0}
              max={255}
              value={clamped}
              onChange={(e) => setDecValue(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-lg font-mono tabular-nums font-bold"
            />
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
            <div className="text-xs text-slate-500">Binaire (Base 2)</div>
            <div className="text-lg font-mono tabular-nums font-bold text-blue-700 dark:text-blue-400">
              0b{binStr}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
            <div className="text-xs text-slate-500">Hexadécimal (Base 16)</div>
            <div className="text-lg font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
              0x{hexStr}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cliquez sur chaque bit pour basculer entre 0 et 1 :
          </p>
          <div className="grid grid-cols-8 gap-2">
            {binStr.split('').map((bit, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => toggleBit(idx)}
                className={`rounded-lg border py-2.5 text-center font-mono transition-colors cursor-pointer ${
                  bit === '1'
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-base font-bold tabular-nums">{bit}</div>
                <div className="text-[10px] opacity-75 tabular-nums">
                  2^{7 - idx}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Système Électrique : Loi d'Ohm & Pont Diviseur */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            03. Systèmes Électriques : Loi d’Ohm & Pont diviseur de tension
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Tension d’entrée Vin (V) : <span className="font-mono">{vin} V</span>
            </label>
            <input
              type="range"
              min={1}
              max={24}
              step={0.5}
              value={vin}
              onChange={(e) => setVin(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Résistance R1 (Ω) : <span className="font-mono">{r1} Ω</span>
            </label>
            <input
              type="range"
              min={100}
              max={20000}
              step={100}
              value={r1}
              onChange={(e) => setR1(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Résistance R2 (Ω) : <span className="font-mono">{r2} Ω</span>
            </label>
            <input
              type="range"
              min={100}
              max={20000}
              step={100}
              value={r2}
              onChange={(e) => setR2(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
            <div className="text-xs text-slate-500">Vout = Vin · R2 / (R1 + R2)</div>
            <div className="text-xl font-bold font-mono tabular-nums text-blue-700 dark:text-blue-400 mt-1">
              {vout.toFixed(2)} V
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
            <div className="text-xs text-slate-500">Courant I = Vin / (R1 + R2)</div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
              {currentMa.toFixed(2)} mA
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
            <div className="text-xs text-slate-500">Puissance totale P = U · I</div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
              {powerMw.toFixed(2)} mW
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Logic Gates Simulator */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            04. Simulateur interactif de Portes Logiques & Table de vérité
          </h3>
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR'] as GateType[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGate(g)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-md cursor-pointer ${
                  gate === g
                    ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Interactive switches + visual gate */}
          <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 flex items-center justify-between gap-4">
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setInA(!inA)}
                className={`block w-28 rounded-lg border px-3 py-2 text-xs font-mono font-bold cursor-pointer ${
                  inA
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                Entrée A = {inA ? '1' : '0'}
              </button>
              {gate !== 'NOT' && (
                <button
                  type="button"
                  onClick={() => setInB(!inB)}
                  className={`block w-28 rounded-lg border px-3 py-2 text-xs font-mono font-bold cursor-pointer ${
                    inB
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Entrée B = {inB ? '1' : '0'}
                </button>
              )}
            </div>

            <div className="rounded-xl border-2 border-slate-400 dark:border-slate-600 px-5 py-4 font-mono font-bold text-base text-slate-900 dark:text-slate-100">
              {gate}
            </div>

            <div
              className={`rounded-xl border px-4 py-3 text-center font-mono ${
                outS
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="text-[11px]">Sortie S</div>
              <div className="text-lg font-bold tabular-nums">{outS ? '1 (HIGH)' : '0 (LOW)'}</div>
            </div>
          </div>

          {/* Truth Table */}
          <div className="lg:col-span-6 overflow-x-auto">
            <table className="w-full text-sm font-mono tabular-nums">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs text-slate-500">
                  <th className="py-2">A</th>
                  {gate !== 'NOT' && <th className="py-2">B</th>}
                  <th className="py-2">Sortie S ({gate})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(gate === 'NOT'
                  ? [
                      [false, false],
                      [true, false],
                    ]
                  : [
                      [false, false],
                      [false, true],
                      [true, false],
                      [true, true],
                    ]
                ).map(([a, b], idx) => {
                  const res = computeGate(gate, a, b);
                  const activeRow =
                    a === inA && (gate === 'NOT' || b === inB);
                  return (
                    <tr
                      key={idx}
                      className={
                        activeRow
                          ? 'bg-blue-50 dark:bg-blue-950/40 font-bold text-blue-700 dark:text-blue-300'
                          : ''
                      }
                    >
                      <td className="py-2">{a ? '1' : '0'}</td>
                      {gate !== 'NOT' && <td className="py-2">{b ? '1' : '0'}</td>}
                      <td className="py-2">{res ? '1' : '0'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <AiTransparencyFooter
        tools="Simulateur logique intégré, VS Code, Gemini"
        aiRole="Vérification des formules du pont diviseur et des tables de vérité."
        selfWork="Réalisation des calculateurs interactifs Binaire/Hexa, Loi d’Ohm et Portes logiques."
        sources="Cours Systèmes Électriques & Architecture ISET Nabeul"
      />
    </div>
  );
};

/* =========================================================
   10. TP ISET NABEUL VIEW
========================================================= */
export const TpIsetNabeulView: React.FC<{
  resources: CourseResource[];
  onOpenInStudio: (id: string) => void;
  onGoClassroom: () => void;
}> = ({ resources, onOpenInStudio, onGoClassroom }) => {
  const [filter, setFilter] = useState<'all' | TargetModuleCategory>('all');

  const filtered =
    filter === 'all'
      ? resources
      : resources.filter((r) => r.moduleTarget === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
            ISET Nabeul · Travaux Pratiques & Cours Importés
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Les TP ISET Nabeul & Cours Google Classroom
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Retrouvez ici les TP officiels de 1ère année ainsi que tous les cours et devoirs
            synchronisés depuis votre espace Google Classroom.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoClassroom}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-medium text-white shrink-0 cursor-pointer"
        >
          <FolderGit2 className="h-4 w-4" />
          Importer depuis Classroom
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
        {(
          [
            ['all', `Tous (${resources.length})`],
            ['tp-iset-nabeul', 'TP ISET Nabeul'],
            ['digital-skills', 'Digital Skills'],
            ['fondamental-it', 'Fondamental IT'],
            ['systemes-electriques', 'Systèmes Électriques'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === key
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* TP Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {res.courseName} · {res.createdAt}
                {res.generatedPack ? ' · Résumé généré' : ''}
                {res.podcastAudioBase64 ? ' · Podcast WAV' : ''}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {res.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {res.generatedPack
                  ? res.generatedPack.summary.overview
                  : res.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {res.sourceType === 'classroom-tp'
                  ? 'Google Classroom TP'
                  : res.sourceType === 'classroom-cours'
                  ? 'Google Classroom Cours'
                  : res.sourceType === 'upload'
                  ? 'Document importé'
                  : 'TP ISET Nabeul'}
              </span>
              <button
                type="button"
                onClick={() => onOpenInStudio(res.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3.5 py-2 text-xs font-medium text-white cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Résumé, Podcast & Vidéo
              </button>
            </div>
          </div>
        ))}
      </div>

      <AiTransparencyFooter
        tools="Google Classroom API, Gemini AI, Gemini TTS, VS Code"
        aiRole="Extraction de PDF et structuration des résumés, podcasts et diapositives."
        selfWork="Réalisation des TP en laboratoire à l'ISET Nabeul, sélection et vérification des rendus."
        sources="Google Classroom ISET Nabeul · Guide Portfolio Numérique"
      />
    </div>
  );
};
