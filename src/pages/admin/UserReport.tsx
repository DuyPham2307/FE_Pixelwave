import React, { useState } from "react";
import '@/styles/pages/_userReport.scss'

interface UserDTO {
  id: number;
  fullName: string;
  avatar: string;
}

interface UserReportDetail {
  reporter: UserDTO;
  content: string;
  createAt: string;
}

// Tạo danh sách 20 người bị báo cáo
const initialReportedUsers: UserDTO[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  fullName: `Người dùng ${i + 1}`,
  avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${10 + i}.jpg`,
}));

const reporters: UserDTO[] = [
  { id: 101, fullName: "Admin 1", avatar: "https://randomuser.me/api/portraits/men/100.jpg" },
  { id: 102, fullName: "Admin 2", avatar: "https://randomuser.me/api/portraits/women/101.jpg" },
  { id: 103, fullName: "Kiểm duyệt viên 1", avatar: "https://randomuser.me/api/portraits/men/102.jpg" },
  { id: 104, fullName: "Kiểm duyệt viên 2", avatar: "https://randomuser.me/api/portraits/women/103.jpg" },
  { id: 105, fullName: "Kiểm duyệt viên 3", avatar: "https://randomuser.me/api/portraits/men/104.jpg" },
];

const reportContents = [
  "Gửi tin nhắn spam.",
  "Ngôn ngữ không phù hợp.",
  "Hành vi quấy rối.",
  "Chia sẻ nội dung phản cảm.",
  "Giả mạo người khác.",
];

const fakeUserReports = (userId: number): UserReportDetail[] => {
  return reporters.map((reporter, index) => ({
    reporter,
    content: reportContents[index],
    createAt: new Date(Date.now() - index * 3600 * 1000).toISOString(),
  }));
};

type ReportStatus = "pending" | "resolved";

const UserReport = () => {
  // Trạng thái người dùng bị báo cáo, kèm trạng thái xử lý
  const [reportedUsers, setReportedUsers] = useState(
    initialReportedUsers.map(user => ({ ...user, reportStatus: "pending" as ReportStatus }))
  );

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc danh sách theo searchTerm
  const filteredUsers = reportedUsers.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý đổi trạng thái báo cáo thành resolved
  const handleResolveReport = (userId: number) => {
    setReportedUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, reportStatus: "resolved" } : user
      )
    );
  };

  const selectedUser = reportedUsers.find((u) => u.id === selectedUserId) || null;
  const reports = selectedUserId ? fakeUserReports(selectedUserId) : [];

  return (
    <div className="user-report">
      <div className="user-list">
        {/* Thanh tìm kiếm */}
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        {/* Danh sách người dùng */}
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`user-item ${selectedUserId === user.id ? "selected" : ""}`}
            onClick={() => setSelectedUserId(user.id)}
          >
            <img src={user.avatar} alt="Avatar" />
            <div className="user-info">
              <p className="user-name">{user.fullName}</p>
              <p className={`report-status ${user.reportStatus}`}>
                {user.reportStatus === "pending" ? "Chưa xử lý" : "Đã xử lý"}
              </p>
            </div>
            {/* Nút xử lý báo cáo, chỉ hiện khi chưa xử lý */}
            {user.reportStatus === "pending" && (
              <button
                className="btn-resolve"
                onClick={(e) => {
                  e.stopPropagation(); // tránh click chọn user
                  handleResolveReport(user.id);
                }}
              >
                Xử lý
              </button>
            )}
          </div>
        ))}

        {filteredUsers.length === 0 && <p>Không tìm thấy người dùng phù hợp.</p>}
      </div>

      <div className="user-detail">
        {selectedUser ? (
          <>
            <h2>Chi tiết báo cáo: {selectedUser.fullName}</h2>
            {reports.map((report, index) => (
              <div key={index} className="report-card">
                <div className="report-header">
                  <img src={report.reporter.avatar} alt="Avatar" />
                  <p>{report.reporter.fullName}</p>
                  <span>{new Date(report.createAt).toLocaleString()}</span>
                </div>
                <p className="report-content">{report.content}</p>
              </div>
            ))}
            {reports.map((report, index) => (
              <div key={index} className="report-card">
                <div className="report-header">
                  <img src={report.reporter.avatar} alt="Avatar" />
                  <p>{report.reporter.fullName}</p>
                  <span>{new Date(report.createAt).toLocaleString()}</span>
                </div>
                <p className="report-content">{report.content}</p>
              </div>
            ))}
          </>
        ) : (
          <p>Chọn người dùng để xem chi tiết báo cáo</p>
        )}
      </div>
    </div>
  );
};

export default UserReport;
