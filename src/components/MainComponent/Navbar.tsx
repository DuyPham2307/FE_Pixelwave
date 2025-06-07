import { useNavigate } from "react-router-dom";

import "@/styles/components/_navbar.scss"; // Import the CSS file for styling
import CreatePost from "@/components/Modal/CreatePost/CreatePost";

import logo from "@/assets/images/logo.png";
import { Bell, Contact, Search, SquarePlus } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import FriendRequestDropdown from "../Dropdown/FriendRequestDropdown";
import { NotificationDTO } from "@/models/Notification";
import { notificationService } from "@/services/notificationService";
import { useWebSocket } from "@/hooks/useWebSocket";
import NotificationDropdown from "../Dropdown/NotificationDropdown";

const Navbar = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const [loading, setLoading] = useState<boolean>(false);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [showPendingFriend, setShowPendingFriend] = useState(false);
	const [showNotiDropdown, setShowNotiDropdown] = useState(false);
	const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
	const [hasUnread, setHasUnread] = useState(false);

	// Load unread notifications ban đầu
	const fetchUnreadNotifications = async () => {
		try {
			const res = await notificationService.getNotifications(0, 20, true);
			setNotifications(res.data.content);
			setHasUnread(res.data.totalElements > 0);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		if (user?.id) {
			fetchUnreadNotifications();
		}
	}, [user]);

	// Xử lý khi có notification mới từ WebSocket
	const handleNotificationReceived = (newNoti: NotificationDTO) => {
		setNotifications((prev) => [newNoti, ...prev]);
		setHasUnread(true);
	};

	useWebSocket({
		token: localStorage.getItem("accessToken")!,
		userId: user?.id,
		onNotificationReceived: handleNotificationReceived,
	});

	const handleMarkAllAsRead = async () => {
		try {
			await notificationService.markAllAsRead();
			setHasUnread(false);
			setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
		} catch (err) {
			console.error(err);
			toast.error("Đánh dấu đã đọc thất bại");
		}
	};

	const handleLogout = () => {
		setLoading(true);
		logout();
		toast.success("Logout successful!");
		setLoading(false);
		navigate("/login");
	};
	const path = window.location.pathname.split("/")[1];

	return (
		<header className="header">
			<nav className="navbar">
				{showModal && <CreatePost onClose={() => setShowModal(false)} />}
				<span
					className="logo"
					onClick={() => {
						navigate(`/${path}`);
					}}
				>
					<img src={logo} alt="Logo for Wavelink" />
				</span>
				<div className="search-bar">
					<button className="search-btn">
						<Search />
					</button>
					<input type="text" placeholder="Search..." className="search-input" />
				</div>
				<div className="user-interaction">
					<div
						className="request-friend-pending"
						onClick={() => setShowPendingFriend((prev) => !prev)}
					>
						<button className="pending-btn">
							<Contact />
						</button>
						{showPendingFriend && <FriendRequestDropdown />}
					</div>
					<div className="create-post" onClick={() => setShowModal(true)}>
						<button className="create-btn">
							<SquarePlus />
						</button>
					</div>
					<div className="notifications" style={{ position: "relative" }}>
						<button
							className="notification-btn"
							onClick={() => setShowNotiDropdown((prev) => !prev)}
						>
							<Bell />
							{hasUnread && <span className="noti-dot" />}
						</button>

						{showNotiDropdown && (
							<NotificationDropdown
								notifications={notifications}
								onMarkAllAsRead={handleMarkAllAsRead}
							/>
						)}
					</div>
					<div className="profile">
						<img src={user?.avatar} alt="logo for user" />
						<ul className="menu">
							<li
								className="item"
								onClick={() => navigate(`/user/${user?.id}`)}
							>
								Your profile
							</li>
							<li className="item" onClick={() => navigate("/user/settings")}>
								Settings
							</li>
							<li className="item" onClick={handleLogout}>
								Logout
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
