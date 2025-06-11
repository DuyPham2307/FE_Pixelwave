import api from "@/utils/axiosInstance";
import axios from "axios";
import {
	PostRequestPage,
	UploadPost,
	PostDetail,
	PostSimplePage,
} from "@/models/PostModel";
import { UserDTO } from "@/models/UserModel";

export const uploadPost = async (payload: UploadPost): Promise<void> => {
	const formData = new FormData();
	formData.append("caption", payload.caption);
	formData.append("privacySetting", payload.privacySetting);
	payload.images.forEach((file) => formData.append("images", file));

	if (payload.taggedUserIds && payload.taggedUserIds.length > 0) {
		payload.taggedUserIds.forEach((id) => {
			formData.append("taggedUserIds", id.toString());
		});
	}

	try {
		const response = await api.post("/api/post", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status !== 201) {
			throw new Error("Upload failed");
		}
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("uploadPost failed in axios:", error);
			throw new Error("Some files are not the same as the sample format");
		} else {
			console.error("uploadPost failed:", error);
			throw new Error("Upload failed. Please try again!");
		}
	}
};

export const getPostById = async (
	postId: number,
	useAuth: boolean = false
): Promise<PostDetail> => {
	try {
		const client = useAuth ? api : axios;
		const baseUrl = useAuth ? "" : import.meta.env.VITE_API_URL;

		const response = await client.get<PostDetail>(
			`${baseUrl}/api/post/${postId}`
		);

		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("getPostById failed in axios:", error);
			throw new Error(
				"Request failed: " + (error.response?.data?.message || "Unknown error")
			);
		} else {
			console.error("getPostById failed:", error);
			throw error;
		}
	}
};

export const getTaggedUserOfPost = async (
	postId: number
): Promise<UserDTO[]> => {
	try {
		const res = await api.get(`/api/post/${postId}/tagged-users`);
		return res.data;
	} catch (error) {
		console.error("getTaggedUserOfPost failed:", error);
		throw error;
	}
};

export const getPostFromUserId = async (
	payload: PostRequestPage
): Promise<PostSimplePage> => {
	try {
		const { userId, page, size, sortBy, sortDirection } = payload;
		const response = await api.get<PostSimplePage>(
			`/api/user/${userId}/posts`,
			{
				params: {
					size,
					page,
					sortBy,
					sortDirection,
				},
			}
		);

		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("getPostFromId failed in axios:", error);
			throw new Error(
				"Request failed: " + (error.response?.data?.message || "Unknown error")
			);
		} else {
			console.error("getPostFromId failed:", error);
			throw new Error("Unexpected error occurred.");
		}
	}
};

export const getFeed = async (limit: number = 10): Promise<PostDetail[]> => {
	try {
		const response = await api.get<PostDetail[]>(`/api/feed`, {
			params: { size: limit },
		});
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("getFeed failed in axios:", error);
			throw new Error(
				"Request failed: " + (error.response?.data?.message || "Unknown error")
			);
		} else {
			console.error("getFeed failed:", error);
			throw new Error("Unexpected error occurred.");
		}
	}
};

export const likePost = async (postId: number) => {
	try {
		await api.post(`api/post/${postId}/like`);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("Toggle like failed:", error.response?.data);
			throw new Error(error.response?.data?.message || "Toggle like failed");
		} else {
			console.error("Toggle like failed:", error);
			// throw new Error(error);
		}
	}
};

export const unlikePost = async (postId: number) => {
	try {
		await api.post(`api/post/${postId}/unlike`);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("Toggle like failed:", error.response?.data);
			throw new Error(error.response?.data?.message || "Toggle like failed");
		} else {
			console.error("Toggle like failed:", error);
			// throw new Error(error);
		}
	}
};

export const getPostTagged = async (
	payload: PostRequestPage
): Promise<PostSimplePage> => {
	try {
		const { userId, page, size, sortBy, sortDirection } = payload;
		const response = await api.get<PostSimplePage>(
			`/api/user/${userId}/tagged-posts`,
			{
				params: {
					size,
					page,
					sortBy,
					sortDirection,
				},
			}
		);

		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("getPostFromId failed in axios:", error);
			throw new Error(
				"Request failed: " + (error.response?.data?.message || "Unknown error")
			);
		} else {
			console.error("getPostFromId failed:", error);
			throw new Error("Unexpected error occurred.");
		}
	}
};

export const deletePostById = async (postId: number): Promise<void> => {
	try {
		const response = await api.delete(`/api/post/${postId}`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("deletePostById failed in axios:", error);
			throw new Error(
				"Request failed: " + (error.response?.data?.message || "Unknown error")
			);
		} else {
			console.error("deletePostById failed:", error);
			throw new Error("Unexpected error occurred.");
		}
	}
};
