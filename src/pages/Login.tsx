import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./../hooks/useAuth";

import GoogleLoginButton from "@/components/Button/GoogleLoginButton";

import "@/styles/pages/_login.scss";
import { toast } from "react-hot-toast";
import bg from "@/assets/images/bg.png";
import logo from "@/assets/images/logo.png";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
	const { register, login } = useAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = useState<boolean>(false);

	interface LoginFormState {
		username: string;
		password: string;
		showPassword: boolean;
	}

	const [loginForm, setLoginForm] = useState<LoginFormState>({
		username: "",
		password: "",
		showPassword: false,
	});

	const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoginForm((prev) => ({ ...prev, [name]: value }));
	};

	const toggleLoginPassword = () => {
		setLoginForm((prev) => ({ ...prev, showPassword: !prev.showPassword }));
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(false);
		const { username, password } = loginForm;

		if (!username || !password) {
			toast.error("Please fill in all fields");
			return;
		}

		try {
			const response = await login({ username, password });

			toast.success("Login successful!");
			console.log(response);

			if (response.user.role === "ADMIN") {
				navigate("/admin/");
			} else {
				navigate("/user/");
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				toast.error(err.message);
			} else {
				toast.error("An unexpected error occurred. Please try again.");
			}
		}
		setLoading(true);
	};

	//register Modal

	type RegisterFormState = {
		username: string;
		password: string;
		confirmPassword: string;
		fullName: string;
		age: number;
		showPassword: boolean;
	};

	const [showModal, setShowModal] = useState<boolean>(false);
	const [registerForm, setRegisterForm] = useState<RegisterFormState>({
		username: "",
		password: "",
		confirmPassword: "",
		fullName: "",
		age: NaN,
		showPassword: false,
	});

	const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setRegisterForm((prev) => ({ ...prev, [name]: value }));
	};

	const toggleRegisterPassword = () => {
		setRegisterForm((prev) => ({ ...prev, showPassword: !prev.showPassword }));
	};

	const isValidPassword = (password: string): boolean => {
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
		return passwordRegex.test(password);
	};

	const isValidEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		const { username, password, confirmPassword, fullName, age } = registerForm;

		if (!username || !password || !fullName || !age) {
			toast.error("Please fill in all fields");
			return;
		}

		if (!isValidEmail(username)) {
			toast.error("Invalid email format");
			return;
		}

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		if (!isValidPassword(password)) {
			toast.error(
				"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number."
			);
			return;
		}

		if (age < 0 || age > 120) {
			toast.error("Please enter a valid age");
			return;
		}

		setLoading(true);
		try {
			// Đăng ký
			await register({ username, password, fullName, age });
			toast.success("Register successful!");

			// ✅ Đăng nhập tự động ngay sau đăng ký
			const response = await login({ username, password });
			console.log(response);

			// ✅ Điều hướng tới trang chỉnh sửa hồ sơ
			navigate("/edit-first-time");
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.error("Register or login error:", err);
				toast.error(err.message);
			} else {
				toast.error("An unexpected error occurred. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="login">
			{/* Modal for Register */}
			{showModal && (
				<div className="modal">
					<div className="content">
						<span className="close" onClick={() => setShowModal(false)}>
							&times;
						</span>
						<h2 className="title">Create WaveLink account</h2>
						<form onSubmit={handleRegister}>
							<div className="input-group">
								<label>Username: </label>
								<input
									type="text"
									name="username"
									value={registerForm.username}
									onChange={handleRegisterChange}
									placeholder="Enter your username"
									required
								/>
							</div>
							<div className="input-group password">
								<label>Your password </label>
								<input
									type={registerForm.showPassword ? "text" : "password"}
									name="password"
									value={registerForm.password}
									onChange={handleRegisterChange}
									placeholder="Enter your password"
									required
								/>
								<button
									type="button"
									className="toggle"
									onClick={toggleRegisterPassword}
								>
									{registerForm.showPassword ? <Eye /> : <EyeOff />}
								</button>
							</div>
							<div className="input-group password">
								<label>Confirm password </label>
								<input
									type={registerForm.showPassword ? "text" : "password"}
									name="confirmPassword"
									value={registerForm.confirmPassword}
									onChange={handleRegisterChange}
									placeholder="Enter your confirm password"
									required
								/>
								<button
									type="button"
									className="toggle"
									onClick={toggleRegisterPassword}
								>
									{registerForm.showPassword ? <Eye /> : <EyeOff />}
								</button>
							</div>
							<div className="input-group">
								<label>Your name</label>
								<input
									type="text"
									name="fullName"
									value={registerForm.fullName}
									onChange={handleRegisterChange}
									placeholder="Enter your full name"
								/>
							</div>
							<div className="input-group">
								<label>Your age</label>
								<input
									type="number"
									name="age"
									value={registerForm.age}
									onChange={handleRegisterChange}
									placeholder="Enter your age"
								/>
							</div>
							<button type="submit" className="send-btn">
								Send
							</button>
						</form>
					</div>
				</div>
			)}
			{/* Left Panel */}
			<div className="left">
				<span className="text">
					Let’s Explore <br />
					the world together.
					<br />
					<button
						className="join-btn"
						onClick={() => {
							document.getElementById("email")?.focus();
						}}
					>
						Join now!
					</button>
				</span>
				<img src={bg} alt="Login" className="image" />
			</div>

			{/* Right Panel */}
			<div className="right">
				<div className="form-container">
					<span className="title">Login</span>
					<form className="form" onSubmit={handleLogin}>
						<div className="input-group">
							<label htmlFor="username">Email</label>
							<input
								type="text"
								name="username"
								value={loginForm.username}
								onChange={handleLoginChange}
								placeholder="Enter your username"
								required
							/>
						</div>
						<div className="input-group password">
							<label htmlFor="password">Password</label>
							<input
								type={loginForm.showPassword ? "text" : "password"}
								name="password"
								value={loginForm.password}
								onChange={handleLoginChange}
								placeholder="Enter your password"
								required
							/>
							<button
								type="button"
								className="toggle"
								onClick={toggleLoginPassword}
							>
								{loginForm.showPassword ? <Eye /> : <EyeOff />}
							</button>
						</div>
						<button type="submit" className="submit-btn">
							Login
						</button>
					</form>

					<div className="divider">
						<span>Easy create account with</span>
					</div>

					<div className="socials">
						<GoogleLoginButton />
						<button
							className="social-btn wavelink"
							onClick={() => setShowModal(true)}
						>
							Register
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
