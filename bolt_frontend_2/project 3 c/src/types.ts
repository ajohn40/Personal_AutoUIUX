export interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  lastModified: number;
  improved?: boolean;
  improvements?: Improvement[];
}

export interface Improvement {
  type: 'performance' | 'accessibility' | 'seo' | 'design' | 'code';
  description: string;
}

export interface ImprovementRequest {
  userRequest: string;
  files: FileData[];
  timestamp: number;
}