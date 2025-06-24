import React, { useEffect, useState } from "react";
import "@/styles/pages/_account.scss";
import { ArrowLeftFromLine, CircleSlash, Search } from "lucide-react";
import { ReportDetail, UserViolationSummary } from "@/models/ReportModel";
import {
	banUserViolance,
	fetchReportedUsers,
	fetchUserBanned,
	fetchUserReports,
	unBanUserViolance,
} from "@/services/reportService";
import { formatRelativeTime } from "@/utils/formatTimestamp";
import toast from "react-hot-toast";

const Account: React.FC = () => {
	const [users, setUsers] = useState<UserViolationSummary[]>([]);
	const [tab, setTab] = useState<"user" | "banned">("user");
	const [query, setQuery] = useState<string>("");
	const [selectedUser, setSelectedUser] = useState<UserViolationSummary | null>(
		null
	);
	const [reportDetails, setReportDetails] = useState<ReportDetail[]>([]);
	const [showReportDetails, setShowReportDetails] = useState<boolean>(false);

	useEffect(() => {
		const loadUsers = async () => {
			try {
				if (tab === "banned") {
					const bannedData = await fetchUserBanned();
					const formattedBanned = bannedData.map((user) => ({
						user,
						violationCount: 0,
					}));
					setUsers(formattedBanned);
				} else if (tab === "user") {
					const userData = await fetchReportedUsers();
					setUsers(userData);
				}
				setSelectedUser(null);
				setReportDetails([]);
				setShowReportDetails(false);
			} catch (error) {
				console.error("Error loading users:", error);
				toast.error("Không thể tải danh sách người dùng");
			}
		};

		loadUsers();
	}, [tab]);

	const handleSelectUser = async (user: UserViolationSummary) => {
		setSelectedUser(user);
		const details = await fetchUserReports(user.user.id);
		setReportDetails(details);
	};

	// Danh sách lọc theo từ khóa
	const filteredUsers = users.filter((user) =>
		user.user.fullName.toLowerCase().includes(query.toLowerCase())
	);

	const handleBanUser = async (userId: number) => {
		try {
			await banUserViolance(userId);
			setTab("banned");
			setSelectedUser(null);
			setUsers((prev) =>
				prev.map((u) =>
					u.user.id === userId ? { ...u, user: { ...u.user, banned: true } } : u
				)
			);
			setReportDetails([]);
			toast.success("Cấm người dùng khỏi hệ thống thành công!");
		} catch (error) {
			toast.error("Cấm người dùng thất bại");
			console.log(error);
		}
	};

	const handleUnBanUser = async (userId: number) => {
		try {
			await unBanUserViolance(userId);
			setTab("user");
			setSelectedUser(null);
			toast.success("Mở cấm người dùng khỏi hệ thống thành công!");
		} catch (error) {
			toast.error("Người dùng mở cấm thất bại");
			console.log(error);
		}
	};

	return (
		<div className="account">
			<div className="search-bar">
				<Search size={18} />
				<input
					type="text"
					placeholder="Search by name..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</div>
			<div className="selected-tag">
				<div
					className={tab === "user" ? "active" : ""}
					onClick={() => setTab("user")}
				>
					Account reported
				</div>
				<div
					className={tab === "banned" ? "active" : ""}
					onClick={() => setTab("banned")}
				>
					Account banned
				</div>
			</div>

			<div className="account-container">
				<div className={`user-list ${selectedUser ? "shrinked" : ""}`}>
					{filteredUsers.length === 0 && (
						<div className="no-users">
							<p>Không có người dùng nào phù hợp với tìm kiếm.</p>
						</div>
					)}
					{filteredUsers.map((user) => (
						<div
							key={user.user.id}
							className="user-card"
							onClick={() => handleSelectUser(user)}
						>
							<img src={user.user.avatar} alt={user.user.fullName} />
							<span>{user.user.fullName}</span>
						</div>
					))}
				</div>

				<div className={`user-detail ${selectedUser ? "expanded" : ""}`}>
					{selectedUser && (
						<>
							<button
								onClick={() => {
									setSelectedUser(null);
									setShowReportDetails(false);
								}}
								style={{ marginBottom: "1rem" }}
							>
								<ArrowLeftFromLine />
							</button>
							<img
								src={selectedUser.user.avatar}
								alt={selectedUser.user.fullName}
							/>
							<h3>{selectedUser.user.fullName}</h3>
							<p>ID: {selectedUser.user.id}</p>
							<p>Số lần bị báo cáo: {reportDetails.length}</p>
							{reportDetails.length > 0 && (
								<>
									<button
										className="toggle-detail-btn"
										onClick={() => setShowReportDetails((prev) => !prev)}
									>
										{showReportDetails ? (
											<u>Ẩn chi tiết báo cáo</u>
										) : (
											"Xem chi tiết báo cáo"
										)}
									</button>
								</>
							)}
							<div className="actions">
								{tab === "user" ? (
									<button
										className="ban-btn"
										onClick={() => handleBanUser(selectedUser.user.id)}
									>
										<CircleSlash /> Ban
									</button>
								) : (
									<button
										className="ban-btn"
										onClick={() => handleUnBanUser(selectedUser.user.id)}
									>
										<CircleSlash /> UnBan
									</button>
								)}
							</div>
						</>
					)}
				</div>
				<div className={`user-detail ${showReportDetails ? "expanded" : ""}`}>
					{showReportDetails && (
						<ul className="report-list">
							{reportDetails.map((r, i) => (
								<li key={i}>
									<div className="reporter">
										<img src={r.reporter.avatar} alt={r.reporter.fullName} />
										<div className="report-label">
											<h3>{r.reporter.fullName}</h3>
											<p>{formatRelativeTime(r.createdAt)}</p>
										</div>
									</div>
									<p>
										<strong>Lý do:</strong> {r.reason}
									</p>
									<p>
										<strong>Mô tả:</strong> {r.description}
									</p>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export default Account;
