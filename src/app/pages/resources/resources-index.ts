export interface ResourceDoc {
  slug: string;
  title: string;
  description: string;
  path: string;
  downloadUrl: string;
}

export interface ResourceIndex {
  categories: Record<string, { title: string; documents: ResourceDoc[] }>;
}
