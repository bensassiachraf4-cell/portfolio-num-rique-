import type {
  ClassroomAnnouncement,
  ClassroomCourse,
  ClassroomCourseWork,
  ClassroomCourseWorkMaterial,
  ClassroomTopic,
} from '../types/portfolio';

async function classroomFetch<T>(url: string, accessToken: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      errorBody?.error?.message || `Erreur API Google (${response.status})`;
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export async function fetchClassroomCourses(
  accessToken: string
): Promise<ClassroomCourse[]> {
  const data = await classroomFetch<{ courses?: ClassroomCourse[] }>(
    'https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE&pageSize=30',
    accessToken
  );
  return data.courses ?? [];
}

export async function fetchCourseDetails(
  accessToken: string,
  courseId: string
): Promise<{
  courseWork: ClassroomCourseWork[];
  materials: ClassroomCourseWorkMaterial[];
  announcements: ClassroomAnnouncement[];
  topics: ClassroomTopic[];
}> {
  const encodedId = encodeURIComponent(courseId);

  const [cwRes, matRes, annRes, topRes] = await Promise.allSettled([
    classroomFetch<{ courseWork?: ClassroomCourseWork[] }>(
      `https://classroom.googleapis.com/v1/courses/${encodedId}/courseWork?pageSize=30`,
      accessToken
    ),
    classroomFetch<{ courseWorkMaterial?: ClassroomCourseWorkMaterial[] }>(
      `https://classroom.googleapis.com/v1/courses/${encodedId}/courseWorkMaterials?pageSize=30`,
      accessToken
    ),
    classroomFetch<{ announcements?: ClassroomAnnouncement[] }>(
      `https://classroom.googleapis.com/v1/courses/${encodedId}/announcements?pageSize=20`,
      accessToken
    ),
    classroomFetch<{ topic?: ClassroomTopic[] }>(
      `https://classroom.googleapis.com/v1/courses/${encodedId}/topics?pageSize=30`,
      accessToken
    ),
  ]);

  return {
    courseWork: cwRes.status === 'fulfilled' ? cwRes.value.courseWork ?? [] : [],
    materials: matRes.status === 'fulfilled' ? matRes.value.courseWorkMaterial ?? [] : [],
    announcements: annRes.status === 'fulfilled' ? annRes.value.announcements ?? [] : [],
    topics: topRes.status === 'fulfilled' ? topRes.value.topic ?? [] : [],
  };
}

export async function fetchDriveAttachmentText(
  accessToken: string,
  fileId: string,
  fileTitle: string
): Promise<{ text: string; mimeType: string }> {
  const meta = await classroomFetch<{ id: string; name: string; mimeType: string }>(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?fields=id,name,mimeType`,
    accessToken
  );

  const mime = meta.mimeType || '';

  if (
    mime === 'application/vnd.google-apps.document' ||
    mime === 'application/vnd.google-apps.presentation'
  ) {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}/export?mimeType=text/plain`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (!res.ok) {
      throw new Error(`Impossible d'exporter le document Google (${res.status})`);
    }
    return { text: await res.text(), mimeType: 'text/plain' };
  }

  if (mime === 'application/pdf' || mime.startsWith('text/')) {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (!res.ok) {
      throw new Error(`Impossible de télécharger le fichier Drive (${res.status})`);
    }
    const arrayBuffer = await res.arrayBuffer();
    if (mime.startsWith('text/')) {
      return {
        text: new TextDecoder('utf-8').decode(arrayBuffer),
        mimeType: mime,
      };
    }

    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    const base64Data = btoa(binary);

    const extractRes = await fetch('/api/ai/extract-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base64Data,
        mimeType: 'application/pdf',
        fileName: meta.name || fileTitle,
      }),
    });
    const extractJson = await extractRes.json();
    if (!extractRes.ok) {
      throw new Error(extractJson.error || "Erreur d'extraction du PDF.");
    }
    return { text: extractJson.extractedText || '', mimeType: 'application/pdf' };
  }

  return {
    text: `Fichier Google Drive attaché : ${meta.name} (${mime}).`,
    mimeType: mime,
  };
}
