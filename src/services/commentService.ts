// src/services/commentService.ts
import api from "@/utils/axiosInstance";
import { CommentRequestDTO, CommentResponseDTO } from "@/models/CommentModel";

export const createComment = async (
	comment: CommentRequestDTO
): Promise<CommentResponseDTO> => {
	try {
		const formData = new FormData();
		formData.append("content", comment.content);
		formData.append("postId", comment.postId.toString());

		if (comment.parentCommentId != null) {
			formData.append("parentCommentId", comment.parentCommentId.toString());
		}

		if (comment.images) {
			comment.images.forEach((file) => {
				formData.append("images", file);
			});
		}

		const response = await api.post("/api/v1/comments", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return response.data;
	} catch (error) {
		console.error("Error creating comment:", error);
		throw error;
	}
};


export const updateComment = async (
	commentId: number,
	comment: CommentRequestDTO
): Promise<CommentResponseDTO> => {
	try {
		const formData = new FormData();
		formData.append("content", comment.content);
		formData.append("postId", comment.postId.toString());

		if (comment.parentCommentId != null) {
			formData.append("parentCommentId", comment.parentCommentId.toString());
		}

		if (comment.images) {
			comment.images.forEach((file) => {
				formData.append("images", file);
			});
		}

		const response = await api.put(`/api/v1/comments/${commentId}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return response.data;
	} catch (error) {
		console.error("Error updating comment:", error);
		throw error;
	}
};


export const deleteComment = async (commentId: number): Promise<void> => {
	try {
		await api.delete(`/api/v1/comments/${commentId}`);
	} catch (error) {
		console.error("Error deleting comment:", error);
		throw error;
	}
};

export const getCommentsByPostId = async (
	postId: number
): Promise<CommentResponseDTO[]> => {
	try {
		const response = await api.get(`/api/v1/comments/post/${postId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching comments by postId:", error);
		throw error;
	}
};

export const getCommentById = async (
	commentId: number
): Promise<CommentResponseDTO> => {
	try {
		const response = await api.get(`/api/v1/comments/${commentId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching comment by id:", error);
		throw error;
	}
};

export const getRepliesByCommentId = async (
	commentId: number
): Promise<CommentResponseDTO[]> => {
	try {
		const response = await api.get(`/api/v1/comments/${commentId}/replies`);
		return response.data;
	} catch (error) {
		console.error("Error fetching replies:", error);
		throw error;
	}
};
