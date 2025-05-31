import "@/styles/components/_sidebar.scss";
import {
    BookCopy,
    Compass,
    House,
    MessageCircleMore,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation(); // Get the current location
    const currentPath = location.pathname.split("/")[2]; // Extract the page name from the path

    return (
        <div className="sidebar">
            <ul className="list">
                <li className={`item ${!currentPath ? "isLocate" : ""}`}>
                    <Link to="/user/">
                        <House />
                        Home
                    </Link>
                </li>
                <li className={`item ${currentPath === "explore" ? "isLocate" : ""}`}>
                    <Link to="/user/explore/23">
                        <Compass />
                        Explore
                    </Link>
                </li>
                <li className={`item ${currentPath === "collections" ? "isLocate" : ""}`}>
                    <Link to="/user/collections">
                        <BookCopy />
                        Collections
                    </Link>
                </li>
                <li className={`item ${currentPath === "messenger" ? "isLocate" : ""}`}>
                    <Link to="/user/messenger">
                        <MessageCircleMore />
                        Messager
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
