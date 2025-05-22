import { ImageDTO } from "./ImageModel";
import { UserResponse } from '@/models/AuthModel';

export interface UploadPost {
	caption: string;
	privacySetting: string;
	images: File[];
	taggedUserIds: number[] | null;
}

export interface PostRequestPage {
  userId: number;
  page?: number;
  size?: number;
  sortBy?: 'createAt' | 'updateAt';
  sortDirection?: 'asc' | 'desc';
}

export interface PostResponsesPage {
  posts: PostResponseWithoutUser[] | [];
  totalPages: 0;
  totalElements: 0;
  pageSize: 10;
  currentPage: 1;
}

export interface PostResponseWithoutUser {
  id: number;
  caption: string;
  privacySetting: string;
  createdAt: string; // Hoặc Date nếu bạn sẽ parse lại sau
  images: ImageDTO[]; // Thay vì Hash<>
  taggedUsers: UserResponse[]; // Thay vì Set<>
  likeCount: number;
  commentCount: number;
  isLikedByUser: boolean;
  //Vì đã biết Id user của bài post nên không cần truyền
}

export interface PostDetail {
  id: number;
  caption: string;
  createdAt: string; // ISO format từ Timestamp trong Java
  privacySetting: 'public' | 'private' | 'friend';
  postUser: UserResponse;
  likeCount: number;
  commentCount: number;
  isTaggedUser: boolean;
  liked: boolean;
  tagUserCount: number;
  images: ImageDTO[];
}

export interface PostSimplePage {
  posts: PostSimple[] | [];
  totalPages: number | 0;
  totalElements: number | 0;
  pageSize: number | 10;
  currentPage: number | 1;
}

export interface PostSimple {
  id: number;
  imageUrl: string;
  likeCount: number;
  commentCount: number;
}
