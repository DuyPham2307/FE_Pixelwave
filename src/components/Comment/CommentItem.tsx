import React, { useState } from "react";
import { CommentResponseDTO } from "@/models/CommentModel";
import {
	getRepliesByCommentId,
	updateComment,
	deleteComment,
} from "@/services/commentService";
import "@/styles/components/_commentItem.scss"; // Đường dẫn đến file CSS của bạn
import { formatRelativeTime, formatTimestamp } from "@/utils/formatTimestamp";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

type CommentItemProps = {
	comment: CommentResponseDTO;
	postId: number;
	setParentComment: (comment: CommentResponseDTO) => void;
	onCommentUpdated: () => void;
};

const CommentItem: React.FC<CommentItemProps> = ({
	comment,
	setParentComment,
	onCommentUpdated,
	postId,
}) => {
	const [showReplies, setShowReplies] = useState(false);
	const [replies, setReplies] = useState<CommentResponseDTO[]>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState(comment.content);
	const { user } = useAuth();

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleEditCancel = () => {
		setEditContent(comment.content);
		setIsEditing(false);
	};

	const checkCanEdit = () => {
		return comment.user.id === user?.id;
	};

	const handleEditSave = async () => {
		try {
			await updateComment(comment.id, {
				content: editContent,
				postId: postId,
			});
			setIsEditing(false);
			onCommentUpdated();
		} catch (error) {
			console.error("Failed to update comment", error);
			alert("Failed to update comment.");
		}
	};

	const handleDeleteClick = async () => {
		try {
			await deleteComment(comment.id);
			onCommentUpdated();
			toast.success("Comment deleted successfully!");
		} catch (error) {
			console.error("Failed to delete comment", error);
			alert("Failed to delete comment.");
		}
	};

	const loadReplies = async () => {
		try {
			const data = await getRepliesByCommentId(comment.id);
			setReplies(data);
			toast.success("Load reply success");
		} catch (error) {
			console.error("Failed to load replies", error);
		}
	};

	const toggleReplies = () => {
		if (!showReplies && replies.length === 0) {
			loadReplies();
		}
		setShowReplies(!showReplies);
	};

	return (
		<div className={`comment-item`}>
			<div className="comment-header">
				<img src={comment.user.avatar} alt={comment.user.fullName} />
				<div className="user-data">
					<span>
						<strong>{comment.user.fullName}</strong>{" "}
						{formatRelativeTime(comment.createdAt)}
					</span>
					<div className="comment-content">
						{isEditing ? (
							<>
								<textarea
									value={editContent}
									onChange={(e) => setEditContent(e.target.value)}
									rows={3}
									style={{ width: "100%" }}
								/>
								<div>
									<button onClick={handleEditSave}>Save</button>
									<button onClick={handleEditCancel}>Cancel</button>
								</div>
							</>
						) : (
							<>
								<p>{comment.content}</p>
								{comment.images && comment.images.length > 0 && (
									<div className="comment-images">
										{comment.images.map((img) => (
											<img key={img.id} src={img.url} alt="comment image" />
										))}
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>

			{/* <div className="comment-content">
				{isEditing ? (
					<>
						<textarea
							value={editContent}
							onChange={(e) => setEditContent(e.target.value)}
							rows={3}
							style={{ width: "100%" }}
						/>
						<div>
							<button onClick={handleEditSave}>Save</button>
							<button onClick={handleEditCancel}>Cancel</button>
						</div>
					</>
				) : (
					<>
						<p>{comment.content}</p>
						{comment.images && comment.images.length > 0 && (
							<div className="comment-images">
								{comment.images.map((img) => (
									<img key={img.id} src={img.url} alt="comment image" />
								))}
							</div>
						)}
					</>
				)}
			</div> */}

			{!isEditing && (
				<div className="comment-actions">
					<button onClick={() => setParentComment(comment)}>Reply</button>
					{checkCanEdit() && (
						<>
							<button onClick={handleEditClick}>Edit</button>
							<button onClick={handleDeleteClick}>Delete</button>
						</>
					)}
					{comment.hasReplies && (
						<button onClick={toggleReplies} className="toggle-replies-btn">
							{showReplies ? "Hide Replies" : "Show Replies"}
						</button>
					)}
				</div>
			)}

			{showReplies && replies.length > 0 && (
				<div className="comment-replies">
					{replies.map((reply) => (
						<CommentItem
							key={reply.id}
							comment={reply}
							postId={postId}
							onCommentUpdated={onCommentUpdated}
							setParentComment={setParentComment}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default CommentItem;
