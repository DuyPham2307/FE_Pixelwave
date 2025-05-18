import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedRoute from "@/components/Route/ProtectedRoute";

// Unlimited permit
import Login from "@/pages/Login";
// import Post from "@/pages/Post";

// User pages
import Home from "@/pages/user/Home";
import Explore from "@/pages/user/Explore";
import Collections from "@/pages/user/Collections";
import Messenger from "@/pages/user/Messenger";
import Settings from "@/pages/user/Settings";
import Profile from "@/pages/user/Profile";
import GoogleCallback from "@/components/SwitchPage/GoogleCallback";

const AppRoutes = () => {
	return (
		<Router>
			<Routes>
				{/* Route cho đăng nhập */}
				<Route
					path="/"
					element={
						<AuthLayout>
							<Login />
						</AuthLayout>
					}
				/>
				<Route
					path="/login"
					element={
						<AuthLayout>
							<Login />
						</AuthLayout>
					}
				/>

				<Route path="/auth/google/callback" element={<GoogleCallback />} />

				{/* Các route cần xác thực với role */}
				<Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
					<Route
						path="/user"
						element={
							<MainLayout>
								<Home />
							</MainLayout>
						}
					/>
					<Route
						path="/user/explore"
						element={
							<MainLayout>
								<Explore />
							</MainLayout>
						}
					/>
					<Route
						path="/user/profile"
						element={
							<MainLayout>
								<Profile />
							</MainLayout>
						}
					/>
					<Route
						path="/user/settings"
						element={
							<MainLayout>
								<Settings />
							</MainLayout>
						}
					/>
					<Route
						path="/user/collections"
						element={
							<MainLayout>
								<Collections />
							</MainLayout>
						}
					/>
					<Route
						path="/user/messenger"
						element={
							<MainLayout>
								<Messenger />
							</MainLayout>
						}
					/>
					<Route
						path="/user/:id"
						element={
							<MainLayout>
								<Profile />
							</MainLayout>
						}
					/>
				</Route>

				{/* Các route khác cho admin hoặc chưa xác thực */}
				{/* Các route admin có thể ở đây khi có role 'ADMIN' */}
			</Routes>
		</Router>
	);
};

export default AppRoutes;
