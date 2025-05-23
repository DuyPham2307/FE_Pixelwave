import { ImageDTO } from "./ImageModel";
import { UserDTO } from "./UserModel";

export interface CommentResponseDTO {
  id: number;
  content: string;
  createdAt: string; // LocalDateTime -> string ISO
  user: UserDTO;
  images: ImageDTO[];
  hasReplies: boolean;
};

export interface CommentRequestDTO {
  content: string;
  postId: number;
  parentCommentId?: number | null; // optional, dùng cho reply
};
