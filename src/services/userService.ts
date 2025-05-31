import api from "@/utils/axiosInstance";
import axios from "axios";
import { UserDetailResponse, UserFirstUpload } from "@/models/UserModel";

export const getUserById = async (
	userId: number
): Promise<UserDetailResponse> => {
	try {
		const response = await api.get<UserDetailResponse>(`/api/user/${userId}`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("get user FromId failed in axios:", error);
			throw new Error(
				"Request failed: " + (error.response?.data?.message || "Unknown error")
			);
		} else {
			console.error("get user FromId failed:", error);
			throw new Error("Unexpected error occurred.");
		}
	}
};

export const updateAvatar = async (
	file: File,
	testValue: string
): Promise<void> => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("test", testValue);

	try {
		const response = await api.patch(`/api/user/avatar`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});

		if (response.status !== 200) {
			throw new Error("Failed to update avatar");
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("update avatar failed in axios:", error);
			throw new Error(
				"Request failed: " + (error.response?.data?.message || "Unknown error")
			);
		} else {
			console.error("update avatar failed:", error);
			throw new Error("Unexpected error occurred.");
		}
	}
};

export const updateUserProfile = async (userData: UserFirstUpload) => {
	try {
		const response = await api.patch("/api/user/profile", userData);

		if (response.status !== 200) {
			throw new Error("Failed to update profile first time");
		}
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("update profile first time in axios:", error);
			throw new Error(
				"Request failed: " + (error.response?.data?.message || "Unknown error")
			);
		} else {
			console.error("update profile first time failed:", error);
			throw new Error("Unexpected error occurred.");
		}
	}
};

export const updatePassword = async (oldPass: string, newPass: string) => {
	try {
		const response = await api.put("/api/user/password", {
			"oldPassword": oldPass,
			"newPassword": newPass
		});

		// if (response.status !== 200) {
		// 	throw new Error("Failed to update password");
		// }
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("update password in axios:", error);
			throw new Error(
				"Request failed: " + (error.response?.data?.message || "Unknown error")
			);
		} else {
			console.error("update password failed:", error);
			throw new Error("Unexpected error occurred.");
		}
	}
};
