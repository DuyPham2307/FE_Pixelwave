import "@/styles/components/_createPostStepModal.scss";
import { useState, useCallback } from "react";
import UserCardPost from "@/components/UserCard/UserCardPost";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Smile, Tag } from "lucide-react";
import UserTagPicker from "@/components/UserTagPicker/UserTagPicker";

interface Step3Props {
	caption: string;
	setCaption: (value: string) => void;
	privacy: string;
	setPrivacy: (value: string) => void;
	taggedUserIds: number[] | null;
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
	const [showTagUserModal, setShowTagUserModal] = useState(false);

	// Handle emoji picker visibility toggle
	const toggleEmojiPicker = () => {
		setShowEmojiPicker((prev) => !prev);
	};

	// Handle emoji selection from the emoji picker
	const handleEmojiSelect = (emojiData: EmojiClickData) => {
		setCaption(caption + emojiData.emoji);
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

				{taggedUserIds ? (taggedUserIds.length !== 0 && <span>Cùng với {taggedUserIds.length} người bạn</span> ) : ""}

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

					{showTagUserModal && (
						<UserTagPicker
							selectedUserIds={taggedUserIds}
							onClose={() => setShowTagUserModal(false)}
							onSave={(ids) => {
								setTaggedUserIds(ids);
								setShowTagUserModal(false);
							}}
						/>
					)}
					<button
						type="button"
						className="tag-btn"
						onClick={() => setShowTagUserModal(true)}
					>
						<Tag />
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
