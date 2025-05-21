import React from "react";
import { CommentResponseDTO } from "@/models/CommentModel";
import CommentItem from "./CommentItem";

type CommentListProps = {
  comments: CommentResponseDTO[];
  onCommentUpdated: () => void;
};

const CommentList: React.FC<CommentListProps> = ({ comments, onCommentUpdated }) => {
  console.log("comments: ", comments); 

  if (comments.length === 0) {
    return <p>No comments yet.</p>;
  }

  return (
    <div className="comment-list">
      {comments.length === 0 && <p>No comments yet.</p>}
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onCommentUpdated={onCommentUpdated} />
      ))}
    </div>
  );
};

export default CommentList;
