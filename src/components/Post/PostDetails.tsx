import React, { useEffect, useState } from "react";
import {
	Bookmark,
	Ellipsis,
	Globe,
	Heart,
	Lock,
	Trash2,
	Users,
	X,
} from "lucide-react";
import { PostDetail } from "@/models/PostModel";
import CarouselImage from "./CarouselImage";
import { getCommentsByPostId } from "@/services/commentService";

import "@/styles/components/_postDetail.scss";
import { formatRelativeTime } from "@/utils/formatTimestamp";
import CommentList from "./../Comment/CommentList";
import CommentForm from "./../Comment/CommentForm";
import { CommentResponseDTO } from "@/models/CommentModel";
import ListCollection from "../Modal/ListCollection/ListCollectionModal";
import { deletePostById, likePost, unlikePost } from "@/services/postService";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Spinner from "../Spinner/Spinner";

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
	const [commentWantReply, setCommentWantReply] =
		useState<CommentResponseDTO | null>(null);
	const navigate = useNavigate();
	const { user } = useAuth();
	const userId = user?.id;
	const [loading, setLoading] = useState(false);

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

	console.log(post);

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

	const deletePost = async (postId: number) => {
		setLoading(true);
		try {
			await deletePostById(postId);
			toast.success("Delete post successfully!");
			navigate(`/user/${userId}`);
			setTimeout(() => {
				window.location.reload(); // Reload trang sau khi navigate
			}, 100);
		} catch (error) {
			console.log(error);
			toast.error("Không thể xóa bài");
		} finally {
			setLoading(false);
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
			{loading ? (
				<Spinner />
			) : (
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
											<span className="user-name">
												{post.postUser.fullName}
											</span>
											<span>{getPrivacyIcon(post.privacySetting)}</span>
											<p>
												{post.taggedUser &&
													(post.tagUserCount > 1 ? (
														<>
															Đã nhắc đến{" "}
															<Link to={`/user/${userId}`}>bạn</Link> và{" "}
															{post.tagUserCount - 1} người khác
														</>
													) : (
														<>
															Đã nhắc đến{" "}
															<Link to={`/user/${userId}`}>bạn</Link>
														</>
													))}
											</p>
											{post.postUser.id === userId && (
												<div className="delete-post">
													<Ellipsis />
													<button
														className="delete-post-btn"
														onClick={() => deletePost(post.id)}
													>
														<Trash2 />
													</button>
												</div>
											)}
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
								<CommentForm
									postId={post.id}
									onCommentAdded={fetchComments}
									parentComment={commentWantReply}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PostDetails;
