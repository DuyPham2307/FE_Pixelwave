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

	markAllAsRead: () => api.put(`/api/notifications/read-all`),
};
