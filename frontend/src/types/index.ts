export interface Tag {
  id: number;
  name: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  slug: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  tags: Tag[];
}

export interface PaginationMeta {
  totalNotes: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface NotesResponse {
  success: boolean;
  meta: PaginationMeta;
  notes: Note[];
}
