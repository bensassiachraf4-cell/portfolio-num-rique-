import React, { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  FolderGit2,
  Loader2,
  LogOut,
  Paperclip,
  RefreshCw,
  Sparkles,
  Upload,
} from 'lucide-react';
import {
  getAccessToken,
  googleSignIn,
  initAuth,
  logout,
} from '../lib/googleAuth';
import {
  fetchClassroomCourses,
  fetchCourseDetails,
  fetchDriveAttachmentText,
} from '../lib/classroomApi';
import type {
  ClassroomAnnouncement,
  ClassroomCourse,
  ClassroomCourseWork,
  ClassroomCourseWorkMaterial,
  ClassroomMaterialAttachment,
  CourseResource,
  TargetModuleCategory,
} from '../types/portfolio';

interface ClassroomImporterProps {
  onImportResource: (resource: CourseResource, openInStudio?: boolean) => void;
  importedIds: Set<string>;
}

const GUIDE_PDF_URL =
  '/assets/aistudio/Guide_d_accompagnement___Projet___Portfolio_Num_rique___b295f571.pdf';

export const ClassroomImporter: React.FC<ClassroomImporterProps> = ({
  onImportResource,
  importedIds,
}) => {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ClassroomCourse | null>(null);

  const [courseWork, setCourseWork] = useState<ClassroomCourseWork[]>([]);
  const [materials, setMaterials] = useState<ClassroomCourseWorkMaterial[]>([]);
  const [announcements, setAnnouncements] = useState<ClassroomAnnouncement[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'tp' | 'cours' | 'annonces'>('tp');

  const [targetModule, setTargetModule] =
    useState<TargetModuleCategory>('tp-iset-nabeul');
  const [importingId, setImportingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (loggedUser, token) => {
        setUser(loggedUser);
        setAccessToken(token);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const loadCourses = async (token: string) => {
    setLoadingCourses(true);
    setAuthError(null);
    try {
      const list = await fetchClassroomCourses(token);
      setCourses(list);
      if (list.length > 0 && !selectedCourse) {
        await handleSelectCourse(list[0], token);
      }
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : 'Impossible de charger vos cours Google Classroom.'
      );
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      setUser(res.user);
      setAccessToken(res.accessToken);
      setNeedsAuth(false);
      await loadCourses(res.accessToken);
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : 'Connexion Google interrompue ou refusée.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    setNeedsAuth(true);
    setCourses([]);
    setSelectedCourse(null);
    setCourseWork([]);
    setMaterials([]);
    setAnnouncements([]);
  };

  const handleSelectCourse = async (course: ClassroomCourse, explicitToken?: string) => {
    const token = explicitToken || accessToken || getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }
    setSelectedCourse(course);
    setLoadingDetails(true);
    setAuthError(null);
    try {
      const details = await fetchCourseDetails(token, course.id);
      setCourseWork(details.courseWork);
      setMaterials(details.materials);
      setAnnouncements(details.announcements);
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : 'Erreur lors de la récupération du contenu du cours.'
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  const extractAttachmentsText = async (
    attachments: ClassroomMaterialAttachment[] | undefined,
    token: string
  ): Promise<{ combinedText: string; firstDriveId?: string; firstMime?: string }> => {
    if (!attachments || attachments.length === 0) {
      return { combinedText: '' };
    }
    const parts: string[] = [];
    let firstDriveId: string | undefined;
    let firstMime: string | undefined;

    for (const att of attachments) {
      if (att.driveFile?.driveFile) {
        const df = att.driveFile.driveFile;
        if (!firstDriveId) firstDriveId = df.id;
        try {
          const content = await fetchDriveAttachmentText(token, df.id, df.title);
          if (!firstMime) firstMime = content.mimeType;
          parts.push(`--- Pièce jointe : ${df.title} ---\n${content.text}`);
        } catch {
          parts.push(
            `--- Pièce jointe Drive : ${df.title} (${df.alternateLink || ''}) ---`
          );
        }
      } else if (att.link) {
        parts.push(`Lien externe : ${att.link.title || att.link.url} (${att.link.url})`);
      } else if (att.youtubeVideo) {
        parts.push(
          `Vidéo YouTube : ${att.youtubeVideo.title} (${att.youtubeVideo.alternateLink || ''})`
        );
      }
    }

    return {
      combinedText: parts.join('\n\n'),
      firstDriveId,
      firstMime,
    };
  };

  const handleImportItem = async (
    itemId: string,
    title: string,
    description: string,
    sourceType: 'classroom-tp' | 'classroom-cours' | 'classroom-annonce',
    attachments?: ClassroomMaterialAttachment[],
    alternateLink?: string,
    openInStudio = false
  ) => {
    const token = accessToken || getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }

    setImportingId(itemId);
    setStatusMessage(null);
    try {
      const { combinedText, firstDriveId, firstMime } =
        await extractAttachmentsText(attachments, token);

      const fullRawContent = [
        `Titre : ${title}`,
        `Cours : ${selectedCourse?.name || 'Google Classroom'}`,
        description ? `Consigne / Description :\n${description}` : '',
        combinedText,
      ]
        .filter(Boolean)
        .join('\n\n');

      const newRes: CourseResource = {
        id: `gc-${itemId}`,
        title,
        moduleTarget: targetModule,
        sourceType,
        courseName: selectedCourse?.name || 'Google Classroom',
        description:
          description?.slice(0, 220) ||
          `Importé depuis Google Classroom (${selectedCourse?.name || ''})`,
        rawContent: fullRawContent,
        driveFileId: firstDriveId,
        driveMimeType: firstMime,
        alternateLink,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      onImportResource(newRes, openInStudio);
      setStatusMessage(
        openInStudio
          ? `"${title}" importé et ouvert dans le Studio Résumé / Podcast / Vidéo.`
          : `"${title}" importé dans votre portfolio.`
      );
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : "Erreur lors de l'importation."
      );
    } finally {
      setImportingId(null);
    }
  };

  const handleLocalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setAuthError(null);
    setStatusMessage(null);

    try {
      const isText =
        file.type.startsWith('text/') ||
        /\.(txt|md|c|py|html|css|js|ts|json)$/i.test(file.name);

      let extractedText = '';
      if (isText) {
        extractedText = await file.text();
      } else {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i += 0x8000) {
          binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        }
        const base64Data = btoa(binary);
        const res = await fetch('/api/ai/extract-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Data,
            mimeType: file.type || 'application/pdf',
            fileName: file.name,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erreur lecture PDF');
        extractedText = data.extractedText || '';
      }

      const newRes: CourseResource = {
        id: `local-${Date.now()}`,
        title: file.name.replace(/\.[^.]+$/, ''),
        moduleTarget: targetModule,
        sourceType: 'upload',
        courseName: 'Import Local · ISET Nabeul',
        description: `Document importé (${file.name}) prêt pour résumé, podcast et vidéo.`,
        rawContent: extractedText,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      onImportResource(newRes, true);
      setStatusMessage(`"${file.name}" analysé et envoyé vers le Studio Média.`);
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : "Échec de l'importation du fichier."
      );
    } finally {
      setUploadLoading(false);
      e.target.value = '';
    }
  };

  const handleImportAttachedGuidePdf = async () => {
    setUploadLoading(true);
    setAuthError(null);
    try {
      const response = await fetch(GUIDE_PDF_URL);
      if (!response.ok) throw new Error('PDF du guide introuvable.');
      const buffer = await response.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i += 0x8000) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      }
      const base64Data = btoa(binary);
      const extractRes = await fetch('/api/ai/extract-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Data,
          mimeType: 'application/pdf',
          fileName: 'Guide_d_accompagnement_Portfolio_Numerique.pdf',
        }),
      });
      const data = await extractRes.json();
      if (!extractRes.ok) throw new Error(data.error || 'Erreur lecture PDF');

      onImportResource(
        {
          id: 'guide-pdf-iset',
          title: 'Guide d’accompagnement — Projet Portfolio Numérique',
          moduleTarget: 'digital-skills',
          sourceType: 'upload',
          courseName: 'Référentiel Officiel · 1ère Année',
          description:
            'Cahier des charges complet : GitHub Pages, Digital Skills, Python, C, Algorithmique, Systèmes et Grille /20.',
          rawContent: data.extractedText || '',
          createdAt: new Date().toISOString().slice(0, 10),
        },
        true
      );
      setStatusMessage('Le Guide PDF officiel a été extrait et chargé dans le Studio Média.');
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Impossible de charger le guide PDF.'
      );
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-medium tracking-wide text-blue-700 dark:text-blue-400">
            Synchronisation Google Classroom · Google Drive · PDF ISET Nabeul
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
            Importer vos cours et travaux pratiques
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Connectez votre compte Google Classroom pour récupérer automatiquement vos classes,
            supports de cours, TP et pièces jointes Drive, ou importez un PDF local pour en
            générer un résumé, un podcast audio et une vidéo de révision.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Classer dans :
            <select
              value={targetModule}
              onChange={(e) => setTargetModule(e.target.value as TargetModuleCategory)}
              className="ml-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="tp-iset-nabeul">TP ISET Nabeul</option>
              <option value="digital-skills">Digital Skills</option>
              <option value="fondamental-it">Fondamental IT (Python / C / Algo)</option>
              <option value="systemes-electriques">Systèmes & Électrique</option>
            </select>
          </label>
        </div>
      </div>

      {authError && (
        <div
          role="alert"
          className="rounded-xl border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-800 dark:text-red-200"
        >
          {authError}
        </div>
      )}

      {statusMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-300 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Google Auth & Courses */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Connexion Google Classroom
              </h3>
              {!needsAuth && (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Déconnexion
                </button>
              )}
            </div>

            {needsAuth ? (
              <div className="space-y-4">
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Autorisez la lecture seule de vos classes Google Classroom et de leurs
                  pièces jointes Google Drive. Le jeton reste uniquement en mémoire vive.
                </p>
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="gsi-material-button w-full"
                >
                  <div className="gsi-material-button-state" />
                  <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        style={{ display: 'block' }}
                      >
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        />
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        />
                      </svg>
                    </div>
                    <span className="gsi-material-button-contents">
                      {isLoggingIn ? 'Connexion en cours...' : 'Sign in with Google'}
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {user?.displayName || 'Compte Google connecté'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => accessToken && loadCourses(accessToken)}
                    disabled={loadingCourses}
                    title="Actualiser les cours"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${loadingCourses ? 'animate-spin' : ''}`}
                    />
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Vos classes actives ({courses.length})
                  </p>
                  {loadingCourses ? (
                    <div className="flex items-center gap-2 py-4 text-sm text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Chargement des cours...
                    </div>
                  ) : courses.length === 0 ? (
                    <p className="text-xs text-slate-500 py-2">
                      Aucun cours actif trouvé sur ce compte Google Classroom.
                    </p>
                  ) : (
                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                      {courses.map((course) => {
                        const active = selectedCourse?.id === course.id;
                        return (
                          <button
                            key={course.id}
                            type="button"
                            onClick={() => handleSelectCourse(course)}
                            className={`w-full text-left rounded-lg px-3 py-2.5 border transition-colors cursor-pointer ${
                              active
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100'
                                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <div className="text-sm font-medium truncate">{course.name}</div>
                            {course.section && (
                              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {course.section}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Local PDF / Document Importer */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Importer un document local ou PDF
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Ajoutez un support PDF, fichier texte, code C/Python ou Markdown depuis votre
              ordinateur pour générer immédiatement un résumé, un podcast et une vidéo.
            </p>
            <div className="flex flex-col gap-2.5">
              <label className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 cursor-pointer transition-colors">
                {uploadLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span>{uploadLoading ? 'Analyse en cours...' : 'Choisir un PDF / Cours'}</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md,.c,.py,.html,.csv"
                  onChange={handleLocalFileUpload}
                  disabled={uploadLoading}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={handleImportAttachedGuidePdf}
                disabled={uploadLoading}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 px-4 py-2.5 text-xs font-medium text-blue-800 dark:text-blue-200 cursor-pointer transition-colors"
              >
                <FileText className="h-4 w-4 shrink-0" />
                <span>Analyser le Guide Portfolio PDF joint</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: CourseWork / Materials / Announcements */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
          {!selectedCourse ? (
            <div className="py-16 text-center space-y-3">
              <BookOpen className="h-10 w-10 mx-auto text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Sélectionnez un cours Google Classroom
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Connectez-vous à gauche avec Google pour parcourir vos TP, supports de cours
                et annonces, puis importez-les dans votre portfolio ISET Nabeul.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedCourse.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {[selectedCourse.section, selectedCourse.room]
                      .filter(Boolean)
                      .join(' · ') || 'Google Classroom'}
                  </p>
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start">
                  <button
                    type="button"
                    onClick={() => setActiveTab('tp')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === 'tp'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    TP & Devoirs ({courseWork.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('cours')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === 'cours'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    Supports de cours ({materials.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('annonces')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === 'annonces'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    Annonces ({announcements.length})
                  </button>
                </div>
              </div>

              {loadingDetails ? (
                <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Récupération des travaux et supports de cours...
                </div>
              ) : (
                <div className="space-y-3">
                  {activeTab === 'tp' &&
                    (courseWork.length === 0 ? (
                      <p className="text-sm text-slate-500 py-8 text-center">
                        Aucun devoir ou TP trouvé dans cette classe.
                      </p>
                    ) : (
                      courseWork.map((cw) => {
                        const already = importedIds.has(`gc-${cw.id}`);
                        const isBusy = importingId === cw.id;
                        return (
                          <div
                            key={cw.id}
                            className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="space-y-1">
                                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                  {cw.title}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {cw.workType || 'TP / Devoir'}
                                  {cw.dueDate
                                    ? ` · Échéance ${cw.dueDate.day}/${cw.dueDate.month}/${cw.dueDate.year}`
                                    : ''}
                                  {cw.materials?.length
                                    ? ` · ${cw.materials.length} pièce(s) jointe(s)`
                                    : ''}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() =>
                                    handleImportItem(
                                      cw.id,
                                      cw.title,
                                      cw.description || '',
                                      'classroom-tp',
                                      cw.materials,
                                      cw.alternateLink,
                                      false
                                    )
                                  }
                                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap cursor-pointer disabled:opacity-50"
                                >
                                  {isBusy
                                    ? 'Import...'
                                    : already
                                    ? 'Réimporter'
                                    : 'Importer TP'}
                                </button>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() =>
                                    handleImportItem(
                                      cw.id,
                                      cw.title,
                                      cw.description || '',
                                      'classroom-tp',
                                      cw.materials,
                                      cw.alternateLink,
                                      true
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white whitespace-nowrap cursor-pointer disabled:opacity-50"
                                >
                                  <Sparkles className="h-3.5 w-3.5" />
                                  Résumé / Podcast
                                </button>
                              </div>
                            </div>

                            {cw.description && (
                              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                                {cw.description}
                              </p>
                            )}

                            {cw.materials && cw.materials.length > 0 && (
                              <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                                {cw.materials.map((m, idx) => (
                                  <span key={idx} className="inline-flex items-center gap-1">
                                    <Paperclip className="h-3 w-3" />
                                    {m.driveFile?.driveFile?.title ||
                                      m.link?.title ||
                                      m.youtubeVideo?.title ||
                                      'Ressource'}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ))}

                  {activeTab === 'cours' &&
                    (materials.length === 0 ? (
                      <p className="text-sm text-slate-500 py-8 text-center">
                        Aucun support de cours publié dans cette classe.
                      </p>
                    ) : (
                      materials.map((mat) => {
                        const already = importedIds.has(`gc-${mat.id}`);
                        const isBusy = importingId === mat.id;
                        return (
                          <div
                            key={mat.id}
                            className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="space-y-1">
                                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                  {mat.title}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Support de cours
                                  {mat.materials?.length
                                    ? ` · ${mat.materials.length} document(s)`
                                    : ''}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() =>
                                    handleImportItem(
                                      mat.id,
                                      mat.title,
                                      mat.description || '',
                                      'classroom-cours',
                                      mat.materials,
                                      mat.alternateLink,
                                      false
                                    )
                                  }
                                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap cursor-pointer"
                                >
                                  {isBusy ? 'Import...' : already ? 'Réimporter' : 'Importer Cours'}
                                </button>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() =>
                                    handleImportItem(
                                      mat.id,
                                      mat.title,
                                      mat.description || '',
                                      'classroom-cours',
                                      mat.materials,
                                      mat.alternateLink,
                                      true
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white whitespace-nowrap cursor-pointer"
                                >
                                  <Sparkles className="h-3.5 w-3.5" />
                                  Résumé / Podcast
                                </button>
                              </div>
                            </div>
                            {mat.description && (
                              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                                {mat.description}
                              </p>
                            )}
                          </div>
                        );
                      })
                    ))}

                  {activeTab === 'annonces' &&
                    (announcements.length === 0 ? (
                      <p className="text-sm text-slate-500 py-8 text-center">
                        Aucune annonce dans cette classe.
                      </p>
                    ) : (
                      announcements.map((ann) => (
                        <div
                          key={ann.id}
                          className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2"
                        >
                          <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line">
                            {ann.text || '(Annonce sans texte)'}
                          </p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-slate-500">
                              {ann.creationTime ? ann.creationTime.slice(0, 10) : ''}
                            </span>
                            <div className="flex items-center gap-3">
                              {ann.alternateLink && (
                                <a
                                  href={ann.alternateLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  Classroom <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  handleImportItem(
                                    ann.id,
                                    `Annonce — ${(ann.text || 'Cours').slice(0, 48)}`,
                                    ann.text || '',
                                    'classroom-annonce',
                                    ann.materials,
                                    ann.alternateLink,
                                    true
                                  )
                                }
                                className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-300 hover:underline cursor-pointer"
                              >
                                <FolderGit2 className="h-3.5 w-3.5" />
                                Importer
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
