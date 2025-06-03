import React, { useEffect, useState } from "react";
import "@/styles/components/_post.scss"; // Import your CSS file
import {
	MessageCircle,
	Ellipsis,
	Globe,
	Users,
	Lock,
	Heart,
	Bookmark,
	EyeClosed,
} from "lucide-react";
import { PostDetail } from "@/models/PostModel";
import CarouselImage from "./CarouselImage";
import { formatTimestamp } from "@/utils/formatTimestamp";
import PostDetails from "./PostDetails";
import { Link } from "react-router-dom";
import { likePost, unlikePost } from "@/services/postService";
import toast from "react-hot-toast";
import ListCollection from "../Modal/ListCollection/ListCollectionModal";
import { useAuth } from "@/hooks/useAuth";

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
	const [isHide, setIsHide] = useState(false);
	const { user } = useAuth();
	const userId = user?.id;

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

	const handleOpenDetail = () => {
		setShowDetail(true);
		window.history.pushState({}, "", `/user/p/${post.id}`);
	};

	const handleCloseDetail = () => {
		setShowDetail(false);
		window.history.pushState({}, "", `/user`); // hoặc URL gốc của bạn
	};

	useEffect(() => {
		const handlePopState = () => {
			setShowDetail(false); // Tắt modal nếu back
		};

		window.addEventListener("popstate", handlePopState);
		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, []);

	return (
		!isHide && (
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
						onClose={handleCloseDetail}

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
									<p>
										{!post.taggedUser &&
											(post.tagUserCount > -1 ? (
												<>
													Đã nhắc đến <Link to={`/user/${userId}`}>bạn</Link> và{" "}
													{post.tagUserCount + 1} người khác
												</>
											) : (
												<>
													Đã nhắc đến <Link to={`/user/${userId}`}>bạn</Link>
												</>
											))}
									</p>
								</div>
								<span className="timestamp">
									{formatTimestamp(post.createdAt)}
								</span>
							</div>
							<div className="others">
								<button className="more-btn" onClick={() => setIsHide(true)}>
									<Ellipsis />
									<div className="hide-label">
										<EyeClosed /> <span>Ẩn bài viết</span>
									</div>
								</button>
							</div>
						</div>

						<p className="post-description">{post.caption}</p>
						<div className="carousel-wrapper">
							<CarouselImage img_urls={post.images} />
						</div>

						<div className="post-actions">
							<button className="like-btn" onClick={handleReact}>
								{isLiked ? <Heart fill="red" color="red" /> : <Heart />}
								<span>{likeCount}</span>
							</button>
							<button className="comment-btn" onClick={handleOpenDetail}>
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
		)
	);
};

export default React.memo(PostCard);
