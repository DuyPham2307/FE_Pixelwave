import { useState } from "react";
import { PostDetail, PostSimple } from "@/models/PostModel";
import { UserResponse } from "@/models/AuthModel";
import "@/styles/pages/_postReport.scss";

const fakePosts: PostSimple[] = Array.from({ length: 12 }, (_, i) => ({
	id: i + 1,
	imageUrl: `https://picsum.photos/seed/${i + 1}/300/200`,
	likeCount: Math.floor(Math.random() * 100),
	commentCount: Math.floor(Math.random() * 50),
}));

interface ReportDetail {
	reporterId: number;
	reportedId: number;
	createAt: string;
	content: string;
	reporter: UserResponse;
}

type HandleType = "warning" | "error" | "normal";

const fakePostDetail = (id: number): PostDetail => ({
	id,
	caption: `This is a caption for post ${id}`,
	createdAt: new Date().toISOString(),
	privacySetting: "public",
	postUser: {
		id: 1,
		fullName: "John Doe",
		avatar: "https://i.pravatar.cc/150?img=1",
		role: "USER",
	},
	likeCount: 123,
	commentCount: 45,
	isTaggedUser: false,
	liked: true,
	tagUserCount: 3,
	images: [
		{ id: 3, url: `https://picsum.photos/seed/detail${id}a/300/200` },
		{ id: 4, url: `https://picsum.photos/seed/detail${id}b/300/200` },
	],
});

export const fakeReports = (postId: number): ReportDetail[] => [
	{
		reporterId: 1,
		reportedId: postId,
		createAt: new Date().toISOString(),
		content: "Bài viết có nội dung không phù hợp.",
		reporter: {
			id: 1,
			fullName: "Nguyễn Văn A",
			avatar: "https://randomuser.me/api/portraits/men/1.jpg",
			role: "USER",
		},
	},
	{
		reporterId: 2,
		reportedId: postId,
		createAt: new Date(Date.now() - 86400000).toISOString(),
		content: "Hình ảnh phản cảm.",
		reporter: {
			id: 2,
			fullName: "Trần Thị B",
			avatar: "https://randomuser.me/api/portraits/women/2.jpg",
			role: "USER",
		},
	},
	{
		reporterId: 3,
		reportedId: postId,
		createAt: new Date(Date.now() - 2 * 86400000).toISOString(),
		content: "Spam quảng cáo.",
		reporter: {
			id: 3,
			fullName: "Lê Văn C",
			avatar: "https://randomuser.me/api/portraits/men/3.jpg",
			role: "USER",
		},
	},
];

const PostReport = () => {
	const [selectedPostId, setSelectedPostId] = useState<number | null>(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [handleType, setHandleType] = useState<HandleType>("warning");
	const [handleNote, setHandleNote] = useState("");
	const [status, setStatus] = useState<"pending" | "done" | "cancel">(
		"pending"
	);

	const selectedPostDetail =
		selectedPostId !== null ? fakePostDetail(selectedPostId) : null;
	const reports = selectedPostId !== null ? fakeReports(selectedPostId) : [];

	const handleSubmit = () => {
		// xử lý logic ở đây nếu cần gửi API

		setStatus("done");
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setStatus("cancel");
		setIsModalOpen(false);
	};
	return (
		<div className="post-report">
			<div className="post-list-wrapper">
				<div className="post-list">
					{fakePosts.map((post) => (
						<div
							key={post.id}
							className={`post-item ${
								post.id === selectedPostId ? "selected" : ""
							}`}
							onClick={() => setSelectedPostId(post.id)}
						>
							<img src={post.imageUrl} alt="Post" />
							<div className="post-meta">
								<span>❤️ {post.likeCount}</span>
								<span>💬 {post.commentCount}</span>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="seperated"></div>

			{selectedPostDetail && (
				<div className="post-detail">
					<div className="header">
						<h2>Chi tiết bài viết bị báo cáo</h2>
						<span className={`status ${status}`}>{status}</span>
						{status === "pending" && (
							<button
								className="handle-btn"
								onClick={() => setIsModalOpen(true)}
							>
								Solve
							</button>
						)}
					</div>

					<div className="detail-box">
						<p>
							<strong>Caption:</strong> {selectedPostDetail.caption}
						</p>
						<div className="detail-images">
							{selectedPostDetail.images.map((img) => (
								<img key={img.id} src={img.url} alt="Detail" />
							))}
						</div>
						<p>
							<strong>Đăng bởi:</strong> {selectedPostDetail.postUser.fullName}
						</p>
					</div>

					<h3>Danh sách báo cáo</h3>
					{reports.map((report, index) => (
						<div key={index} className="report-item">
							<div className="report-header">
								<img src={report.reporter.avatar} alt="Avatar" />
								<p>{report.reporter.fullName}</p>
								<span>{new Date(report.createAt).toLocaleString()}</span>
							</div>
							<p className="report-content">{report.content}</p>
						</div>
					))}
				</div>
			)}

			{isModalOpen && (
				<div className="modal-overlay">
					<div className="modal">
						<h3>Xử lý bài viết</h3>

						<label>Chọn loại xử lý:</label>
						<select
							value={handleType}
							onChange={(e) => setHandleType(e.target.value as HandleType)}
						>
							<option value="warning">Warning</option>
							<option value="error">Error</option>
							<option value="normal">Normal</option>
						</select>

						<label>Ghi chú xử lý:</label>
						<textarea
							value={handleNote}
							onChange={(e) => setHandleNote(e.target.value)}
							placeholder="Nhập ghi chú..."
						/>

						<div className="modal-actions">
							<button className="submit" onClick={handleSubmit}>
								Hoàn tất
							</button>
							<button className="cancel" onClick={handleCancel}>
								Huỷ bỏ
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PostReport;
