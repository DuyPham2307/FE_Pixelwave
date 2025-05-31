import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import "@/styles/pages/_setting.scss";
import { useAuth } from "@/hooks/useAuth";
import { UpdateUserProfileRequestDTO } from "@/models/UserModel";
import {
	getUserById,
	updateAvatar,
	updatePassword,
	updateUserProfile,
} from "@/services/userService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AvatarCropModal from "@/components/Modal/AvatarCropModal/AvatarCropModal";

const Settings = () => {
	const { user } = useAuth();
	const avatar = user?.avatar;
	const [avatarPreview, setAvatarPreview] = useState<string>(avatar || "");
	const [avatarFile, setAvatarFile] = useState<File>(null!);
	const [isCropModalOpen, setIsCropModalOpen] = useState(false);
	const [showPersonalInfo, setShowPersonalInfo] = useState(false);
	const [showAccountInfo, setShowAccountInfo] = useState(false);
	const [userData, setUserData] = useState<UpdateUserProfileRequestDTO | null>(
		null
	);
	const [oldPass, setOldPass] = useState("");
	const [newPass, setNewPass] = useState("");
	const [confirmPass, setConfirmPass] = useState("");
	const navigate = useNavigate();

	// Fetch user detail and update state
	const fetchUserDetail = async () => {
		try {
			if (!user?.id) return;
			const res = await getUserById(user.id);
			const { bio, gender, phoneNumber, age, avatar } = res;

			setUserData({ bio, gender, phoneNumber, age });
			setAvatarPreview(avatar);

			// Update user in localStorage
			const storedUser = localStorage.getItem("user");
			if (storedUser) {
				const updatedUser = { ...JSON.parse(storedUser), avatar };
				localStorage.setItem("user", JSON.stringify(updatedUser));
			}
		} catch (err) {
			console.error("Failed to fetch user detail", err);
		}
	};

	useEffect(() => {
		fetchUserDetail();
	}, [user?.id]);

	const handleChangeData = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setUserData((prev) => {
			if (!prev) return prev;
			return { ...prev, [name]: value } as UpdateUserProfileRequestDTO;
		});
	};

	const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setAvatarFile(file);
			setIsCropModalOpen(true);
		}
	};

	const handleCroppedAvatar = (cropped: File) => {
		setAvatarFile(cropped);
		setAvatarPreview(URL.createObjectURL(cropped));
		setIsCropModalOpen(false);
	};

	const handleUpdateAvatar = async () => {
		if (!avatarFile) {
			toast.error("Vui lòng chọn ảnh đại diện");
			return;
		}
		try {
			await updateAvatar(avatarFile, "test");
			toast.success("Cập nhật ảnh đại diện thành công");

			// Fetch new avatar & update localStorage
			if (user?.id) {
				const updatedUser = await getUserById(user.id);
				setAvatarPreview(updatedUser.avatar);

				// Cập nhật localStorage
				const storedUser = localStorage.getItem("user");
				if (storedUser) {
					const parsed = JSON.parse(storedUser);
					const newUser = { ...parsed, avatar: updatedUser.avatar };
					localStorage.setItem("user", JSON.stringify(newUser));
				}

				// Điều hướng về trang profile
				navigate(`/user/${user.id}`);
			}
		} catch (error) {
			console.error("Lỗi khi cập nhật ảnh đại diện:", error);
			toast.error("Cập nhật ảnh đại diện thất bại");
		}
	};

	const handleUpdateProfile = async () => {
		if (!userData || !userData.phoneNumber || !userData.gender) {
			toast.error("Vui lòng nhập đầy đủ thông tin");
			return;
		}
		try {
			await updateUserProfile(userData);
			toast.success("Cập nhật thông tin người dùng thành công");

			navigate(`/user/${user?.id}`);
		} catch (error) {
			console.error("Lỗi khi cập nhật profile:", error);
			toast.error("Cập nhật thông tin thất bại");
		}
	};

	const handleUpdatePassword = async () => {
		if (!newPass || !confirmPass) {
			toast.error("Vui lòng điền đầy đủ thông tin mật khẩu");
			return;
		}

		if (newPass !== confirmPass) {
			toast.error("Mật khẩu mới và xác nhận không khớp");
			return;
		}

		try {
			await updatePassword(oldPass, newPass);
			toast.success("Cập nhật mật khẩu thành công");

			// Reset input fields
			setOldPass("");
			setNewPass("");
			setConfirmPass("");

			// Có thể điều hướng về trang profile nếu cần
			navigate(`/user/${user?.id}`);
		} catch (error) {
			console.error("Lỗi khi cập nhật mật khẩu:", error);
			toast.error("Cập nhật mật khẩu thất bại: ", error);
		}
	};

	return (
		<div className="setting-container">
			<div className="setting-avatar-wrapper">
				{avatarPreview && (
					<img
						src={avatarPreview}
						alt="avatar preview"
						className="edit-profile__avatar"
					/>
				)}
				<AvatarCropModal
					isOpen={isCropModalOpen}
					imageFile={avatarFile}
					onClose={() => setIsCropModalOpen(false)}
					onCropComplete={handleCroppedAvatar}
				/>
				{avatarFile ? (
					<button
						className="edit-profile__submit-btn"
						onClick={handleUpdateAvatar}
					>
						{avatarFile ? "Cập nhật ảnh đại diện" : "None"}
					</button>
				) : (
					<input
						type="file"
						accept="image/*"
						className="edit-profile__file-input"
						onChange={handleSelectFile}
					/>
				)}
			</div>

			{/* PERSONAL INFO */}
			<div className="setting-section">
				<div
					className="setting-header"
					onClick={() => setShowPersonalInfo(!showPersonalInfo)}
				>
					<span>Thông tin cá nhân</span>
					{showPersonalInfo ? (
						<ChevronUp size={18} />
					) : (
						<ChevronDown size={18} />
					)}
				</div>
				{showPersonalInfo && (
					<div className="setting-content">
						<div className="setting-field">
							<label>Số điện thoại</label>
							<input
								type="text"
								name="phoneNumber"
								value={userData?.phoneNumber || ""}
								onChange={handleChangeData}
							/>
						</div>
						<div className="setting-field">
							<label>Giới tính</label>
							<select
								name="gender"
								value={userData?.gender || ""}
								onChange={handleChangeData}
								className="edit-profile__input"
							>
								<option value="">Select Gender</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
							</select>
						</div>
						<div className="setting-field">
							<label>Tuổi</label>
							<input
								type="number"
								name="age"
								value={userData?.age || ""}
								onChange={handleChangeData}
							/>
						</div>
						<div className="setting-field">
							<label>Giới thiệu</label>
							<input
								value={userData?.bio || ""}
								name="bio"
								onChange={handleChangeData}
							/>
						</div>
						<button
							className="edit-profile__submit-btn"
							onClick={handleUpdateProfile}
						>
							Cập nhật
						</button>
					</div>
				)}
			</div>

			{/* ACCOUNT INFO */}
			<div className="setting-section">
				<div
					className="setting-header"
					onClick={() => setShowAccountInfo(!showAccountInfo)}
				>
					<span>Thông tin tài khoản</span>
					{showAccountInfo ? (
						<ChevronUp size={18} />
					) : (
						<ChevronDown size={18} />
					)}
				</div>
				{showAccountInfo && (
					<div className="setting-content">
						<div className="setting-field">
							<label>Mật khẩu hiện tại</label>
							<input
								type="password"
								placeholder="********"
								name="oldPass"
								value={oldPass}
								onChange={(e) => setOldPass(e.target.value)}
							/>
						</div>
						<div className="setting-field">
							<label>Mật khẩu mới</label>
							<input
								type="password"
								value={newPass}
								onChange={(e) => setNewPass(e.target.value)}
							/>
						</div>
						<div className="setting-field">
							<label>Xác nhận mật khẩu mới</label>
							<input
								type="password"
								value={confirmPass}
								onChange={(e) => setConfirmPass(e.target.value)}
							/>
						</div>
						<button
							className="edit-profile__submit-btn"
							onClick={handleUpdatePassword}
						>
							Lưu thay đổi
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Settings;
