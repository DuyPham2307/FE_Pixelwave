import React, { useState } from "react";
import { createComment } from "@/services/commentService";
import "@/styles/components/_commentForm.scss"; // Đường dẫn đến file CSS của bạn
import { SendHorizontal } from "lucide-react";

type CommentFormProps = {
  postId: number;
  onCommentAdded: () => void;
};

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await createComment({ content, postId, parentCommentId: null });
      setContent("");
      onCommentAdded();
    } catch (error) {
      alert("Failed to post comment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
      />
      <button type="submit"><SendHorizontal /></button>
    </form>
  );
};

export default CommentForm;
