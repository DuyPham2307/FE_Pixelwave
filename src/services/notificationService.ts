import { NotificationDTO, Page } from "@/models/Notification";
import api from "@/utils/axiosInstance";

export const notificationService = {
	getNotifications: (page = 0, size = 10, isRead?: boolean) =>
		api.get<Page<NotificationDTO>>(`/api/notifications`, {
			params: {
				page,
				size,
				...(isRead !== undefined && { isRead }),
			},
		}),
	getAllNotifications: (page = 0, size = 20, unreadOnly = false) => {
		const url =
			`/api/notifications?page=${page}&size=${size}` +
			(unreadOnly ? "&isRead=false" : "");
		return api.get(url);
	},
	markAsRead: (id: number) => api.post(`/api/notifications/${id}/read`),
	markAllAsRead: () => api.post(`/api/notifications/read-all`),
};
