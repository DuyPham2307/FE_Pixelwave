import "@/styles/pages/_explore.scss";
import PostDetails from "@/components/Post/PostDetails";
import { PostDetail, PostRequestPage, PostSimple } from "@/models/PostModel";
import {
	getPostFromId,
	getPostFromUserId,
	toggleLikePost,
} from "@/services/postService";
import { Heart, MessageCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Explore: React.FC = () => {
	const [fetchPosts, setFetchPosts] = useState<PostSimple[]>([]);
	const [detailPost, setDetailPost] = useState<PostDetail | null>(null);
	const [isLiked, setIsLiked] = useState<boolean | undefined>(
		detailPost?.isLiked
	);
	const [likeCount, setLikeCount] = useState<number | undefined>(
		detailPost?.likeCount
	);

	useEffect(() => {
		const fetchUserPost = async () => {
			try {
				const payload: PostRequestPage = {
					userId: 3,
					size: 10,
				};
				const response = await getPostFromUserId(payload);
				console.log("GetPost on Card success", response);
				setFetchPosts(response.posts);
			} catch (error) {
				console.error("getPost error: ", error);
				toast.error("Can't fetch post from userId");
			}
		};
		fetchUserPost();
	}, []);

	const handleShowPost = async (postId: number) => {
		try {
			const res = await getPostFromId(postId);
			setDetailPost(res);
		} catch (error) {
			console.error("Showpost error: ", error);
			toast.error("Can't Showpost from post Id");
		}
	};

	const handleReact = async (): Promise<void> => {
		try {
			await toggleLikePost(detailPost.id);
			if (detailPost.isLiked) {
				setIsLiked(false);
				setLikeCount((prev) => Math.max(0, prev - 1));

				toast.success("Unlike post successfully!");
			} else {
				setIsLiked(true);
				setLikeCount((prev) => prev + 1);

				toast.success("Like post successfully!");
			}
		} catch (error) {
			console.error("Error handling reaction:", error);
			toast.error("Có lỗi khi like/unlike");
		}
	};

	return (
		<div className="explore-container">
			{detailPost ? (
				<PostDetails
					post={detailPost}
					onClose={() => setDetailPost(null)}
					onLikeChanged={handleReact}
				/>
			) : (
				""
			)}
			<div className="wall-posts">
				{fetchPosts.map((post) => {
					return (
						<div
							className="item"
							key={post.id}
							onClick={() => handleShowPost(post.id)}
						>
							<img src={post.imageUrl} alt="Post image" />
							<div className="counter">
								<span>
									{post.likeCount} <Heart />
								</span>
								<span>
									{post.commentCount} <MessageCircle />
								</span>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Explore;
