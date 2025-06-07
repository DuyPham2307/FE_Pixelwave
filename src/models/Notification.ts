import { UserDTO } from "./UserModel";

export type NotificationType =
  | "NEW_POST"
  | "NEW_COMMENT"
  | "REPLY_TO_COMMENT"
  | "TAGGED_IN_POST"
  | "MENTION_IN_COMMENT"
  | "MENTION_IN_POST"
  | "FRIEND_REQUEST_ACCEPTED"
  | "NEW_FRIEND_REQUEST"
  | "NEW_MESSAGE";

export interface NotificationDTO {
  id: number;
  sender: UserDTO;
  type: NotificationType;
  content: string;
  isRead: boolean;
  createdAt: string; // hoặc `Date` nếu bạn parse về JS Date
  referenceId: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page number
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
