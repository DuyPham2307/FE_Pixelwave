import React, { useState } from "react";
import { CircleX, Globe, Lock, Share2, Users } from "lucide-react";

import { PostDetail } from "@/models/PostModel";
import CarouselImage from "./CarouselImage";

import "@/styles/components/_postDetail.scss";
import { formatTimestamp } from '@/utils/formatTimestamp';

type PostDetailsProps = {
	post: PostDetail; // Sử dụng model Post
	onClose: () => void; // Hàm để đóng modal
	setLike: () => void;
};

const PostDetails: React.FC<PostDetailsProps> = ({ post, onClose, setLike }) => {

	const [isReacted, setReacted] = useState(post.isLiked);
	const handleReact = () => {
		setLike();
		setReacted(!isReacted);
	}

	
	const getPrivacyIcon = (setting: string) => {
  switch (setting) {
    case 'public':
      return <Globe  />;
    case 'private':
      return <Lock  />;
    case 'friend':
      return <Users />;
    default:
      return null;
  }
}

	return (
		<div className="post-details-modal">
			<div className="modal-content">
				<button className="close-btn" onClick={onClose}>
					<CircleX />
				</button>
				<div className="post-body">
					<div className="post-header">
						<img src={post.postUser.avatar} alt={post.postUser.fullName} className="user-avatar" />
						<div className="user-data">
							<div>
								<div><span className="user-name">{post.postUser.fullName}</span>
								<span>{getPrivacyIcon(post.privacySetting)}</span></div>
							</div>
							<span className="timestamp">{formatTimestamp(post.createdAt)}</span>
						</div>
					</div>
					<p className="post-description">{post.caption}</p>
					<CarouselImage img_urls={post.images} />
					<div className="post-actions">
						<button
							className="like-btn"
							onClick={handleReact}
						>
							{isReacted ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24px"
									height="22px"
									viewBox="0 0 36 40"
								>
									<path
										fill="#ff0000"
										d="M35.885 11.833c0-5.45-4.418-9.868-9.867-9.868c-3.308 0-6.227 1.633-8.018 4.129c-1.791-2.496-4.71-4.129-8.017-4.129c-5.45 0-9.868 4.417-9.868 9.868c0 .772.098 1.52.266 2.241C1.751 22.587 11.216 31.568 18 34.034c6.783-2.466 16.249-11.447 17.617-19.959c.17-.721.268-1.469.268-2.242"
										stroke-width="4"
										stroke="#ff0000"
									/>
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24px"
									height="22px"
									viewBox="0 0 36 40"
								>
									<path
										fill="#fff"
										d="M35.885 11.833c0-5.45-4.418-9.868-9.867-9.868c-3.308 0-6.227 1.633-8.018 4.129c-1.791-2.496-4.71-4.129-8.017-4.129c-5.45 0-9.868 4.417-9.868 9.868c0 .772.098 1.52.266 2.241C1.751 22.587 11.216 31.568 18 34.034c6.783-2.466 16.249-11.447 17.617-19.959c.17-.721.268-1.469.268-2.242"
										stroke-width="4"
										stroke="#000"
									/>
								</svg>
							)}
							<span>{post.likeCount}</span>
						</button>
						<button className="share-btn">
						<Share2 />
						</button>
					</div>
				</div>
				<div className="post-comments">
					<h3>Comments</h3>
					{/* {comments.map((comment: CommentModel) => (
						<div key={comment.id} className="comment">
							<span className="comment-user">{comment.user}:</span>
							<span className="comment-text">{comment.text}</span>
						</div>
					))} */}
				</div>
			</div>
		</div>
	);
};

export default PostDetails;
