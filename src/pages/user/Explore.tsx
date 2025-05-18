import '@/styles/pages/_explore.scss'
import PostDetails from "@/components/Post/PostDetails";
import { PostDetail, PostRequestPage, PostSimple } from "@/models/PostModel";
import { getPostFromId, getPostFromUserId } from "@/services/postService";
import { Command, Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Explore: React.FC = () => {
	const [fetchPosts, setFetchPosts] = useState<PostSimple[]>([]);
	const [detailPost, setDetailPost] = useState<PostDetail | null>(null);

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

	return (
		<div className="explore-container">
			{detailPost ? (
				<PostDetails
					post={detailPost}
					onClose={() => setDetailPost(null)}
					setLike={() => setDetailPost(null)}
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
									{post.commentCount} <Command />
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
