import {
	PaginatedPostReports,
	PaginatedReports,
	ReportDetail,
	ReportPayload,
	UserViolationSummary,
} from "@/models/ReportModel";
import { UserDTO } from "@/models/UserModel";
import api from "@/utils/axiosInstance";

// Tạo báo cáo mới
export const createReport = async (data: ReportPayload): Promise<void> => {
	await api.post("/api/reports", data);
};

// Lấy danh sách báo cáo có phân trang
export const fetchReports = async ({
	status = "PENDING",
	page = 0,
	size = 10,
	sort = "createdAt,desc",
}: {
	status?: string;
	page?: number;
	size?: number;
	sort?: string;
} = {}): Promise<PaginatedReports> => {
	const response = await api.get("/api/reports", {
		params: { status, page, size, sort },
	});
	return response.data;
};

// Đổi trạng thái báo cáo (PENDING, RESOLVED, REJECTED)
export const updateReportStatus = async (
	reportId: number,
	status: "PENDING" | "RESOLVED" | "REJECTED"
): Promise<void> => {
	await api.patch(`/api/reports/${reportId}/status`, null, {
		params: { status },
	});
};

// Xoá bài viết bị báo cáo
export const deleteReportedPost = async (postId: number): Promise<void> => {
	await api.delete(`/api/reports/posts/${postId}`);
};

export const fetchReportedUsers = async (): Promise<UserViolationSummary[]> => {
	const res = await api.get("/api/reports/users/violations");
	return res.data;
};

// Lấy chi tiết các báo cáo của một người dùng
export const fetchUserReports = async (
	userId: number
): Promise<ReportDetail[]> => {
	const res = await api.get(`/api/reports/users/${userId}/violations`);
	return res.data;
};

export const fetchUserBanned = async (): Promise<UserDTO[]> => {
	const res = await api.get("/api/reports/banned-users");
	return res.data;
}

export const banUserViolance = async (userId: number) => {
	await api.post(`/api/reports/user/${userId}/ban`);
};

export const unBanUserViolance = async (userId: number) => {
	await api.post(`/api/reports/user/${userId}/unban`);
}

export const getPostReportList = async (): Promise<PaginatedPostReports> => {
	try {
		const res = await api.get<PaginatedPostReports>("/api/reports/posts");
		return res.data;
	} catch (error) {
		console.error("Error fetching post reports:", error);
		throw error; // Rethrow the error to handle it in the calling function
	}
};
