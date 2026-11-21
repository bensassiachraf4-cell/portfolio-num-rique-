import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY manquante dans les secrets du serveur.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const ALLOWED_PDF_MIMES = new Set([
  'application/pdf',
  'text/plain',
  'text/markdown',
  'text/csv',
]);

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '25mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, service: 'portfolio-iset-nabeul' });
  });

  app.post('/api/ai/extract-pdf', async (req: Request, res: Response) => {
    try {
      const { base64Data, mimeType, fileName } = req.body as {
        base64Data?: string;
        mimeType?: string;
        fileName?: string;
      };

      if (!base64Data || typeof base64Data !== 'string') {
        res.status(400).json({ error: 'Contenu du fichier manquant.' });
        return;
      }
      if (base64Data.length > 20 * 1024 * 1024) {
        res.status(413).json({ error: 'Fichier trop volumineux (max ~15 Mo).' });
        return;
      }

      const safeMime = mimeType && ALLOWED_PDF_MIMES.has(mimeType) ? mimeType : 'application/pdf';
      const safeName = (fileName || 'document.pdf').slice(0, 120);

      if (safeMime.startsWith('text/')) {
        const decoded = Buffer.from(base64Data, 'base64').toString('utf-8');
        res.json({ extractedText: decoded });
        return;
      }

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: safeMime,
                data: base64Data,
              },
            },
            {
              text: `Extrait de manière claire et structurée tout le contenu pédagogique de ce document ("${safeName}") en français : titres, définitions, formules, extraits de code, consignes de TP et points essentiels. N'invente rien qui ne figure pas dans le document.`,
            },
          ],
        },
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      res.json({ extractedText: response.text ?? '' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la lecture du PDF.';
      console.error('extract-pdf error:', message);
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/ai/generate-course-pack', async (req: Request, res: Response) => {
    try {
      const { title, moduleName, sourceText } = req.body as {
        title?: string;
        moduleName?: string;
        sourceText?: string;
      };

      if (!title || !sourceText || typeof title !== 'string' || typeof sourceText !== 'string') {
        res.status(400).json({ error: 'Le titre et le texte source du cours/TP sont requis.' });
        return;
      }

      const trimmedSource = sourceText.slice(0, 35000);
      const safeModule = (moduleName || 'Fondamental IT & Digital Skills').slice(0, 120);
      const safeTitle = title.slice(0, 200);

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Tu es un enseignant-assistant pédagogique pour des étudiants de 1ère année à l'ISET Nabeul (Tunisie).
Analyse ce support de cours ou TP intitulé "${safeTitle}" (Module : ${safeModule}) et produis en français un pack pédagogique complet, exact et vérifiable :

1. "summary" :
   - "overview" : une synthèse claire de 3 à 4 phrases.
   - "keyConcepts" : 5 à 7 notions clés expliquées simplement.
   - "formulasOrCommands" : 3 à 5 formules, lois électriques, commandes terminal ou extraits de code essentiels.
   - "examTips" : 3 conseils pratiques pour réussir le TP ou l'examen ISET.
2. "mindmap" :
   - "center" : le sujet central court.
   - "branches" : 4 branches thématiques contenant chacune un "label" et 3 à 4 "items" courts.
3. "podcastScript" :
   - Un dialogue dynamique et naturel de 6 répliques entre deux intervenants : "Amira" (animatrice pédagogue) et "Yassine" (étudiant curieux à l'ISET Nabeul).
   - Chaque réplique contient "speaker" ("Amira" ou "Yassine"), "style" (indication vocale courte en anglais ou français, ex: "Warm, clear educational host"), et "text" (format "Amira: ..." ou "Yassine: ..." sans balises HTML).
4. "videoSlides" :
   - 5 diapositives structurées pour une vidéo de révision de 60 à 90 secondes :
   - Chaque diapositive a "slideNumber" (1..5), "title" (court), "bullets" (3 points synthétiques), "codeOrFormula" (une formule, loi, schéma texte ou ligne de code pertinente, ou chaîne vide), et "narration" (2 à 3 phrases fluides à lire à voix haute).

Contenu du cours / TP :
${trimmedSource}`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.OBJECT,
                properties: {
                  overview: { type: Type.STRING },
                  keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                  formulasOrCommands: { type: Type.ARRAY, items: { type: Type.STRING } },
                  examTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['overview', 'keyConcepts', 'formulasOrCommands', 'examTips'],
              },
              mindmap: {
                type: Type.OBJECT,
                properties: {
                  center: { type: Type.STRING },
                  branches: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        items: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['label', 'items'],
                    },
                  },
                },
                required: ['center', 'branches'],
              },
              podcastScript: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    speaker: { type: Type.STRING },
                    style: { type: Type.STRING },
                    text: { type: Type.STRING },
                  },
                  required: ['speaker', 'style', 'text'],
                },
              },
              videoSlides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    slideNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                    codeOrFormula: { type: Type.STRING },
                    narration: { type: Type.STRING },
                  },
                  required: ['slideNumber', 'title', 'bullets', 'codeOrFormula', 'narration'],
                },
              },
            },
            required: ['summary', 'mindmap', 'podcastScript', 'videoSlides'],
          },
        },
      });

      const raw = (response.text ?? '{}').trim();
      const parsed = JSON.parse(raw);
      res.json({ pack: parsed });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la génération du pack de cours.';
      console.error('generate-course-pack error:', message);
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/ai/generate-podcast', async (req: Request, res: Response) => {
    try {
      const { dialogue } = req.body as {
        dialogue?: Array<{ speaker: string; style?: string; text: string }>;
      };

      if (!Array.isArray(dialogue) || dialogue.length === 0) {
        res.status(400).json({ error: 'Le script du podcast est requis.' });
        return;
      }

      const safeDialogue = dialogue.slice(0, 12).map((line) => {
        const speaker = line.speaker === 'Yassine' ? 'Yassine' : 'Amira';
        const cleanText = String(line.text || '').replace(/^(Amira|Yassine)\s*:\s*/i, '').trim();
        return {
          text: `${speaker}: ${cleanText}`,
          speechMetadata: {
            speaker,
            style:
              line.style ||
              (speaker === 'Amira'
                ? 'Warm, articulate French educational podcast host'
                : 'Enthusiastic, curious French engineering student co-host'),
          },
        };
      });

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: safeDialogue,
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            multiSpeakerVoiceConfig: {
              speakerVoiceConfigs: [
                {
                  speaker: 'Amira',
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                  },
                },
                {
                  speaker: 'Yassine',
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Puck' },
                  },
                },
              ],
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!base64Audio) {
        res.status(502).json({ error: 'Aucune donnée audio retournée par le modèle TTS.' });
        return;
      }

      res.json({ audioBase64: base64Audio, mimeType: 'audio/wav' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la synthèse audio du podcast.';
      console.error('generate-podcast error:', message);
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/ai/generate-slide-voice', async (req: Request, res: Response) => {
    try {
      const { text, voiceName } = req.body as { text?: string; voiceName?: string };
      if (!text || typeof text !== 'string') {
        res.status(400).json({ error: 'Le texte de narration est requis.' });
        return;
      }

      const allowedVoices = new Set(['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr']);
      const safeVoice = voiceName && allowedVoices.has(voiceName) ? voiceName : 'Kore';

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text.slice(0, 4000),
                speechMetadata: {
                  style: 'Clear, engaging French university instructor presenting course slides',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: safeVoice },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!base64Audio) {
        res.status(502).json({ error: 'Aucune narration audio générée.' });
        return;
      }

      res.json({ audioBase64: base64Audio, mimeType: 'audio/wav' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la narration vocale.';
      console.error('generate-slide-voice error:', message);
      res.status(500).json({ error: message });
    }
  });

  if (isProduction) {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api/')) {
        next();
        return;
      }
      try {
        const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const html = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
