import React, { useState } from "react";
import { createComment } from "@/services/commentService";
import "@/styles/components/_commentForm.scss"; // Đường dẫn đến file CSS của bạn
import { SendHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { CommentResponseDTO } from "@/models/CommentModel";

type CommentFormProps = {
  postId: number;
  parentComment: CommentResponseDTO | null;
  onCommentAdded: () => void;
};

const CommentForm: React.FC<CommentFormProps> = ({ postId, parentComment, onCommentAdded }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const parentCommentId = parentComment?.id ?? null;
    console.log("content: ", content, "postId: ", postId, "ParentId: ", parentCommentId);
    try {
      await createComment({ content, postId, parentCommentId});
      setContent("");
      onCommentAdded();
    } catch (error) {
      console.log(error);
      toast.error("Cant send comment !")
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
