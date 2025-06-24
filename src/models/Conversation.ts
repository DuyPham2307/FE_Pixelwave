import { UserDTO } from "./UserModel";
import { ImageDTO } from '@/models/ImageModel';

export interface Conversation {
  id: string;
  user: UserDTO;
  lastUpdated: string | null;
  lastMessageContent: string;
}

export interface Message {
  id: number;
  content: string;
  sender: UserDTO;
  createdAt: string;  // ISO date string, bạn có thể đổi thành Date nếu muốn parse
  images: ImageDTO[];   // mảng URL ảnh (ở đây là array rỗng)
}

export interface WebSocketMessageDTO{
  id: number;
  content: string;
  sender: string;
  channelId: string; 
  type: "CHAT" | "JOIN" | "LEAVE" | null;
  timestamp: number;
  images: ImageDTO[];
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface MessagePageResponse {
  content: Message[];
  pageable: Pageable;
  last: boolean;          // có phải trang cuối cùng không
  totalElements: number;  // tổng số phần tử trong tất cả các trang
  totalPages: number;     // tổng số trang
  size: number;           // kích thước trang (số phần tử mỗi trang)
  number: number;         // trang hiện tại (giống pageNumber)
  sort: Sort;
  first: boolean;         // có phải trang đầu tiên không
  numberOfElements: number; // số phần tử trong trang hiện tại
  empty: boolean;         // trang hiện tại có rỗng không
}