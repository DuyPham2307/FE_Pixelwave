import { useState } from "react";
import { NotificationDTO } from "@/models/Notification";
import "@/styles/components/_notification-dropdown.scss";

const NotificationDropdown = ({
  notifications,
  onMarkAllAsRead,
}: {
  notifications: NotificationDTO[];
  onMarkAllAsRead: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<"unread" | "read">("unread");

  const unreadNotis = notifications.filter((n) => !n.read);
  const readNotis = notifications.filter((n) => n.read);

  return (
    <div className="notification-dropdown">
      <div className="noti-header">
        <button
          className={activeTab === "unread" ? "active" : ""}
          onClick={() => setActiveTab("unread")}
        >
          Chưa đọc ({unreadNotis.length})
        </button>
        <button
          className={activeTab === "read" ? "active" : ""}
          onClick={() => setActiveTab("read")}
        >
          Đã đọc ({readNotis.length})
        </button>
        <button className="mark-all-read-btn" onClick={onMarkAllAsRead}>
          Đánh dấu đã đọc hết
        </button>
      </div>

      <div className="noti-list">
        {(activeTab === "unread" ? unreadNotis : readNotis).length === 0 && (
          <p className="no-notifications">Không có thông báo</p>
        )}

        {(activeTab === "unread" ? unreadNotis : readNotis).map((noti) => (
          <div key={noti.id} className={`noti-item ${noti.read ? "read" : "unread"}`}>
            <img src={noti.sender.avatar} alt={noti.sender.fullName} className="avatar" />
            <div className="noti-content">
              <p>{noti.content}</p>
              <small>{new Date(noti.createdAt).toLocaleString()}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDropdown;
