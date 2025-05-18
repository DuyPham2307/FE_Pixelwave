import React, { useEffect } from "react";

import "@/styles/pages/_home.scss";
import { PostDetail } from "@/models/PostModel";
import { getFeed } from "@/services/postService";
import PostCard from "@/components/Post/PostCard";

const Home: React.FC = () => {
	const [posts, setPosts] = React.useState<Array<PostDetail> | undefined>();
	// const [postShow, setPosShow] = React.useState<string | null>(null);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const res = await getFeed();
				setPosts(res); // Nếu là 1 post thì gói lại thành mảng
				console.log("Loaded post:", res);
			} catch (error) {
				console.error("Error loading post:", error);
			}
		};

		fetchPost();
	}, []);

	// const viewPostDetails = (post: PostModel) => {
	// 	setPosShow(post);
	// };
	// const closePostDetails = () => {
	// 	setPosShow(null);
	// };

	return (
		<div className="home">
			{posts ? posts.map(post => (
				<PostCard
					key={post.id}
					post={post}
				/>
			)) : (
				""
			)}
		</div>
	);
};

export default Home;
