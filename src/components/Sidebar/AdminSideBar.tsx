import "@/styles/components/_sidebar.scss";
import { FileWarning, House, SquareUserRound, UserMinus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const AdminSideBar = () => {
	const location = useLocation(); // Get the current location
	const currentPath = location.pathname.split("/")[2]; // Extract the page name from the path

	return (
		<div className="sidebar">
			<ul className="list">
				{/* <li className={`item ${!currentPath ? "isLocate" : ""}`}>
					<Link to="/admin">
						<House />
						DashBoard
					</Link>
				</li> */}
				<li className={`item ${currentPath === "accounts" ? "isLocate" : ""}`}>
					<Link to="/admin/accounts">
						<SquareUserRound />
						Accounts
					</Link>
				</li>
				<li
					className={`item ${currentPath === "post-reports" ? "isLocate" : ""}`}
				>
					<Link to="/admin/post-reports">
						<FileWarning />
						Post reports
					</Link>
				</li>
				<li
					className={`item ${currentPath === "user-reports" ? "isLocate" : ""}`}
				>
					<Link to="/admin/user-reports">
						<UserMinus />
						User reports
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default AdminSideBar;
