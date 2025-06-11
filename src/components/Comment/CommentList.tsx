import React from "react";
import { CommentResponseDTO } from "@/models/CommentModel";
import CommentItem from "./CommentItem";

type CommentListProps = {
	comments: CommentResponseDTO[];
	postId: number;
  setParentComment: (comment: CommentResponseDTO) => void;
	onCommentUpdated: () => void;
};

const CommentList: React.FC<CommentListProps> = ({
	comments,
	onCommentUpdated,
	setParentComment,
	postId,
}) => {
	console.log("comments: ", comments);

	if (comments.length === 0) {
		return <p>No comments yet.</p>;
	}

	return (
		<div className="comment-list">
			{comments.length === 0 && <p>No comments yet.</p>}
			{comments.map((comment) => (
				<CommentItem
					comment={comment}
					onCommentUpdated={onCommentUpdated}
					setParentComment={setParentComment}
					postId={postId}
					key={comment.id}
				/>
			))}
		</div>
	);
};

export default CommentList;
