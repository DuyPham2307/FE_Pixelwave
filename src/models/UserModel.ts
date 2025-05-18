export interface UserDetailResponse {
  id: number;
  fullName: string;
  avatar: string | "";
  phoneNumber: string | "";
  age: number | "";
  gender: "Male" | "Female" | "";
  bio: string | "";
  postCount: number;
  followerCount: number;
  followingCount: number;
  friendCount: number;
}