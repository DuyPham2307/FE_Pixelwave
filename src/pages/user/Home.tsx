import React, { useCallback, useEffect, useRef, useState } from "react";
import "@/styles/pages/_home.scss";
import { PostDetail } from "@/models/PostModel";
import { getFeed } from "@/services/postService";
import PostCard from "@/components/Post/PostCard";
import { useNavigate } from "react-router-dom";
// import { UserDTO } from "@/models/UserModel";
import { getListFriends } from "@/services/friendService";
import { useAuth } from "@/hooks/useAuth";

const Home: React.FC = () => {
	const [posts, setPosts] = useState<PostDetail[]>([]);
	const [limit, setLimit] = useState<number>(10);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const homeRef = useRef<HTMLDivElement | null>(null);
	const navigate = useNavigate();
	const { user } = useAuth();

	const loadPosts = useCallback(async () => {
		if (loading || !hasMore) return;

		setLoading(true);

		try {
			const prevDataLength = posts.length;
			const data: PostDetail[] = await getFeed(limit);

			// Nếu API trả về 0 post => đã hết
			if (data.length === prevDataLength) {
				setHasMore(false);
				return;
			}

			setPosts((prev) => {
				const existingIds = new Set(prev.map((p) => p.id));
				const filtered = data.filter((p) => !existingIds.has(p.id));
				return [...prev, ...filtered];
			});

			// Tăng limit (hoặc offset nếu cần phân trang)
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
		const container = homeRef.current;
		if (!container) return;

		const onScroll = () => {
			if (
				container.scrollTop + container.clientHeight >=
					container.scrollHeight - 200 &&
				hasMore &&
				!loading
			) {
				loadPosts();
			}
		};

		container.addEventListener("scroll", onScroll);
		return () => container.removeEventListener("scroll", onScroll);
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
		<div className="home" ref={homeRef}>
			{posts ? posts.map((post) => <PostCard key={post.id} post={post} />) : ""}
			{loading && <p>Loading...</p>}
			{!hasMore && (
				<p className="last-post" onClick={() => navigate("/user/explore")}>
					No more posts. Explore now!
				</p>
			)}
		</div>
	);
};

export default Home;
