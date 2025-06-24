import React, { useEffect, useState } from "react";
import "@/styles/pages/_userReport.scss";
import "@/styles/components/_reportModal.scss";
import {
	deleteReportedPost,
	fetchReports,
	updateReportStatus,
} from "@/services/reportService";
import { Report } from "@/models/ReportModel";
import Spinner from "@/components/Spinner/Spinner";
import { Link } from "react-router-dom";

const UserReport = () => {
	const [reports, setReports] = useState<Report[]>([]);
	const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const size = 20;
	const [totalPages, setTotalPages] = useState(0);
	const [first, setFirst] = useState(true);
	const [last, setLast] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [reportToHandle, setReportToHandle] = useState<Report | null>(null);

	const handleOpenModal = (report: Report) => {
		setReportToHandle(report);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setReportToHandle(null);
		setShowModal(false);
	};

	useEffect(() => {
		const loadReports = async (): Promise<void> => {
			setLoading(true);
			try {
				const data = await fetchReports({
					status: "PENDING",
					page,
					size,
				});

				setReports(data.content);
				setTotalPages(data.totalPages);
				setFirst(data.first);
				setLast(data.last);
			} catch (error) {
				console.error("Lỗi khi lấy báo cáo:", error);
			} finally {
				setLoading(false);
			}
		};

		loadReports();
	}, []);

	// const filteredReports = reports.filter((report) =>
	// 	report.reporterI.fullName.toLowerCase().includes(searchTerm.toLowerCase())
	// );

	const selectedReport = reports.find((r) => r.id === selectedReportId) || null;

	return (
		<div className="user-report">
			{loading ? (
				<Spinner />
			) : (
				<div className="user-list">
					{/* Thanh tìm kiếm */}
					<input
						type="text"
						placeholder="Tìm kiếm người dùng..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="search-input"
					/>

					{reports.map((report) => (
						<div
							key={report.id}
							className={`user-item ${
								selectedReportId === report.id ? "selected" : ""
							}`}
							onClick={() => setSelectedReportId(report.id)}
						>
							{/* <img src={report.reporter.avatar} alt="Avatar" />
							<div className="user-info">
								<p className="user-name">{report.reporter.fullName}</p>
								<p className={`report-status ${report.status.toLowerCase()}`}>
									{report.status === "PENDING" ? "Chưa xử lý" : "Đã xử lý"}
								</p>
							</div> */}
							<div className="user-info">
								<p className={`report-status ${report.status.toLowerCase()}`}>
									Report by user {""}
									<Link to={`/admin/user/${report.reporterId}`}>
										<u>#{report.reporterId}</u>
									</Link>
								</p>
							</div>

							<button
								className="btn-resolve"
								onClick={(e) => {
									e.stopPropagation();
									handleOpenModal(report);
								}}
							>
								{report.status}
							</button>

						</div>
					))}

					{reports.length === 0 && <p>Không tìm thấy người dùng phù hợp.</p>}

					<div className="pagination">
						<button
							disabled={first}
							onClick={() => setPage((prev) => prev - 1)}
						>
							Trước
						</button>{" "}
						<span>
							{page + 1} / {totalPages}
						</span>{" "}
						<button disabled={last} onClick={() => setPage((prev) => prev + 1)}>
							Tiếp
						</button>
					</div>
				</div>
			)}
			{showModal && reportToHandle && (
				<div className="report-modal" onClick={handleCloseModal}>
					<div className="modal-content">
						<h3>Xử lý báo cáo bài viết #{reportToHandle.postId}</h3>
						<p>Bạn muốn thực hiện hành động gì?</p>
						<div className="modal-actions">
							<button
								className="btn-danger"
								onClick={async () => {
									await deleteReportedPost(reportToHandle.postId);
									await updateReportStatus(reportToHandle.id, "RESOLVED");
									setReports((prev) =>
										prev.map((r) =>
											r.id === reportToHandle.id
												? { ...r, status: "RESOLVED" }
												: r
										)
									);
									handleCloseModal();
								}}
							>
								Xoá bài viết
							</button>

							<button
								className="btn-secondary"
								onClick={async () => {
									await updateReportStatus(reportToHandle.id, "REJECTED");
									setReports((prev) =>
										prev.map((r) =>
											r.id === reportToHandle.id
												? { ...r, status: "REJECTED" }
												: r
										)
									);
									handleCloseModal();
								}}
							>
								Bỏ qua
							</button>
						</div>
					</div>
				</div>
			)}

			<div className="user-detail">
				{selectedReport ? (
					<>
						<h2>
							Chi tiết báo cáo bài viết{" "}
							<Link to={`/user/p/${selectedReport.postId}`}>
								#{selectedReport.postId}
							</Link>
						</h2>
						<div className="report-card">
							<div className="report-header">
								{/* <img src={selectedReport.reporter.avatar} alt="Avatar" />
								<p>{selectedReport.reporter.fullName}</p> */}
								<span>
									{new Date(selectedReport.createdAt).toLocaleString()}
								</span>
							</div>
							<p className="report-content">
								<strong>Lý do:</strong> {selectedReport.reason}
							</p>
							<p className="report-content">
								<strong>Mô tả:</strong> {selectedReport.description}
							</p>
						</div>
					</>
				) : (
					<p>Chọn một báo cáo để xem chi tiết</p>
				)}
			</div>
		</div>
	);
};

export default UserReport;
