import { Conversation, MessagePageResponse } from "@/models/Conversation";
import api from "@/utils/axiosInstance";

export const getConversations = async (
	search = ""
): Promise<Conversation[]> => {
	const res = await api.get("/api/chat/conversations", {
		params: {
			search,
			sortBy: "lastUpdated",
			sortDirection: "desc",
		},
	});
	return res.data;
};

export const getMessages = async (
  conversationId: string,
  page: number
): Promise<MessagePageResponse> => {
  const res = await api.get(`/api/chat/conversation/${conversationId}/messages?page=${page}&size=20`);
  return res.data; // nên có { content: Message[], totalPages, number (page) }
};