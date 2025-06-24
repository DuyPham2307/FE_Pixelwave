import { useNavigate, useSearchParams } from "react-router-dom";
import { searchUsers, searchPosts } from "@/services/searchService";
import { useEffect, useState } from "react";
import { UserDTO } from "@/models/UserModel";
import { PostDetail } from "@/models/PostModel";
import "@/styles/pages/_search.scss"; // Import your styles
import toast from "react-hot-toast";
import { Image, User } from "lucide-react";
import { formatRelativeTime, formatTimestamp } from "@/utils/formatTimestamp";

const SearchResultPage = () => {
	const [params, setParams] = useSearchParams();
	const tab = params.get("tab") || "user";
	const query = params.get("query") || "";

	const page = parseInt(params.get("page") || "1");

	const [users, setUsers] = useState<UserDTO[]>([]);
	const [posts, setPosts] = useState<PostDetail[]>([]);
	const [totalPages, setTotalPages] = useState<number>(1);

	useEffect(() => {
		if (!query.trim()) {
			toast.error("Thiếu từ khóa tìm kiếm.");
			return;
		}

		const fetchData = async () => {
			try {
				if (tab === "user") {
					const res = await searchUsers(query);
					console.log(res);
					setUsers(res || []);
					setTotalPages(1);
				} else {
					const res = await searchPosts(query, page);
					setPosts(res?.content || []);
					setTotalPages(res?.totalPages || 1);
					console.log(res);
				}
			} catch (error) {
				console.error("Search error:", error);
			}
		};

		fetchData();
	}, [tab, query, page]);

	const switchTab = (target: "user" | "post") => {
		setParams({ tab: target, query, page: "1" });
	};

	const navigate = useNavigate();

	return (
		<div className="search-page">
			<div className="search-tabs">
				<h2>
					Result for: <i>{query}</i>
				</h2>
				<button
					onClick={() => switchTab("user")}
					className={tab === "user" ? "active" : ""}
				>
					<User />
					Users
				</button>
				<button
					onClick={() => switchTab("post")}
					className={tab === "post" ? "active" : ""}
				>
					<Image />
					Posts
				</button>
			</div>

			<div className="seperated"></div>

			{tab === "user" && (
				<div className="user-results">
					{users.length === 0 ? (
						<p>Không tìm thấy người dùng nào.</p>
					) : (
						<ul>
							{users.map((u) => (
								<li
									key={u.id}
									onClick={() => {
										navigate(`/user/${u.id}`);
									}}
								>
									<img
										src={u.avatar || `https://i.pravatar.cc/150?img=${u.id}`}
										alt="avatar"
									/>
									<span>{u.fullName}</span>
								</li>
							))}
						</ul>
					)}
				</div>
			)}

			{tab === "post" && (
				<div className="post-results">
					{posts.length === 0 ? (
						<p>Không tìm thấy bài viết nào.</p>
					) : (
						<ul>
							{posts.map((p) => (
								<li key={p.id}>
									<div
										className="img-wrapper"
										onClick={() => navigate(`/user/p/${p.id}`)}
									>
										<img src={p.images[0].url} alt="" className="post-img" />
									</div>
									<div className="post-info">
										<div className="post-user">
											<img src={p.postUser.avatar} alt="" />
											<div>
												<span
													onClick={() => navigate(`/user/${p.postUser.id}`)}
												>
													{p.postUser.fullName}
												</span>
												<p>{formatRelativeTime(p.createdAt)}</p>
											</div>
										</div>
										<p>{p.caption}</p>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>
			)}

			{/* PHÂN TRANG BÀI VIẾT */}
			{totalPages > 1 && (
				<div className="pagination">
					{Array.from({ length: totalPages }, (_, i) => (
						<button
							key={i}
							className={i + 1 === page ? "active" : ""}
							onClick={() => setParams({ tab, query, page: `${i + 1}` })}
						>
							{i + 1}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default SearchResultPage;
