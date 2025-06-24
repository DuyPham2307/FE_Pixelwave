import { PostDetailPage, PostSimplePage } from "@/models/PostModel";
import { UserDTO } from "@/models/UserModel";
import api from "@/utils/axiosInstance";

export const searchUsers = async (query: string): Promise<UserDTO[] | []> => {
	try {
		const res = await api.get(
			`/api/user/search?query=${encodeURIComponent(query)}`
		);
		return res.data;
	} catch (error) {
		console.error("Error searching users:", error);
		return [];
	}
};

export const searchPosts = async (
	query: string,
	page = 1,
	size = 10
): Promise<PostDetailPage | null> => {
	try {
		const res = await api.get(
			`/api/posts/search?query=${encodeURIComponent(
				query
			)}&page=${page}&size=${size}`
		);
		return res.data;
	} catch (error) {
		console.error("Error searching posts:", error);
		return null;
	}
};
