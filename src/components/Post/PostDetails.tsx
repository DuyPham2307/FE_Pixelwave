import React, { useEffect, useState } from "react";
import { Bookmark, Globe, Heart, Lock, Users, X } from "lucide-react";
import { PostDetail } from "@/models/PostModel";
import CarouselImage from "./CarouselImage";
import { getCommentsByPostId } from "@/services/commentService";

import "@/styles/components/_postDetail.scss";
import { formatRelativeTime, formatTimestamp } from "@/utils/formatTimestamp";
import CommentList from "./../Comment/CommentList";
import CommentForm from "./../Comment/CommentForm";
import { CommentResponseDTO } from "@/models/CommentModel";
import ListCollection from "../Modal/ListCollection/ListCollectionModal";
import { likePost, unlikePost } from "@/services/postService";
import toast from "react-hot-toast";

type PostDetailsProps = {
	post: PostDetail;
	onClose: () => void;
	// onLikeChanged: () => void;
};

const PostDetails: React.FC<PostDetailsProps> = ({
	post,
	onClose,
	// onLikeChanged,
}) => {
	const [isLiked, setIsLiked] = useState<boolean>(post.liked);
	const [likeCount, setLikeCount] = useState<number>(post.likeCount);
	const [comments, setComments] = useState<CommentResponseDTO[]>([]);
	const [showModalCollection, setShowModalCollection] = useState(false);
	const [commentWantReply, setCommentWantReply] = useState<CommentResponseDTO | null>(null)

	const fetchComments = async () => {
		try {
			const data = await getCommentsByPostId(post.id);
			setComments(data);
		} catch (error) {
			console.error("Failed to load comments", error);
		}
	};

	useEffect(() => {
		fetchComments();
	}, []);

	// const handleLikeClick = () => {
	// 	const newLiked = !isLiked;
	// 	setIsLiked(newLiked);
	// 	onLikeChanged();
	// 	setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
	// };

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

	return (
		<div className="post-details-modal">
			{showModalCollection && (
				<ListCollection
					onClose={() => setShowModalCollection(false)}
					postId={post.id}
				/>
			)}
			<div className="modal-content">
				<div className="post-body">
					<button className="close-btn" onClick={onClose}>
						<X />
					</button>
					<CarouselImage img_urls={post.images} />
					<div className="post-detail">
						<div className="post-header">
							<img
								src={post.postUser.avatar}
								alt={post.postUser.fullName}
								className="user-avatar"
							/>
							<div className="user-data">
								<div>
									<div>
										<span className="user-name">{post.postUser.fullName}</span>
										<span>{getPrivacyIcon(post.privacySetting)}</span>
									</div>
								</div>
								<span className="timestamp">
									{formatRelativeTime(post.createdAt)}
								</span>
							</div>
						</div>
						<p className="post-description">{post.caption}</p>

						<div className="post-comments">
							<h3>Comments</h3>
							<CommentList
								comments={comments}
								onCommentUpdated={fetchComments}
								setParentComment={setCommentWantReply}
								postId={post.id}
							/>
						</div>

						<div className="post-actions">
							<button className="like-btn" onClick={handleReact}>
								{isLiked ? <Heart fill="red" color="red" /> : <Heart />}
								<span>{likeCount}</span>
							</button>
							<button
								className="save-btn"
								onClick={() => setShowModalCollection(true)}
							>
								<Bookmark />
							</button>
						</div>
						<div className="post-send-comment">
							<CommentForm postId={post.id} onCommentAdded={fetchComments} parentComment={commentWantReply} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostDetails;
