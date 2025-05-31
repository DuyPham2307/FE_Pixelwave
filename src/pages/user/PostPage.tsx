import PostCard from "@/components/Post/PostCard";
import { PostDetail } from "@/models/PostModel";
import { getPostById } from "@/services/postService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import "@/styles/pages/_post.scss";
import NotFoundPage from "../NotFoundPage";

const PostPage = () => {
	const { postId } = useParams(); // ID trên URL
	const postIdConverted = Number(postId);
	const [postData, setPostData] = useState<PostDetail | null>(null);
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		if (!postId || isNaN(Number(postId))) {
			setNotFound(true);
			return;
		}
		const handleShowPost = async (postId: number | null) => {
			if (!postId) return;
			try {
				const data = await getPostById(postId);
				setPostData(data);
			} catch (error) {
				console.error("Showpost error: ", error);
				toast.error("Can't Showpost from post Id");
				setNotFound(true);
				return;
			}
		};
		handleShowPost(postIdConverted);
	}, [postIdConverted]);

	if (notFound) return <NotFoundPage />;

	return (
		<div className="post-page">{postData && <PostCard post={postData} />}</div>
	);
};

export default PostPage;
