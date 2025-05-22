import {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
} from "@/models/AuthModel";
import api from "@/utils/axiosInstance"; // Điều chỉnh đường dẫn nếu cần
import axios from "axios";

// Hàm login
export const loginNormal = async (
	payload: LoginRequest
): Promise<LoginResponse> => {
	try {
		// Dùng axios gốc, KHÔNG dùng api
		const response = await axios.post<LoginResponse>(
			`${import.meta.env.VITE_API_URL}/api/auth/login`,
			payload
		);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("Login failed in axios:", error);
			throw new Error("Email or password is invalid!");
		} else {
			console.error("Login failed:", error);
			throw new Error("Login failed. Please try again!");
		}
	}
};

export const getGoogleLoginUrl = async (): Promise<string> => {
	return `${
		import.meta.env.VITE_API_URL
	}/api/auth/social-login?provider=google`;
};

// Hàm gửi mã xác thực từ Google về backend để lấy token
export const loginGoogle = async (code: string): Promise<LoginResponse> => {
	try {
		const response = await axios.get<LoginResponse>(
			`${import.meta.env.VITE_API_URL}/api/auth/social-login/callback`,
			{
				params: { provider: "google", code },
			}
		);
		console.log(response.data); // In ra kết quả đăng nhập
		console.log("done");
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("Login failed in axios:", error);
			throw new Error("Đăng nhập thất bại, vui lòng thử lại!");
		}
		console.error("Login failed:", error);
		throw new Error("Đã có lỗi xảy ra, vui lòng thử lại!");
	}
};

// Hàm register
export const registerService = async (
	payload: RegisterRequest
): Promise<void> => {
	try {
		const response = await api.post("/api/auth/register", payload);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("Register failed:", error);
			throw new Error("Đăng ký thất bại. Vui lòng thử lại!");
		}
		console.error("Register failed:", error);
		throw new Error("Đăng ký thất bại. Vui lòng thử lại!");
	}
};
