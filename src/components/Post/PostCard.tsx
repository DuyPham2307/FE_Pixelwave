import React, { useState } from "react";
import "@/styles/components/_post.scss"; // Import your CSS file
import {
	MessageCircle,
	Ellipsis,
	Share2,
	ChevronDown,
	Globe,
	Users,
	Lock,
} from "lucide-react";
import { PostDetail } from "@/models/PostModel";
import CarouselImage from "./CarouselImage";
import { formatTimestamp } from "@/utils/formatTimestamp";
import PostDetails from "./PostDetails";
import { Link } from "react-router-dom";

type PostProps = {
	post: PostDetail; // Sử dụng model Post
	// showDetails: (post: PostResponse) => void;
};

const PostCard: React.FC<PostProps> = (props) => {
	const post = props.post;
	const [showDetail, setShowDetail] = useState(false);

	const getPrivacyIcon = (setting: string) => {
		switch (setting) {
			case "public":
				return <Globe />;
			case "private":
				return <Lock />;
			case "friend":
				return <Users />;
			default:
				return null;
		}
	};

	// const getPostToShow = (post: PostResponse) => {
	// 	// Logic to show the post in full screen or modal
	// 	console.log("Show post with ID:", post);
	// 	props.showDetails(post);
	// };

	return (
		<div className="post">
			{showDetail ? (
				<PostDetails
					post={post}
					onClose={() => setShowDetail(false)}
					setLike={() => setShowDetail(false)}
				/>
			) : (
				<>
					<div className="post-header">
						<img
							src={post.postUser.avatar}
							alt={post.postUser.fullName}
							className="user-avatar"
						/>
						<div className="user-data">
							<div>
								<Link to={`/user/${post.postUser.id}`}>
									<span className="user-name">{post.postUser.fullName}</span>
								</Link>
								<span>{getPrivacyIcon(post.privacySetting)}</span>
							</div>
							<span className="timestamp">
								{formatTimestamp(post.createdAt)}
							</span>
						</div>
						<div className="others">
							<button className="more-btn">
								<Ellipsis />
							</button>
						</div>
					</div>

					<p className="post-description">{post.caption}</p>

					<CarouselImage img_urls={post.images} />

					<div className="post-actions">
						<button className="like-btn">
							{post.isLiked ? (
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
						<button className="comment-btn">
							<MessageCircle />
							<span>{post.commentCount}</span>
						</button>
						<button className="share-btn">
							<Share2 />
						</button>
					</div>
					<button className="see-more" onClick={() => setShowDetail(true)}>
						See more <ChevronDown />
					</button>
				</>
			)}
		</div>
	);
};

export default PostCard;
