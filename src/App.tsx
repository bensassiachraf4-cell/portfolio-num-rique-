import React, { useEffect, useMemo, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { ClassroomImporter } from './components/ClassroomImporter';
import {
  AccueilView,
  AlgorithmiqueView,
  CreationContenuView,
  CybersecuriteView,
  LangageCView,
  PromptEngineeringView,
  PythonView,
} from './components/DigitalSkillsAndDevViews';
import { ExportZipView } from './components/ExportZipModal';
import { MediaStudio } from './components/MediaStudio';
import {
  ArchitectureElectroniqueView,
  SystemesExploitationView,
  TpIsetNabeulView,
} from './components/SystemsAndTpViews';
import {
  DEFAULT_STUDENT_PROFILE,
  INITIAL_COURSE_RESOURCES,
} from './data/curriculumData';
import type {
  CourseResource,
  ModuleId,
  StudentProfile,
} from './types/portfolio';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('accueil');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('portfolio_theme') === 'dark';
  });

  const [profile, setProfile] = useState<StudentProfile>(() => {
    if (typeof window === 'undefined') return DEFAULT_STUDENT_PROFILE;
    try {
      const saved = window.localStorage.getItem('portfolio_profile');
      return saved ? (JSON.parse(saved) as StudentProfile) : DEFAULT_STUDENT_PROFILE;
    } catch {
      return DEFAULT_STUDENT_PROFILE;
    }
  });

  const [resources, setResources] = useState<CourseResource[]>(
    INITIAL_COURSE_RESOURCES
  );
  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(
    INITIAL_COURSE_RESOURCES[0]?.id ?? null
  );

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      window.localStorage.setItem('portfolio_theme', 'dark');
    } else {
      root.classList.remove('dark');
      window.localStorage.setItem('portfolio_theme', 'light');
    }
  }, [darkMode]);

  const handleUpdateProfile = (next: StudentProfile) => {
    setProfile(next);
    window.localStorage.setItem('portfolio_profile', JSON.stringify(next));
  };

  const importedIds = useMemo(
    () => new Set(resources.map((r) => r.id)),
    [resources]
  );

  const handleImportResource = (
    resource: CourseResource,
    openInStudio = false
  ) => {
    setResources((prev) => {
      const exists = prev.some((r) => r.id === resource.id);
      if (exists) {
        return prev.map((r) => (r.id === resource.id ? { ...r, ...resource } : r));
      }
      return [resource, ...prev];
    });
    setSelectedStudioId(resource.id);
    if (openInStudio) {
      setActiveModule('studio');
    }
  };

  const handleUpdateResource = (
    id: string,
    patch: Partial<CourseResource>
  ) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  };

  const handleCreateCustomResource = (
    title: string,
    courseName: string,
    rawContent: string
  ) => {
    const created: CourseResource = {
      id: `custom-${Date.now()}`,
      title,
      moduleTarget: 'tp-iset-nabeul',
      sourceType: 'upload',
      courseName: courseName || 'Cours ISET Nabeul',
      description: rawContent.slice(0, 180),
      rawContent,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setResources((prev) => [created, ...prev]);
    setSelectedStudioId(created.id);
  };

  const navigateTo = (id: ModuleId) => {
    setActiveModule(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openInStudio = (resourceId: string) => {
    setSelectedStudioId(resourceId);
    navigateTo('studio');
  };

  const topNavLinks: Array<{ label: string; target: ModuleId; activeMatch: ModuleId[] }> = [
    { label: 'Accueil', target: 'accueil', activeMatch: ['accueil'] },
    {
      label: 'Digital Skills',
      target: 'cybersecurite',
      activeMatch: ['cybersecurite', 'prompt-engineering', 'creation-contenu'],
    },
    {
      label: 'Fondamental IT',
      target: 'python',
      activeMatch: ['python', 'langage-c', 'algorithmique', 'systemes-exploitation', 'architecture-electronique'],
    },
    {
      label: 'TP & Classroom',
      target: 'classroom',
      activeMatch: ['classroom', 'tp-iset-nabeul'],
    },
    { label: 'Studio Média', target: 'studio', activeMatch: ['studio'] },
  ];

  const subTabs: Array<{ id: ModuleId; label: string }> = [
    { id: 'cybersecurite', label: 'Cybersécurité' },
    { id: 'prompt-engineering', label: 'Prompt Engineering' },
    { id: 'creation-contenu', label: 'Création contenu' },
    { id: 'python', label: 'Python' },
    { id: 'langage-c', label: 'Langage C' },
    { id: 'algorithmique', label: 'Algorithmique' },
    { id: 'systemes-exploitation', label: 'Systèmes OS' },
    { id: 'architecture-electronique', label: 'Systèmes Électriques' },
    { id: 'tp-iset-nabeul', label: 'TP ISET Nabeul' },
    { id: 'classroom', label: 'Google Classroom' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#0B1120] dark:text-slate-100">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element Wordmark */}
          <button
            type="button"
            onClick={() => navigateTo('accueil')}
            className="text-lg font-display font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Portfolio ISET Nabeul
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            {topNavLinks.map((link) => {
              const isActive = link.activeMatch.includes(activeModule);
              return (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => navigateTo(link.target)}
                  className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 border-b-2 ${
                    isActive
                      ? 'border-blue-600 text-slate-900 dark:text-white'
                      : 'border-transparent hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigateTo('export')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Exporter ZIP
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
              aria-label="Menu de navigation"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] px-4 py-3 space-y-2">
            {topNavLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => navigateTo(link.target)}
                className="block w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Workspace Chapter Ribbon + Theme Switch (outside header) */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {subTabs.map((tab) => {
              const active = activeModule === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigateTo(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
            aria-label="Basculer le thème"
          >
            {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">
              {darkMode ? 'Mode clair' : 'Mode sombre'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {activeModule === 'accueil' && (
          <AccueilView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onNavigate={navigateTo}
            resources={resources}
          />
        )}
        {activeModule === 'cybersecurite' && <CybersecuriteView />}
        {activeModule === 'prompt-engineering' && <PromptEngineeringView />}
        {activeModule === 'creation-contenu' && (
          <CreationContenuView
            resources={resources}
            onOpenStudio={openInStudio}
          />
        )}
        {activeModule === 'python' && <PythonView />}
        {activeModule === 'langage-c' && <LangageCView />}
        {activeModule === 'algorithmique' && <AlgorithmiqueView />}
        {activeModule === 'systemes-exploitation' && <SystemesExploitationView />}
        {activeModule === 'architecture-electronique' && (
          <ArchitectureElectroniqueView />
        )}
        {activeModule === 'tp-iset-nabeul' && (
          <TpIsetNabeulView
            resources={resources}
            onOpenInStudio={openInStudio}
            onGoClassroom={() => navigateTo('classroom')}
          />
        )}
        {activeModule === 'classroom' && (
          <ClassroomImporter
            onImportResource={handleImportResource}
            importedIds={importedIds}
          />
        )}
        {activeModule === 'studio' && (
          <MediaStudio
            resources={resources}
            selectedResourceId={selectedStudioId}
            onSelectResource={setSelectedStudioId}
            onUpdateResource={handleUpdateResource}
            onCreateCustomResource={handleCreateCustomResource}
          />
        )}
        {activeModule === 'export' && (
          <ExportZipView profile={profile} resources={resources} />
        )}
      </main>

      {/* Clean Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>
            Portfolio Numérique · {profile.fullName} · {profile.campus} ({profile.filiere})
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigateTo('classroom')}
              className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              Google Classroom
            </button>
            <button
              type="button"
              onClick={() => navigateTo('studio')}
              className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              Studio Podcast & Vidéo
            </button>
            <button
              type="button"
              onClick={() => navigateTo('export')}
              className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              Export ZIP GitHub / Cloud
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
