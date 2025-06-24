import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ChatLayout from "@/layouts/ChatLayout";
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
import EditNewProfile from "@/pages/EditNewProfile";
import AuththenRoute from "@/components/Route/AuthenRoute";
import PublicRoute from "@/components/Route/PublicRoute";
import PostPage from "@/pages/user/PostPage";
import NotFoundPage from "@/pages/NotFoundPage";
import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Account from "@/pages/admin/Account";
import PostReport from "@/pages/admin/PostReport";
import UserReport from "@/pages/admin/UserReport";

const AppRoutes = () => {
	return (
		<Router>
			<Routes>
				{/* Route cho đăng nhập */}
				{/* <Route
					path="/login"
					element={
						<AuthLayout>
							<Login />
						</AuthLayout>
					}
				/> */}
				<Route
					path="/login"
					element={
						<PublicRoute>
							<AuthLayout>
								<Login />
							</AuthLayout>
						</PublicRoute>
					}
				/>

				<Route
					path="/"
					element={
						<AuththenRoute>
							<div>Loading...</div>
						</AuththenRoute>
					}
				/>

				<Route
					path="/edit-first-time"
					element={
						<AuthLayout>
							<EditNewProfile />
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
						path="/user/explore/:tagId"
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
							<ChatLayout>
								<Messenger />
							</ChatLayout>
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

				{/* Route cho các trang công khai không cần xác thực */}

				<Route
					path="/user/p/:postId"
					element={
						<MainLayout>
							<PostPage />
						</MainLayout>
					}
				/>

				{/* Các route khác cho admin hoặc chưa xác thực */}
				{/* Các route admin có thể ở đây khi có role 'ADMIN' */}
				<Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
					<Route
						path="/admin/"
						element={
							<AdminLayout>
								<Dashboard />
							</AdminLayout>
						}
					/>
					<Route
						path="/admin/accounts"
						element={
							<AdminLayout>
								<Account />
							</AdminLayout>
						}
					/>
					<Route
						path="/admin/post-reports"
						element={
							<AdminLayout>
								<PostReport />
							</AdminLayout>
						}
					/>
					<Route
						path="/admin/user-reports"
						element={
							<AdminLayout>
								<UserReport />
							</AdminLayout>
						}
					/>
									<Route
					path="/admin/user/:id"
					element={
						<AdminLayout>
							<Profile />
						</AdminLayout>
					}
				/>
				</Route>
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</Router>
	);
};

export default AppRoutes;
