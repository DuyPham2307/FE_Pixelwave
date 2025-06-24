import { useEffect, useState } from "react";
import "@/styles/pages/_postReport.scss";
import { PostReportDetail } from "@/models/ReportModel";
import {
	deleteReportedPost,
	getPostReportList,
	updateReportStatus,
} from "@/services/reportService";
import { Captions, CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const PostReport = () => {
	const [postReport, setPostReport] = useState<PostReportDetail[]>([]);
	const [selectedPost, setSelectedPost] = useState<PostReportDetail | null>(
		null
	);
	const [selectedReport, setSelectedReport] = useState<number | null>(null);
	// const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const fetchPostReports = async () => {
			try {
				const response = await getPostReportList();
				console.log("Fetched post reports:", response.content);
				setPostReport(response.content);
			} catch (error) {
				console.error("Failed to fetch post reports:", error);
			}
		};

		fetchPostReports();
	}, []);

	const handleCloseModal = () => {
		setSelectedReport(null);
	};

	const handleDeletePost = async () => {
		if (!selectedPost || selectedReport === null) return;
		try {
			await deleteReportedPost(selectedPost.postId);
			await updateReportStatus(selectedReport, "RESOLVED");
			setSelectedReport(null);
			handleCloseModal();
			toast.success("Đã xoá bài viết và đánh dấu báo cáo đã xử lý");

			// Xoá bài viết khỏi danh sách đang hiển thị
			setPostReport((prev) =>
				prev.filter((item) => item.postId !== selectedPost.postId)
			);
		} catch (err) {
			console.error("Error deleting post/report:", err);
		}
	};

	const handleRejectReport = async () => {
		if (selectedReport === null) return;
		try {
			await updateReportStatus(selectedReport, "REJECTED");
			setSelectedReport(null);
			handleCloseModal();
			toast.success("Đã bỏ qua báo cáo");

			// Cập nhật lại danh sách báo cáo trong bài viết đang xem
			setSelectedPost((prev) => {
				if (!prev) return null;
				return {
					...prev,
					reports: prev.reports.map((r) =>
						r.reportId === selectedReport ? { ...r, status: "REJECTED" } : r
					),
				};
			});
		} catch (err) {
			console.error("Error rejecting report:", err);
		}
	};

	return (
		<div className="post-report">
			{postReport.length === 0 && (
				<div className="no-report">
					<h2>Không có báo cáo bài viết nào</h2>
					<p>Hãy kiểm tra lại sau.</p>
				</div>
			)}
			<div className="post-list-wrapper">
				<div className="post-list">
					{postReport.map((post) => (
						<div
							key={post.postId}
							className={`post-item ${
								post.postId === selectedPost?.postId ? "selected" : ""
							}`}
							onClick={() => setSelectedPost(post)}
						>
							<div className="post-meta">
								<span>
									<CircleUserRound /> {post.authorUsername}
									<span className="post-report__count">{post.reportCount}</span>
								</span>
								<span>
									<Captions /> {post.caption}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="seperated"></div>

			{selectedPost && (
				<div className="post-detail">
					<div className="header">
						<h2>
							Reported post details{" "}
							<Link to={`/user/p/${selectedPost.postId}`}>
								<u>#{selectedPost.postId}</u>
							</Link>
						</h2>
						<span>{selectedPost.reports.length > 0 && "WAITING RESOLVE"}</span>
					</div>

					<div className="detail-box">
						<p>
							<CircleUserRound /> {selectedPost.authorUsername}
						</p>
						<p>
							<Captions /> {selectedPost.caption}
						</p>
						{/* <div className="detail-images">
							{selectedPost.images.map((img) => (
								<img key={img.id} src={img.url} alt="Detail" />
							))}
						</div> */}
					</div>

					<h3>List of report</h3>
					{selectedPost.reports.map((report, index) => (
						<div key={index} className="report-item">
							<div className="report-header">
								{/* <img src={report.reporter.avatar} alt="Avatar" /> */}
								<p>{report.reporterUsername}</p>
								<span>{new Date(report.reportedAt).toLocaleString()}</span>
							</div>
							<p className="report-content">
								{report.reason} - {report.description}
							</p>
							<button
								onClick={() => {
									setSelectedReport(report.reportId);
								}}
							>
								{report.status}
							</button>
						</div>
					))}
				</div>
			)}

			{selectedPost && selectedReport && (
				<div className="report-modal" onClick={handleCloseModal}>
					<div className="modal-content">
						<h3>Xử lý báo cáo bài viết #{selectedPost.postId}</h3>
						<p>Bạn muốn thực hiện hành động gì?</p>
						<div className="modal-actions">
							<button className="btn-danger" onClick={handleDeletePost}>
								Xoá bài viết
							</button>

							<button className="btn-secondary" onClick={handleRejectReport}>
								Bỏ qua
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PostReport;
