import React, { useState } from "react";
import "@/styles/components/_post.scss"; // Import your CSS file
import {
	MessageCircle,
	Ellipsis,
	Globe,
	Users,
	Lock,
	Heart,
	Bookmark,
} from "lucide-react";
import { PostDetail } from "@/models/PostModel";
import CarouselImage from "./CarouselImage";
import { formatTimestamp } from "@/utils/formatTimestamp";
import PostDetails from "./PostDetails";
import { Link } from "react-router-dom";
import { likePost, unlikePost } from "@/services/postService";
import toast from "react-hot-toast";
import ListCollection from "../Modal/ListCollection/ListCollectionModal";

type PostProps = {
	post: PostDetail; // Sử dụng model Post
	// showDetails: (post: PostResponse) => void;
};

const PostCard: React.FC<PostProps> = (props) => {
	const post = props.post;
	const [showDetail, setShowDetail] = useState(false);
	const [showModalCollection, setShowModalCollection] = useState(false);
	const [isLiked, setIsLiked] = useState<boolean>(post.liked);
	const [likeCount, setLikeCount] = useState<number>(post.likeCount);

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

	const handleReact = async (): Promise<void> => {
		try {
			if (isLiked) {
				await unlikePost(post.id);
				setIsLiked(false);
				setLikeCount((prev) => Math.max(0, prev - 1));
				toast.success("Unlike post successfully!");
			} else {
				await likePost(post.id);
				setIsLiked(true);
				setLikeCount((prev) => prev + 1);

				toast.success("Like post successfully!");
			}
		} catch (error) {
			console.error("Error handling reaction:", error);
			toast.error("An error occurred");
		}
	};

	return (
		<div className="post">
			{showModalCollection && (
				<ListCollection
					onClose={() => setShowModalCollection(false)}
					postId={post.id}
				/>
			)}
			{showDetail ? (
				<PostDetails
					post={post}
					onClose={() => setShowDetail(false)}
					// onLikeChanged={handleReact}
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
						<button className="like-btn" onClick={handleReact}>
							{isLiked ? <Heart fill="red" color="red" /> : <Heart />}
							<span>{likeCount}</span>
						</button>
						<button className="comment-btn" onClick={() => setShowDetail(true)}>
							<MessageCircle />
							<span>{post.commentCount}</span>
						</button>
						<button
							className="save-btn"
							onClick={() => setShowModalCollection(true)}
						>
							<Bookmark />
						</button>
					</div>
					{/* <button className="see-more" onClick={() => setShowDetail(true)}>
						See more <ChevronDown />
					</button> */}
				</>
			)}
		</div>
	);
};

export default React.memo(PostCard);
