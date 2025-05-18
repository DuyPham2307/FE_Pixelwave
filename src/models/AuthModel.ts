export interface UserResponse {
	id: number;
	fullName: string;
	avatar: string;
	role: "USER" | "ADMIN";
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	user: UserResponse;
}

export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  age: number;
}
