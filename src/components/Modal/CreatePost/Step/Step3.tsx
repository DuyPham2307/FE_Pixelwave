import "@/styles/components/_createPostStepModal.scss";
import { useState, useCallback } from "react";
import UserCardPost from "@/components/UserCard/UserCardPost";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Smile } from "lucide-react";

interface Step3Props {
	caption: string;
	setCaption: (value: string) => void;
	privacy: string;
	setPrivacy: (value: string) => void;
	taggedUserIds: number[];
	setTaggedUserIds: (value: number[]) => void;
	onPrev: () => void;
	onPost: () => void;
}

const Step3 = ({
	caption,
	setCaption,
	privacy,
	setPrivacy,
	taggedUserIds,
	setTaggedUserIds,
	onPrev,
	onPost,
}: Step3Props) => {
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	// Handle emoji picker visibility toggle
	const toggleEmojiPicker = () => {
		setShowEmojiPicker((prev) => !prev);
	};

	// Handle emoji selection from the emoji picker
	const handleEmojiSelect = (emojiData: EmojiClickData) => {
		setCaption((prevCaption) => prevCaption + emojiData.emoji);
	};

	// Handle sharing the post
	const handleShare = useCallback(() => {
		onPost();
	}, [onPost]);

	return (
		<div className="step3">
			<div className="step3-header">
				<button onClick={onPrev}>Back</button>
				<select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
					<option value="friend">Friend</option>
					<option value="private">Private</option>
					<option value="public">Public</option>
				</select>
				<h2>Caption</h2>
			</div>

			<div className="step3-content">
				<UserCardPost />

				<textarea
					placeholder="Type something you want!!!"
					value={caption} // Bind textarea value to caption state
					onChange={(e) => setCaption(e.target.value)} // Update caption as user types
				/>

				<div className="step3-actions">
					{showEmojiPicker && (
							<div className="emoji-picker">
								<EmojiPicker onEmojiClick={handleEmojiSelect} />
							</div>
						)}
					<button
						type="button"
						className="emoji-btn"
						onClick={toggleEmojiPicker}
					>
						<Smile />
					</button>

					<button className="share-btn" onClick={handleShare}>
						Share
					</button>
				</div>
			</div>
		</div>
	);
};

export default Step3;
