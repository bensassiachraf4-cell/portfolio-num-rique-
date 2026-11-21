import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Film,
  Headphones,
  Loader2,
  Mic,
  Network,
  Pause,
  Play,
  Plus,
  Sparkles,
  Video,
} from 'lucide-react';
import type { CourseResource, GeneratedCoursePack } from '../types/portfolio';

interface MediaStudioProps {
  resources: CourseResource[];
  selectedResourceId: string | null;
  onSelectResource: (id: string) => void;
  onUpdateResource: (id: string, patch: Partial<CourseResource>) => void;
  onCreateCustomResource: (title: string, courseName: string, rawContent: string) => void;
}

function base64ToBlobUrl(base64: string, mimeType: string): string {
  const clean = base64.includes(',') ? base64.split(',')[1] : base64;
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mimeType });
  return URL.createObjectURL(blob);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const clean = base64.includes(',') ? base64.split(',')[1] : base64;
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export const MediaStudio: React.FC<MediaStudioProps> = ({
  resources,
  selectedResourceId,
  onSelectResource,
  onUpdateResource,
  onCreateCustomResource,
}) => {
  const activeResource =
    resources.find((r) => r.id === selectedResourceId) || resources[0] || null;

  const [studioTab, setStudioTab] = useState<'resume' | 'mindmap' | 'podcast' | 'video'>(
    'resume'
  );
  const [generatingPack, setGeneratingPack] = useState(false);
  const [generatingPodcast, setGeneratingPodcast] = useState(false);
  const [generatingVoices, setGeneratingVoices] = useState(false);
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Custom note composer modal/toggle
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('Fondamental IT · ISET Nabeul');
  const [newContent, setNewContent] = useState('');

  // Podcast audio URL
  const [podcastUrl, setPodcastUrl] = useState<string | null>(null);

  // Video slide preview & playback
  const [slideIdx, setSlideIdx] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const slideAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (activeResource?.podcastAudioBase64) {
      const url = base64ToBlobUrl(activeResource.podcastAudioBase64, 'audio/wav');
      setPodcastUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPodcastUrl(null);
    }
  }, [activeResource?.id, activeResource?.podcastAudioBase64]);

  useEffect(() => {
    setSlideIdx(0);
    setIsPlayingVideo(false);
  }, [activeResource?.id]);

  // Draw current slide onto Canvas
  const drawSlideOnCanvas = (
    canvas: HTMLCanvasElement,
    pack: GeneratedCoursePack,
    idx: number,
    courseTitle: string
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const slides = pack.videoSlides;
    const slide = slides[idx];
    if (!slide) return;

    const w = canvas.width;
    const h = canvas.height;

    // Background
    ctx.fillStyle = '#0B1120';
    ctx.fillRect(0, 0, w, h);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Top bar
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(48, 40, w - 96, 56);
    ctx.fillStyle = '#60A5FA';
    ctx.font = '600 18px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(
      `ISET Nabeul · Résumé Vidéo · Diapositive ${idx + 1}/${slides.length}`,
      72,
      74
    );
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '500 16px "Plus Jakarta Sans", system-ui, sans-serif';
    const shortCourse =
      courseTitle.length > 42 ? courseTitle.slice(0, 42) + '...' : courseTitle;
    const textWidth = ctx.measureText(shortCourse).width;
    ctx.fillText(shortCourse, w - 72 - textWidth, 74);

    // Slide Title
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '700 40px "Bricolage Grotesque", system-ui, sans-serif';
    const titleLines = wrapTextLines(ctx, slide.title, w - 120);
    let yCursor = 165;
    for (const line of titleLines.slice(0, 2)) {
      ctx.fillText(line, 60, yCursor);
      yCursor += 48;
    }

    // Bullets panel
    const hasCode = Boolean(slide.codeOrFormula && slide.codeOrFormula.trim().length > 0);
    const leftWidth = hasCode ? w * 0.54 : w - 120;

    let bulletY = yCursor + 24;
    ctx.font = '400 24px "Plus Jakarta Sans", system-ui, sans-serif';
    for (const b of slide.bullets.slice(0, 4)) {
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(60, bulletY - 14, 10, 10);
      ctx.fillStyle = '#E2E8F0';
      const bLines = wrapTextLines(ctx, b, leftWidth - 40);
      for (const bl of bLines) {
        ctx.fillText(bl, 86, bulletY);
        bulletY += 34;
      }
      bulletY += 14;
    }

    // Code / Formula Box
    if (hasCode) {
      const boxX = w * 0.6;
      const boxY = yCursor + 4;
      const boxW = w - boxX - 60;
      const boxH = 290;
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.fillStyle = '#93C5FD';
      ctx.font = '600 15px "JetBrains Mono", monospace';
      ctx.fillText('Formule / Code Clé', boxX + 24, boxY + 34);

      ctx.fillStyle = '#F1F5F9';
      ctx.font = '500 20px "JetBrains Mono", monospace';
      const codeLines = wrapTextLines(ctx, slide.codeOrFormula, boxW - 48);
      let codeY = boxY + 76;
      for (const cl of codeLines.slice(0, 7)) {
        ctx.fillText(cl, boxX + 24, codeY);
        codeY += 28;
      }
    }

    // Subtitle narration bar at bottom
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(48, h - 132, w - 96, 88);
    ctx.strokeStyle = '#1E293B';
    ctx.strokeRect(48, h - 132, w - 96, 88);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = '500 20px "Plus Jakarta Sans", system-ui, sans-serif';
    const subLines = wrapTextLines(ctx, slide.narration, w - 144);
    let subY = h - 94;
    for (const sl of subLines.slice(0, 2)) {
      ctx.fillText(sl, 72, subY);
      subY += 28;
    }

    // Progress bar
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(48, h - 26, w - 96, 6);
    ctx.fillStyle = '#2563EB';
    ctx.fillRect(48, h - 26, ((w - 96) * (idx + 1)) / slides.length, 6);
  };

  useEffect(() => {
    if (
      studioTab === 'video' &&
      canvasRef.current &&
      activeResource?.generatedPack
    ) {
      drawSlideOnCanvas(
        canvasRef.current,
        activeResource.generatedPack,
        slideIdx,
        activeResource.title
      );
    }
  }, [studioTab, slideIdx, activeResource]);

  const handleGeneratePack = async () => {
    if (!activeResource) return;
    setGeneratingPack(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ai/generate-course-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeResource.title,
          moduleName: activeResource.courseName,
          sourceText: activeResource.rawContent || activeResource.description,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Échec de génération du résumé.');
      onUpdateResource(activeResource.id, { generatedPack: data.pack });
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Erreur lors de la génération.'
      );
    } finally {
      setGeneratingPack(false);
    }
  };

  const handleGeneratePodcastAudio = async () => {
    if (!activeResource?.generatedPack) return;
    setGeneratingPodcast(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ai/generate-podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dialogue: activeResource.generatedPack.podcastScript,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Échec de génération audio.');
      onUpdateResource(activeResource.id, { podcastAudioBase64: data.audioBase64 });
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Erreur lors de la synthèse audio.'
      );
    } finally {
      setGeneratingPodcast(false);
    }
  };

  const handleGenerateAllSlideVoices = async (): Promise<string[] | null> => {
    if (!activeResource?.generatedPack) return null;
    setGeneratingVoices(true);
    setErrorMsg(null);
    try {
      const voices: string[] = [];
      for (const slide of activeResource.generatedPack.videoSlides) {
        const res = await fetch('/api/ai/generate-slide-voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: slide.narration, voiceName: 'Kore' }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erreur de narration vocale.');
        voices.push(data.audioBase64);
      }
      onUpdateResource(activeResource.id, { slideVoicesBase64: voices });
      return voices;
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Erreur de génération de la voix off.'
      );
      return null;
    } finally {
      setGeneratingVoices(false);
    }
  };

  const playSlideSequence = async (startIdx: number) => {
    if (!activeResource?.generatedPack) return;
    const slides = activeResource.generatedPack.videoSlides;
    let voices = activeResource.slideVoicesBase64;
    if (!voices || voices.length !== slides.length) {
      voices = (await handleGenerateAllSlideVoices()) ?? undefined;
      if (!voices) return;
    }

    setIsPlayingVideo(true);
    for (let i = startIdx; i < slides.length; i++) {
      setSlideIdx(i);
      const url = base64ToBlobUrl(voices[i], 'audio/wav');
      await new Promise<void>((resolve) => {
        const audio = new Audio(url);
        slideAudioRef.current = audio;
        audio.onended = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        audio.play().catch(() => resolve());
      });
    }
    setIsPlayingVideo(false);
  };

  const stopSlidePlayback = () => {
    if (slideAudioRef.current) {
      slideAudioRef.current.pause();
      slideAudioRef.current = null;
    }
    setIsPlayingVideo(false);
  };

  const handleExportWebmVideo = async () => {
    if (!activeResource?.generatedPack || !canvasRef.current) return;
    setRecordingVideo(true);
    setErrorMsg(null);
    try {
      const slides = activeResource.generatedPack.videoSlides;
      let voices = activeResource.slideVoicesBase64;
      if (!voices || voices.length !== slides.length) {
        voices = (await handleGenerateAllSlideVoices()) ?? undefined;
        if (!voices) {
          setRecordingVideo(false);
          return;
        }
      }

      const canvas = canvasRef.current;
      const canvasStream = canvas.captureStream(30);
      const audioCtx = new AudioContext();
      const dest = audioCtx.createMediaStreamDestination();
      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...dest.stream.getAudioTracks(),
      ]);

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : 'video/webm';
      const recorder = new MediaRecorder(combinedStream, { mimeType });
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunks.push(ev.data);
      };

      const recordingDone = new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          resolve(new Blob(chunks, { type: 'video/webm' }));
        };
      });

      recorder.start();

      for (let i = 0; i < slides.length; i++) {
        setSlideIdx(i);
        drawSlideOnCanvas(
          canvas,
          activeResource.generatedPack,
          i,
          activeResource.title
        );
        const ab = base64ToArrayBuffer(voices[i]);
        const decoded = await audioCtx.decodeAudioData(ab);
        await new Promise<void>((resolve) => {
          const src = audioCtx.createBufferSource();
          src.buffer = decoded;
          src.connect(dest);
          src.connect(audioCtx.destination);
          src.onended = () => resolve();
          src.start();
        });
      }

      recorder.stop();
      const videoBlob = await recordingDone;
      await audioCtx.close();

      // Convert blob to base64 for ZIP export
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = String(reader.result || '');
        const b64 = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;
        onUpdateResource(activeResource.id, { videoWebmBase64: b64 });
      };
      reader.readAsDataURL(videoBlob);

      // Immediate download
      const dlUrl = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = `${activeResource.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}-resume-video.webm`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(dlUrl), 3000);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer la vidéo WebM."
      );
    } finally {
      setRecordingVideo(false);
    }
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    onCreateCustomResource(newTitle.trim(), newCourse.trim(), newContent.trim());
    setNewTitle('');
    setNewContent('');
    setShowNewForm(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-medium tracking-wide text-blue-700 dark:text-blue-400">
            Studio Multimédia IA · Résumés · Cartes Mentales · Podcasts WAV · Vidéos WebM
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
            Transformer vos cours en résumés, podcasts et vidéos
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Sélectionnez un TP ISET Nabeul ou un cours importé de Google Classroom pour générer
            son résumé structuré, sa carte mentale, un épisode podcast à deux voix et une vidéo
            de révision exportable dans votre ZIP GitHub Pages.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewForm(!showNewForm)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Coller un nouveau cours
        </button>
      </div>

      {showNewForm && (
        <form
          onSubmit={handleCreateCustom}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Ajouter un cours ou TP par texte
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Titre (ex: Chapitre 2 — Systèmes Électriques)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
            />
            <input
              type="text"
              placeholder="Module / Matière"
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
          <textarea
            required
            rows={5}
            placeholder="Collez ici le contenu de votre cours, vos notes ou l'énoncé du TP..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white cursor-pointer"
            >
              Enregistrer et ouvrir
            </button>
          </div>
        </form>
      )}

      {errorMsg && (
        <div
          role="alert"
          className="rounded-xl border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-800 dark:text-red-200"
        >
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Resource Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Cours & TP disponibles ({resources.length})
          </p>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {resources.map((res) => {
              const selected = activeResource?.id === res.id;
              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => onSelectResource(res.id)}
                  className={`w-full text-left rounded-xl border p-4 transition-colors cursor-pointer space-y-1.5 ${
                    selected
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {res.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {res.courseName}
                    {res.generatedPack ? ' · Résumé prêt' : ''}
                    {res.podcastAudioBase64 ? ' · Audio WAV' : ''}
                    {res.videoWebmBase64 ? ' · Vidéo WebM' : ''}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Studio Workspace */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6">
          {!activeResource ? (
            <p className="text-sm text-slate-500 py-12 text-center">
              Aucun cours sélectionné.
            </p>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {activeResource.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activeResource.courseName} · {activeResource.createdAt}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGeneratePack}
                  disabled={generatingPack}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-medium text-white shrink-0 cursor-pointer disabled:opacity-60"
                >
                  {generatingPack ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span>
                    {generatingPack
                      ? 'Analyse en cours...'
                      : activeResource.generatedPack
                      ? 'Régénérer le pack IA'
                      : 'Générer Résumé, Podcast & Vidéo'}
                  </span>
                </button>
              </div>

              {/* Studio Sub-tabs */}
              <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => setStudioTab('resume')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    studioTab === 'resume'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Résumé
                </button>
                <button
                  type="button"
                  onClick={() => setStudioTab('mindmap')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    studioTab === 'mindmap'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Network className="h-3.5 w-3.5" />
                  Carte mentale
                </button>
                <button
                  type="button"
                  onClick={() => setStudioTab('podcast')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    studioTab === 'podcast'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Headphones className="h-3.5 w-3.5" />
                  Podcast Audio
                </button>
                <button
                  type="button"
                  onClick={() => setStudioTab('video')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    studioTab === 'video'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Video className="h-3.5 w-3.5" />
                  Vidéo de cours
                </button>
              </div>

              {!activeResource.generatedPack ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-4 space-y-2">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Contenu source prêt à être synthétisé :
                    </p>
                    <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto">
                      {activeResource.rawContent || activeResource.description}
                    </pre>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Cliquez sur <strong>« Générer Résumé, Podcast & Vidéo »</strong> ci-dessus
                    pour produire instantanément la fiche de révision, la carte mentale, le
                    dialogue podcast et les diapositives narrées.
                  </p>
                </div>
              ) : (
                <>
                  {/* TAB: RESUME */}
                  {studioTab === 'resume' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          Synthèse générale
                        </h4>
                        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                          {activeResource.generatedPack.summary.overview}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            Notions clés à retenir
                          </h4>
                          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5">
                            {activeResource.generatedPack.summary.keyConcepts.map(
                              (item, i) => (
                                <li key={i}>{item}</li>
                              )
                            )}
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              Formules, lois & commandes
                            </h4>
                            <div className="space-y-1.5">
                              {activeResource.generatedPack.summary.formulasOrCommands.map(
                                (cmd, i) => (
                                  <div
                                    key={i}
                                    className="rounded-lg bg-slate-900 text-slate-100 px-3 py-2 text-xs font-mono"
                                  >
                                    {cmd}
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              Conseils pour le TP / Examen ISET
                            </h4>
                            <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5">
                              {activeResource.generatedPack.summary.examTips.map(
                                (tip, i) => (
                                  <li key={i}>{tip}</li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: MINDMAP */}
                  {studioTab === 'mindmap' && (
                    <div className="space-y-6">
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6">
                        <div className="flex flex-col items-center space-y-6">
                          <div className="rounded-xl bg-blue-600 text-white px-6 py-3 text-base font-bold text-center shadow-sm">
                            {activeResource.generatedPack.mindmap.center}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {activeResource.generatedPack.mindmap.branches.map(
                              (branch, idx) => (
                                <div
                                  key={idx}
                                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2.5"
                                >
                                  <h5 className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                                    0{idx + 1}. {branch.label}
                                  </h5>
                                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc pl-4">
                                    {branch.items.map((sub, j) => (
                                      <li key={j}>{sub}</li>
                                    ))}
                                  </ul>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: PODCAST */}
                  {studioTab === 'podcast' && (
                    <div className="space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            Épisode Podcast · Amira & Yassine (Voix IA HD)
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Synthèse audio stéréo/WAV à deux interlocuteurs prête à intégrer dans
                            le dossier medias/ de votre GitHub Pages.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleGeneratePodcastAudio}
                          disabled={generatingPodcast}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-medium text-white shrink-0 cursor-pointer disabled:opacity-60"
                        >
                          {generatingPodcast ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Mic className="h-4 w-4" />
                          )}
                          <span>
                            {generatingPodcast
                              ? 'Synthèse WAV...'
                              : podcastUrl
                              ? 'Régénérer Audio WAV'
                              : 'Générer Audio Podcast'}
                          </span>
                        </button>
                      </div>

                      {podcastUrl && (
                        <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                          <audio controls src={podcastUrl} className="w-full" />
                          <a
                            href={podcastUrl}
                            download={`${activeResource.title
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-')}-podcast.wav`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap shrink-0"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Télécharger .WAV
                          </a>
                        </div>
                      )}

                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Script du dialogue (modifiable mentalement pour relecture)
                        </h4>
                        <div className="space-y-2.5">
                          {activeResource.generatedPack.podcastScript.map((turn, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 space-y-1"
                            >
                              <div className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                                {turn.speaker}
                              </div>
                              <p className="text-sm text-slate-800 dark:text-slate-200">
                                {turn.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: VIDEO */}
                  {studioTab === 'video' && (
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              isPlayingVideo
                                ? stopSlidePlayback()
                                : playSlideSequence(slideIdx)
                            }
                            disabled={generatingVoices || recordingVideo}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3.5 py-2 text-xs font-medium text-white cursor-pointer disabled:opacity-60"
                          >
                            {generatingVoices ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : isPlayingVideo ? (
                              <Pause className="h-3.5 w-3.5" />
                            ) : (
                              <Play className="h-3.5 w-3.5" />
                            )}
                            <span>
                              {generatingVoices
                                ? 'Génération voix...'
                                : isPlayingVideo
                                ? 'Arrêter'
                                : 'Lire avec voix off'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={handleExportWebmVideo}
                            disabled={recordingVideo || generatingVoices}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 cursor-pointer disabled:opacity-60"
                          >
                            {recordingVideo ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Film className="h-3.5 w-3.5" />
                            )}
                            <span>
                              {recordingVideo
                                ? 'Enregistrement vidéo...'
                                : 'Exporter Vidéo (.webm)'}
                            </span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSlideIdx((s) => Math.max(0, s - 1))}
                            disabled={slideIdx === 0}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                            aria-label="Diapositive précédente"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <span className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-400">
                            {slideIdx + 1} /{' '}
                            {activeResource.generatedPack.videoSlides.length}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setSlideIdx((s) =>
                                Math.min(
                                  activeResource.generatedPack!.videoSlides.length - 1,
                                  s + 1
                                )
                              )
                            }
                            disabled={
                              slideIdx >=
                              activeResource.generatedPack.videoSlides.length - 1
                            }
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                            aria-label="Diapositive suivante"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0B1120]">
                        <canvas
                          ref={canvasRef}
                          width={1280}
                          height={720}
                          className="w-full h-auto block"
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {activeResource.generatedPack.videoSlides.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSlideIdx(idx)}
                            className={`text-left rounded-lg border p-2.5 text-xs transition-colors cursor-pointer ${
                              slideIdx === idx
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100'
                                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            <div className="font-mono font-semibold">
                              Slide {idx + 1}
                            </div>
                            <div className="truncate">{s.title}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
