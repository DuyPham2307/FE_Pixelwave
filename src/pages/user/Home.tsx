import React, { useCallback, useEffect, useState } from "react";
import "@/styles/pages/_home.scss";
import { PostDetail } from "@/models/PostModel";
import { getFeed } from "@/services/postService";
import PostCard from "@/components/Post/PostCard";
import { useNavigate } from "react-router-dom";
import { UserDTO } from "@/models/UserModel";
import { getListFriends } from "@/services/friendService";
import { useAuth } from "@/hooks/useAuth";

const Home: React.FC = () => {
	const [posts, setPosts] = useState<PostDetail[]>([]);
	const [limit, setLimit] = useState<number>(10);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const navigate = useNavigate();
	const {user} = useAuth();

	const loadPosts = useCallback(async () => {
		if (loading || !hasMore) return;

		setLoading(true);

		try {
			const data: PostDetail[] = await getFeed(limit);
			const newPosts = data;
			// Nếu số bài trả về ít hơn limit => hết bài
			if (newPosts.length < limit) {
				setHasMore(false);
			}

			// So sánh để chỉ thêm bài mới (không trùng)
			setPosts((prevPosts: PostDetail[]) => {
				// Tạo map id bài cũ
				const existingIds = new Set(prevPosts.map((p) => p.id));

				// Lọc những bài mới chưa có trong prevPosts
				const filteredNew = newPosts.filter((p) => !existingIds.has(p.id));

				return [...prevPosts, ...filteredNew];
			});

			// Tăng limit cho lần gọi tiếp theo
			setLimit((prev) => prev + 10);
		} catch (error) {
			console.error("Load posts error", error);
		} finally {
			setLoading(false);
		}
	}, [limit, loading, hasMore]);

	useEffect(() => {
		loadPosts();
	}, []);

	// Scroll event để gọi loadPosts khi gần cuối
	useEffect(() => {
		const onScroll = () => {
			if (
				window.innerHeight + window.scrollY >=
					document.documentElement.scrollHeight - 200 &&
				hasMore &&
				!loading
			) {
				loadPosts();
			}
		};

		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, [loadPosts, hasMore, loading]);

	useEffect(() => {
		const fetchFriend = async () => {
			try {
				if (user) {
					const res = await getListFriends(user.id);
					console.log(res);
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchFriend();
	}, [user]);

	console.log("Posts: ", posts);
	

	return (
		<div className="home">
			{posts ? posts.map((post) => <PostCard key={post.id} post={post} />) : ""}
			{loading && <p>Loading...</p>}
      {!hasMore && (
        <p
          className="last-post"
          onClick={() => navigate("/user/explore")}
        >
          No more posts. Explore now!
        </p>
      )}
		</div>
	);
};

export default Home;
