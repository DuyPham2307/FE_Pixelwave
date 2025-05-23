export interface ImageDTO {
	id: number;
	url: string;
}

export interface ImageTag{
	id: number;
	name: string;
	imageCount: number;
}

export interface TagImageResponse {
  imageId: number;
  url: string;
  postId: number
  likeCount: number;
} 

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface ImagePageResponse<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // current page number
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface TagResponseDTO{
  id: number;
  name: string;
  imageCount: number;
}