export type ModuleId =
  | 'accueil'
  | 'cybersecurite'
  | 'prompt-engineering'
  | 'creation-contenu'
  | 'python'
  | 'langage-c'
  | 'algorithmique'
  | 'systemes-exploitation'
  | 'architecture-electronique'
  | 'tp-iset-nabeul'
  | 'classroom'
  | 'studio'
  | 'export';

export type TargetModuleCategory =
  | 'tp-iset-nabeul'
  | 'digital-skills'
  | 'fondamental-it'
  | 'systemes-electriques';

export interface StudentProfile {
  fullName: string;
  filiere: string;
  campus: string;
  githubUsername: string;
  repoName: string;
  bio: string;
}

export interface CourseSummary {
  overview: string;
  keyConcepts: string[];
  formulasOrCommands: string[];
  examTips: string[];
}

export interface MindmapBranch {
  label: string;
  items: string[];
}

export interface MindmapData {
  center: string;
  branches: MindmapBranch[];
}

export interface PodcastTurn {
  speaker: 'Amira' | 'Yassine' | string;
  style: string;
  text: string;
}

export interface VideoSlide {
  slideNumber: number;
  title: string;
  bullets: string[];
  codeOrFormula: string;
  narration: string;
}

export interface GeneratedCoursePack {
  summary: CourseSummary;
  mindmap: MindmapData;
  podcastScript: PodcastTurn[];
  videoSlides: VideoSlide[];
}

export interface CourseResource {
  id: string;
  title: string;
  moduleTarget: TargetModuleCategory;
  sourceType: 'classroom-tp' | 'classroom-cours' | 'classroom-annonce' | 'iset-default' | 'upload';
  courseName: string;
  description: string;
  rawContent: string;
  driveFileId?: string;
  driveMimeType?: string;
  alternateLink?: string;
  createdAt: string;
  generatedPack?: GeneratedCoursePack;
  podcastAudioBase64?: string;
  slideVoicesBase64?: string[];
  videoWebmBase64?: string;
}

export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  room?: string;
  alternateLink?: string;
  courseState?: string;
}

export interface ClassroomMaterialAttachment {
  driveFile?: {
    driveFile: {
      id: string;
      title: string;
      alternateLink?: string;
      thumbnailUrl?: string;
    };
    shareMode?: string;
  };
  youtubeVideo?: {
    id: string;
    title: string;
    alternateLink?: string;
  };
  link?: {
    url: string;
    title?: string;
  };
  form?: {
    formUrl: string;
    title?: string;
  };
}

export interface ClassroomCourseWork {
  id: string;
  title: string;
  description?: string;
  materials?: ClassroomMaterialAttachment[];
  state?: string;
  alternateLink?: string;
  creationTime?: string;
  dueDate?: { year: number; month: number; day: number };
  workType?: string;
  topicId?: string;
}

export interface ClassroomCourseWorkMaterial {
  id: string;
  title: string;
  description?: string;
  materials?: ClassroomMaterialAttachment[];
  alternateLink?: string;
  creationTime?: string;
  topicId?: string;
}

export interface ClassroomAnnouncement {
  id: string;
  text?: string;
  materials?: ClassroomMaterialAttachment[];
  alternateLink?: string;
  creationTime?: string;
}

export interface ClassroomTopic {
  topicId: string;
  name: string;
}
