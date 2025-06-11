import React, { useEffect, useState } from "react";
import {
	Bookmark,
	Ellipsis,
	Globe,
	Heart,
	Lock,
	Trash2,
	TriangleAlert,
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
import {
	deletePostById,
	getTaggedUserOfPost,
	likePost,
	unlikePost,
} from "@/services/postService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Spinner from "../Spinner/Spinner";
import { ReportModal } from "../Modal/ReportModal/ReportModal";
import { UserDTO } from "@/models/UserModel";

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
	const [showTagged, setShowTagged] = useState(false);
	const [taggedUsers, setTaggedUsers] = useState<UserDTO[]>([]);
	const [showModalCollection, setShowModalCollection] = useState(false);
	const [showModalReport, setShowModalReport] = useState(false);
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
		if (post.tagUserCount > 0) {
			getTaggedUserOfPost(post.id)
				.then(setTaggedUsers)
				.catch((err) => toast.error("Failed to fetch tagged users", err));
		}
	}, []);

	console.log(post);

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

	const navigateToPage = (userId: number) => {
		navigate(`/user/${userId}`);
		setShowTagged(false);
		onClose();
	}

	return (
		<div className="post-details-modal">
			{showModalCollection && (
				<ListCollection
					onClose={() => setShowModalCollection(false)}
					postId={post.id}
				/>
			)}
			<ReportModal
				postId={post.id}
				open={showModalReport}
				onClose={() => setShowModalReport(false)}
			/>
			{loading ? (
				<Spinner />
			) : (
				<div className="modal-content">
					{showTagged && (
						<div className="list">
							{taggedUsers.map((user) => (
								<div key={user.id} className="item" onClick={() => navigateToPage(user.id)}>
									<img src={user.avatar} alt="" />
									{user.fullName}
								</div>
							))}
						</div>
					)}
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
											<div className="user-tagged">
												{post.taggedUser &&
													(post.tagUserCount > 1 ? (
														<>
															<button
																onClick={() => setShowTagged((prev) => !prev)}
															>
																Đã nhắc đến bạn và {post.tagUserCount - 1} người
																khác
															</button>
														</>
													) : (
														<button>Đã nhắc đến bạn</button>
													))}
											</div>
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
								<button className="like-btn">
									<span onClick={handleReact} className="icon-click-only">
										{isLiked ? <Heart fill="red" color="red" /> : <Heart />}
									</span>
									<span>{likeCount}</span>
								</button>
								<button
									className="save-btn"
									onClick={() => setShowModalCollection(true)}
								>
									<Bookmark />
								</button>
								<button
									className="report-btn"
									onClick={() => setShowModalReport(true)}
								>
									<TriangleAlert />
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
