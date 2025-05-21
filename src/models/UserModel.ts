export interface UserDetailResponse {
  id: number;
  fullName: string;
  avatar: string | "";
  phoneNumber: string | "";
  age: number ;
  gender: "Male" | "Female" | "";
  bio: string | "";
  postCount: number;
  followerCount: number;
  followingCount: number;
  friendCount: number;
}

export interface UserDetail {
  id: number;
  fullName: string;
  avatar: string | "";
  phoneNumber: string | "";
}

export interface UserFirstUpload {
  phoneNumber: string;
  age: number;
  gender: "Male" | "Female" | "";
  bio: string;
}

export interface UserDTO {
  id: number;
  username: string;
  avatar: string;
}