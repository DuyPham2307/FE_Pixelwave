import React, { useState } from "react";
import { createComment } from "@/services/commentService";
import "@/styles/components/_commentForm.scss";
import { Paperclip, SendHorizontal, Smile, X } from "lucide-react";
import toast from "react-hot-toast";
import { CommentResponseDTO } from "@/models/CommentModel";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

type CommentFormProps = {
	postId: number;
	parentComment: CommentResponseDTO | null;
	onCommentAdded: () => void;
};

const CommentForm: React.FC<CommentFormProps> = ({
	postId,
	parentComment,
	onCommentAdded,
}) => {
	const [content, setContent] = useState("");
	const [images, setImages] = useState<File[]>([]);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	const handleEmojiClick = (emojiData: EmojiClickData) => {
		setContent((prev) => prev + emojiData.emoji);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);
			setImages((prev) => [...prev, ...selectedFiles]);
		}
	};

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim() && images.length === 0) {
			toast.error("Comment cannot be empty.");
			return;
		}

		const parentCommentId = parentComment?.id ?? null;

		try {
			await createComment({ content, postId, parentCommentId, images });
			setContent("");
			setImages([]);
			onCommentAdded();
		} catch (error) {
			console.error(error);
			toast.error("Can't send comment!");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="comment-form">
			{/* Preview Selected Images */}
			{images.length > 0 && (
				<div className="image-preview-container">
					{images.map((file, index) => (
						<div key={index} className="image-preview">
							<img src={URL.createObjectURL(file)} alt={`preview-${index}`} />
							<button
								type="button"
								className="remove-btn"
								onClick={() => removeImage(index)}
							>
								<X size={16} />
							</button>
						</div>
					))}
				</div>
			)}

			<div className="left-section">
				<label htmlFor="file-upload" className="upload-icon">
					<Paperclip />
				</label>
				<input
					type="file"
					id="file-upload"
					style={{ display: "none" }}
					multiple
					onChange={handleImageChange}
					accept="image/*"
				/>

				<button
					type="button"
					onClick={() => setShowEmojiPicker(!showEmojiPicker)}
				>
					<Smile />
				</button>
				{showEmojiPicker && (
					<div className="emoji-picker">
						<EmojiPicker onEmojiClick={handleEmojiClick} />
					</div>
				)}

				<textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="Write a comment..."
				/>

				<button type="submit">
					<SendHorizontal />
				</button>
			</div>
		</form>
	);
};

export default CommentForm;
