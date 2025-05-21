import { UserDTO } from "./UserModel";

// models/CollectionModel.ts
export interface CollectionRequestDTO {
  title: string;
  description?: string; // có thể không bắt buộc
  isPublic: boolean;
}

export interface CollectionResponseDTO {
  id: number;
  title: string;
  description?: string;
  isPublic: boolean;
  user: UserDTO;
  postCount: number;
}
