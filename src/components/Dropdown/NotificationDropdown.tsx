import { useState } from "react";
import { NotificationDTO } from "@/models/Notification";
import "@/styles/components/_notification-dropdown.scss";
import { useNavigate } from "react-router-dom";
import { notificationService } from "@/services/notificationService";

interface NotificationDropdownProps {
  onClose: () => void;
  notifications: NotificationDTO[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationDTO[]>>;
}

const NotificationDropdown = ({ onClose, notifications, setNotifications }: NotificationDropdownProps) => {
	const [activeTab, setActiveTab] = useState<"unread" | "read">("unread");
	const navigate = useNavigate();
  console.log("NotificationDropdown mounted: ", notifications);

	const handleClickNotification = async (noti: NotificationDTO) => {
		try {
			await notificationService.markAsRead(noti.id);
		} catch (error) {
			console.error("Error handling notification click:", error);
		}

		setNotifications((prev) =>
			prev.map((n) => (n.id === noti.id ? { ...n, read: true } : n))
		);

		if (noti.type === "NEW_POST" || noti.type === "TAGGED_IN_POST") {
			navigate(`/user/p/${noti.referenceId}`);
		} else if (
			noti.type === "NEW_FRIEND_REQUEST" ||
			noti.type === "FRIEND_REQUEST_ACCEPTED"
		) {
			navigate(`/user/${noti.referenceId}`);
		}
		onClose();
	};

    const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

	const unread = notifications.filter((n) => !n.read);
	const read = notifications.filter((n) => n.read);

	return (
		<div className="notification-dropdown">
			<div className="noti-header">
				<button
					className={activeTab === "unread" ? "active" : ""}
					onClick={() => setActiveTab("unread")}
				>
					Chưa đọc ({unread.length})
				</button>
				<button
					className={activeTab === "read" ? "active" : ""}
					onClick={() => setActiveTab("read")}
				>
					Đã đọc ({read.length})
				</button>
				<button
					className="mark-all-read-btn"
					onClick={handleMarkAllAsRead}
				>
					Đánh dấu đã đọc hết
				</button>
			</div>

			{/* <div className="noti-list">
        {(activeTab === "unread" ? unreadNotis : readNotis).length === 0 && (
          <p className="no-notifications">Không có thông báo</p>
        )}

        {(activeTab === "unread" ? unreadNotis : readNotis).map((noti) => (
          <div key={noti.id} className={`noti-item ${noti.isRead ? "read" : "unread"}`}>
            <img src={noti.sender.avatar} alt={noti.sender.fullName} className="avatar" />
            <div className="noti-content">
              <p>{noti.content}</p>
              <small>{new Date(noti.createdAt).toLocaleString()}</small>
            </div>
          </div>
        ))}
      </div> */}
			<div className="noti-list">
				{(activeTab === "unread" ? unread : read).length === 0 ? (
					<p className="no-notifications">Không có thông báo</p>
				) : (
					(activeTab === "unread" ? unread : read).map((noti) => (
						<div
							key={noti.id}
							className={`noti-item ${noti.read ? "read" : "unread"}`}
							onClick={() => handleClickNotification(noti)}
						>
							<img
								src={noti.sender.avatar}
								alt={noti.sender.fullName}
								className="avatar"
							/>
							<div className="noti-content">
								<p>{noti.content}</p>
								<small>{new Date(noti.createdAt).toLocaleString()}</small>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default NotificationDropdown;
