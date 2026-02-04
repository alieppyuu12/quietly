export type PageId = string;

export interface Page {
  id: PageId;
  title: string;
  content: string;
  parentId?: PageId;
  createdAt?: string;
  updatedAt?: string;
}