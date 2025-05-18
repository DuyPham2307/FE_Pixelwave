import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const GoogleCallback = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { loginWithGoogle } = useAuth();

	useEffect(() => {
		const fetchData = async () => {
			const code = new URLSearchParams(location.search).get("code");
			if (code) {
				try {
					// Đảm bảo gọi handleGoogleCallback một cách bất đồng bộ và chờ kết quả
					const response = await loginWithGoogle(code);
					toast.success("Login by social successful!");
					console.log(response);

					if (response.user.role === "ADMIN") {
						navigate("/admin/");
					} else {
						navigate("/user/");
					}
				} catch (error) {
					console.error("Error during Google callback:", error);
				}
			} else {
				console.error("Invalid error");
			}
		};

		fetchData();
	}, [location.search]); // Chạy lại khi location.search thay đổi

	return (
		<div>
			<h1>Google Login Callback</h1>
		</div>
	);
};

export default GoogleCallback;
