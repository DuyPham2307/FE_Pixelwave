import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
	withCredentials: true,
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const msg = error?.response?.data;

		if (
			error.response?.status === 500 &&
			typeof msg === "string" &&
			(msg.includes("Refresh token") || msg.includes("Invalid refresh token"))
		) {
			console.warn("🔒 Refresh token expired or invalid. Logging out...");
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken"); // Xoá token trong localStorage/cookie
			window.location.href = "/login"; // hoặc navigate("/login")
		}

		return Promise.reject(error);
	}
);

api.interceptors.request.use(
	async (config) => {
		// Lấy accessToken từ localStorage
		const accessToken = localStorage.getItem("accessToken");

		// Nếu accessToken có và hợp lệ, thêm vào header
		if (accessToken) {
			config.headers["Authorization"] = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Cấu hình response interceptor để xử lý khi token hết hạn
api.interceptors.response.use(
	(response) => {
		return response; // Nếu response thành công, trả về
	},
	async (error) => {
		const originalRequest = error.config;

		// Kiểm tra nếu lỗi là do token hết hạn (HTTP 401)
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true; // Đánh dấu là đã thử lại

			// Lấy refreshToken từ localStorage
			const refreshToken = localStorage.getItem("refreshToken");

			if (refreshToken) {
				try {
					// Gửi yêu cầu làm mới accessToken với refreshToken
					const response = await axios.post("/api/refresh-token", {
						refreshToken,
					});

					// Nếu làm mới thành công, lưu lại accessToken mới
					const newAccessToken = response.data.accessToken;
					const newRefreshToken = response.data.refreshToken;
					localStorage.setItem("accessToken", newAccessToken);
					localStorage.setItem("refreshToken", newRefreshToken);

					// Thêm accessToken mới vào lại header của yêu cầu ban đầu
					originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

					// Gửi lại yêu cầu ban đầu với accessToken mới
					return api(originalRequest);
				} catch (refreshError) {
					// Nếu lỗi khi làm mới token (ví dụ: refreshToken hết hạn), yêu cầu người dùng đăng nhập lại
					console.error(
						"Refresh token expired or invalid. Please log in again.",
						refreshError
					);
					localStorage.removeItem("accessToken");
					localStorage.removeItem("refreshToken");
					window.location.href = "/login";
					return Promise.reject(refreshError);
					// Redirect to login page or handle as needed
				}
			}
		}

		return Promise.reject(error);
	}
);

export default api;
