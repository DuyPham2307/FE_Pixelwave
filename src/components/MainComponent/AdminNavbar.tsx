import { useNavigate } from "react-router-dom";

import "@/styles/components/_navbar.scss"; // Import the CSS file for styling
import CreatePost from "@/components/Modal/CreatePost/CreatePost";

import logo from "@/assets/images/logo.png";

import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const AdminNavBar = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const [loading, setLoading] = useState<boolean>(false);
	const [showModal, setShowModal] = useState<boolean>(false);

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
				<div className="user-interaction">
					<div className="profile">
						<img src={user?.avatar || `https://i.pravatar.cc/150?img=${user?.id}`} alt="logo for user" />
						<ul className="menu">
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

export default AdminNavBar;
