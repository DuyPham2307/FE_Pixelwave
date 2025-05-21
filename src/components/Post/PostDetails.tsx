import React, { useEffect, useState } from "react";
import { Bookmark, Globe, Heart, Lock, Users, X } from "lucide-react";
import { PostDetail } from "@/models/PostModel";
import CarouselImage from "./CarouselImage";
import { getCommentsByPostId } from "@/services/commentService";

import "@/styles/components/_postDetail.scss";
import { formatTimestamp } from "@/utils/formatTimestamp";
import CommentList from "./../Comment/CommentList";
import CommentForm from "./../Comment/CommentForm";
import { CommentResponseDTO } from "@/models/CommentModel";
import ListCollection from "../Modal/ListCollection/ListCollectionModal";

type PostDetailsProps = {
	post: PostDetail;
	onClose: () => void;
	onLikeChanged: () => void;
};

const PostDetails: React.FC<PostDetailsProps> = ({
	post,
	onClose,
	onLikeChanged,
}) => {
	const [isLiked, setIsLiked] = useState<boolean>(post.isLiked);
	const [likeCount, setLikeCount] = useState<number>(post.likeCount);
	const [comments, setComments] = useState<CommentResponseDTO[]>([]);
	const [showModalCollection, setShowModalCollection] = useState(false);

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
	}, [post.id]);

	const handleLikeClick = () => {
		const newLiked = !isLiked;
		setIsLiked(newLiked);
		onLikeChanged();
		setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
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
									{formatTimestamp(post.createdAt)}
								</span>
							</div>
						</div>
						<p className="post-description">{post.caption}</p>

						<div className="post-comments">
							<h3>Comments</h3>
							<CommentList
								comments={comments}
								onCommentUpdated={fetchComments}
							/>
						</div>

						<div className="post-actions">
							<button className="like-btn" onClick={handleLikeClick}>
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
							<CommentForm postId={post.id} onCommentAdded={fetchComments} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostDetails;
