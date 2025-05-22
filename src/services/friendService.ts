import {
	AddFriendRequestDTO,
	UserDetailResponse,
	UserDTO,
	UserRecommendationDTO,
} from "@/models/UserModel";
import api from "@/utils/axiosInstance";
import axios from "axios";

export const getRecommendUser = async (
	limit: number
): Promise<UserRecommendationDTO[]> => {
	try {
		const res = await api.get(`/api/user/recommendations?limit=${limit}`);
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("getRecommend User in axios:", error);
			throw new Error(
				"Request failed: " + (error.response?.data?.message || "Unknown error")
			);
		} else {
			console.error("getRecommend User failed:", error);
			throw new Error("Unexpected error occurred.");
		}
	}
};

export const addFriend = async (userId: number) => {
	try {
		const res = await api.post(`/api/user/${userId}/add-friend`);
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("getRecommend User in axios:", error);
			throw new Error(
				"Request failed: " + (error.response?.data?.message || "Unknown error")
			);
		} else {
			console.error("getRecommend User failed:", error);
			throw new Error("Unexpected error occurred.");
		}
	}
};

export const getPendingFriendRequests = async (): Promise<
	AddFriendRequestDTO[]
> => {
	try {
		const res = await api.get("/api/user/friend-requests");
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("getPendingFriendRequests axios error:", error);
			throw new Error(
				error.response?.data?.message || "Failed to get friend requests."
			);
		} else {
			console.error("getPendingFriendRequests unknown error:", error);
			throw new Error("Unexpected error occurred.");
		}
	}
};

export const acceptFriendRequest = async (requestId: number): Promise<void> => {
	try {
		await api.post(`/api/user/friend-request/${requestId}/accept`);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("acceptFriendRequest axios error:", error);
			throw new Error(
				error.response?.data?.message || "Failed to accept friend request."
			);
		} else {
			console.error("acceptFriendRequest unknown error:", error);
			throw new Error("Unexpected error occurred.");
		}
	}
};

export const rejectFriendRequest = async (requestId: number): Promise<void> => {
	try {
		await api.post(`/api/user/friend-request/${requestId}/reject`);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("rejectFriendRequest axios error:", error);
			throw new Error(
				error.response?.data?.message || "Failed to reject friend request."
			);
		} else {
			console.error("rejectFriendRequest unknown error:", error);
			throw new Error("Unexpected error occurred.");
		}
	}
};

export const getListFriends = async (userId: number): Promise<UserDTO[]> => {
	try {
		const res = await api.get(`/api/user/${userId}/friends`);
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("rejectFriendRequest axios error:", error);
			throw new Error(
				error.response?.data?.message || "Failed to reject friend request."
			);
		} else {
			console.error("rejectFriendRequest unknown error:", error);
			throw new Error("Unexpected error occurred.");
		}
	}
};

export const blockUser = async (userId: number): Promise<void> => {
	try {
		await api.post(`/api/user/${userId}/block`);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("blockUser axios error:", error);
			throw new Error(error.response?.data?.message || "Failed to block user.");
		} else {
			console.error("blockUser unknown error:", error);
			throw new Error("Unexpected error occurred.");
		}
	}
};

export const unblockUser = async (userId: number): Promise<void> => {
	try {
		await api.post(`/api/user/${userId}/unblock`);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("unblockUser axios error:", error);
			throw new Error(
				error.response?.data?.message || "Failed to unblock user."
			);
		} else {
			console.error("unblockUser unknown error:", error);
			throw new Error("Unexpected error occurred.");
		}
	}
};

export const getBlockedUsers = async (): Promise<UserDetailResponse[]> => {
	try {
		const res = await api.get("/api/user/blocked-users");
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("getBlockedUsers axios error:", error);
			throw new Error(
				error.response?.data?.message || "Failed to get blocked users."
			);
		} else {
			console.error("getBlockedUsers unknown error:", error);
			throw new Error("Unexpected error occurred.");
		}
	}
};
