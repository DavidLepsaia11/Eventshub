// src/types/event.ts

export interface CategoryDto {
  id: number;
  name: string;
}

export interface EventDto {
  id: number;
  title: string;
  description: string;
  location: string;
  startDate: string;   // ISO 8601
  endDate: string;     // ISO 8601
  isPublished: boolean;
  coverImageUrl: string | null;
  categoryId: number | null;
  category: CategoryDto | null;
  createdAt: string;
  updatedAt: string | null;
  isFavourited?: boolean | null;
  isGoing?: boolean | null;
}

export interface CreateEventDto {
  title: string;        // required, max 200
  description: string;  // max 2000
  location: string;     // required, max 500
  startDate: string;    // required ISO date
  endDate: string;      // required ISO date
  isPublished: boolean;
  categoryId: number | null;
}

export interface UpdateEventDto extends CreateEventDto {}

export interface PagedResultDto<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

