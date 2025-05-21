import React, { useState } from "react";
import { CommentResponseDTO } from "@/models/CommentModel";
import { getRepliesByCommentId, updateComment, deleteComment } from "@/services/commentService";
import "@/styles/components/_commentItem.scss"; // Đường dẫn đến file CSS của bạn
import { formatTimestamp } from "@/utils/formatTimestamp";
import toast from "react-hot-toast";

type CommentItemProps = {
  comment: CommentResponseDTO;
  onCommentUpdated: () => void;
};

const CommentItem: React.FC<CommentItemProps> = ({ comment, onCommentUpdated }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<CommentResponseDTO[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const loadReplies = async () => {
    try {
      const data = await getRepliesByCommentId(comment.id);
      setReplies(data);
    } catch (error) {
      console.error("Failed to load replies", error);
    }
  };

  const toggleReplies = () => {
    if (!showReplies) {
      loadReplies();
    }
    setShowReplies(!showReplies);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleEditSave = async () => {
    try {
      await updateComment(comment.id, {
        content: editContent,
        postId: comment.postId, // Nếu bạn có postId ở đâu đó hoặc từ prop comment (bạn cần thêm vào model nếu chưa có)
        parentCommentId: comment.parentCommentId || null,
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

  return (
    <div className={`comment-item ${comment.parentCommentId ? "reply" : ""}`}>
      <div className="comment-header">
        <img src={comment.user.avatar} alt={comment.user.username} />
        <div className="user-data">
          <strong>{comment.user.username}</strong>
          <span>{formatTimestamp(comment.createdAt)}</span>
        </div>
      </div>

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

      {!isEditing && (
        <div className="comment-actions">
          <button onClick={() => alert("Reply feature here")}>Reply</button>
          <button onClick={handleEditClick}>Edit</button>
          <button onClick={handleDeleteClick}>Delete</button>
        </div>
      )}

      {comment.hasReplies && (
        <button onClick={toggleReplies} className="toggle-replies-btn">
          {showReplies ? "Hide Replies" : "Show Replies"}
        </button>
      )}

      {showReplies && replies.length > 0 && (
        <div className="comment-replies">
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onCommentUpdated={onCommentUpdated} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
