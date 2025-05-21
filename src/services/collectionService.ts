import api from "@/utils/axiosInstance";
import { CollectionRequestDTO, CollectionResponseDTO } from "@/models/CollectionModel";
import { PostSimple } from "@/models/PostModel";

export const createCollection = async (data: CollectionRequestDTO): Promise<CollectionResponseDTO> => {
  const res = await api.post<CollectionResponseDTO>("/api/v1/collections", data);
  return res.data;
};

export const updateCollection = async (collectionId: number, data: CollectionRequestDTO): Promise<CollectionResponseDTO> => {
  const res = await api.put<CollectionResponseDTO>(`/api/v1/collections/${collectionId}`, data);
  return res.data;
};

export const deleteCollection = async (collectionId: number): Promise<void> => {
  await api.delete(`/api/v1/collections/${collectionId}`);
};

export const getCollectionById = async (collectionId: number): Promise<CollectionResponseDTO> => {
  const res = await api.get<CollectionResponseDTO>(`/api/v1/collections/${collectionId}`);
  return res.data;
};

export const getUserCollections = async (): Promise<CollectionResponseDTO[]> => {
  const res = await api.get<CollectionResponseDTO[]>("/api/v1/collections/user");
  return res.data;
};

export const addPostToCollection = async (collectionId: number, postId: number): Promise<void> => {
  await api.post(`/api/v1/collections/${collectionId}/posts/${postId}`);
};

export const removePostFromCollection = async (collectionId: number, postId: number): Promise<void> => {
  await api.delete(`/api/v1/collections/${collectionId}/posts/${postId}`);
};

export const getPostsInCollection = async (collectionId: number, search?: string): Promise<PostSimple[]> => {
  const res = await api.get<PostSimple[]>(`/api/v1/collections/${collectionId}/posts`, {
    params: { search },
  });
  return res.data;
};