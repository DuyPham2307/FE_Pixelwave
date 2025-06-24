import { useNavigate } from "react-router-dom";

import "@/styles/components/_navbar.scss"; // Import the CSS file for styling
import CreatePost from "@/components/Modal/CreatePost/CreatePost";

import logo from "@/assets/images/logo.png";
import { Bell, Contact, Search, SquarePlus } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import FriendRequestDropdown from "../Dropdown/FriendRequestDropdown";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import NotificationDropdown from "../Dropdown/NotificationDropdown";
import { NotificationDTO } from "@/models/Notification";
import { notificationService } from "@/services/notificationService";

const Navbar = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const [loading, setLoading] = useState<boolean>(false);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [showPendingFriend, setShowPendingFriend] = useState(false);
	const [showNotiDropdown, setShowNotiDropdown] = useState(false);
	const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
	const [hasUnread, setHasUnread] = useState(false);
	const [searchText, setSearchText] = useState("");

	// Load initial
	useEffect(() => {
		if (user?.id) {
			notificationService.getNotifications(0, 20).then((res) => {
				setNotifications(res.data.content);
				setHasUnread(res.data.content.some((n) => !n.read));
			});
		}
	}, [user]);

	useNotificationSocket({
		token: localStorage.getItem("accessToken")!,
		userId: user?.id,
		onNotification: (noti) => {
			setNotifications((prev) => [noti, ...prev]);
			setHasUnread(true);
		},
	});

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchText.trim()) {
			navigate(`/user/search?query=${encodeURIComponent(searchText.trim())}`);
			setSearchText(""); // Clear search input after submitting
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
				<form className="search-bar" onSubmit={handleSearch}>
					<button type="submit" className="search-btn">
						<Search />
					</button>
					<input
						type="text"
						placeholder="Search..."
						className="search-input"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
				</form>
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
							onClick={() => {
								setShowNotiDropdown((prev) => !prev);
								setHasUnread(false); // Reset chấm đỏ khi mở dropdown
							}}
						>
							<Bell />
							{hasUnread && <span className="noti-dot" />}
						</button>

						{showNotiDropdown && (
							<NotificationDropdown
								notifications={notifications}
								setNotifications={setNotifications}
								onClose={() => setShowNotiDropdown(false)}
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
