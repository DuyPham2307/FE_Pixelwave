import React, { useState } from "react";
import { UserDetailResponse, UserFirstUpload } from "@/models/UserModel";
import "@/styles/components/_editNewProfileCard.scss";
import { updateAvatar, updateUserProfile } from "@/services/userService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AvatarCropModal from "../Modal/AvatarCropModal/AvatarCropModal";

const EditNewProfileCard: React.FC<UserDetailResponse> = (props) => {
	const { avatar, bio, gender, phoneNumber, fullName, age } = props;
	const [userData, setUserData] = useState<UserFirstUpload>({
		age,
		bio,
		gender,
		phoneNumber,
	});
	const [isCropModalOpen, setIsCropModalOpen] = useState(false);
	const [avatarFile, setAvatarFile] = useState<File>(null!); // khởi tạo avatarFile với giá trị null
	const [avatarPreview, setAvatarPreview] = useState<string>(avatar); // dùng avatar từ props ban đầu
	const navigate = useNavigate();

	const handleChangeData = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setUserData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setAvatarFile(file);
			setIsCropModalOpen(true); // Mở modal crop ảnh
		}
	};

	const handleCroppedAvatar = (cropped: File) => {
		setAvatarFile(cropped);
		setAvatarPreview(URL.createObjectURL(cropped));
		setIsCropModalOpen(false);
	};

	const handleUpdateProfile = async () => {
		// Gọi API để cập nhật avatar và thông tin người dùng
		if (!avatarFile) {
			toast.error("Vui lòng chọn ảnh đại diện");
			return;
		}
		if (!userData.phoneNumber) {
			toast.error("Vui lòng nhập số điện thoại");
			return;
		}

		if (!userData.gender) {
			toast.error("Vui lòng nhập giới tính");
			return;
		}

		try {
			// Gọi API updateAvatar
			await updateAvatar(avatarFile, "test");
			toast.success("Cập nhật ảnh đại diện thành công");
			// Cập nhật lại avatar trong state
			const storedUser = localStorage.getItem("user");
			const userObj = storedUser ? JSON.parse(storedUser) : null;
			if (userObj) {
				userObj.avatar = avatarPreview;
			}
			localStorage.setItem("user", JSON.stringify(userObj));

			// Gọi API updateUserProfile
			await updateUserProfile(userData);
			toast.success("Cập nhật thông tin người dùng thành công");

			// Cập nhật state và chuyển hướng
			setUserData((prev) => ({ ...prev, ...userData }));
			toast.success("Chào mừng bạn đến với trang cá nhân của mình");
			navigate("/user/");
		} catch (error) {
			console.error("Lỗi khi cập nhật profile:", error);
			toast.error("Cập nhật thất bại ");
		}
	};

	return (
		<div className="edit-profile">
			<div className="edit-profile__header">
				{avatarPreview && (
					<img
						src={avatarPreview}
						alt="avatar preview"
						className="edit-profile__avatar"
					/>
				)}
				<input
					type="file"
					accept="image/*"
					className="edit-profile__file-input"
					onChange={handleSelectFile}
				/>
				<div className="edit-profile__info">
					<div className="edit-profile__name">
						<input
							className="edit-profile__name-input"
							value={fullName}
							readOnly
						/>
					</div>
					<div className="edit-profile__fields">
						<input
							type="text"
							name="bio"
							value={userData.bio || ""}
							onChange={handleChangeData}
							placeholder="Bio"
							className="edit-profile__input"
						/>
						<select
							name="gender"
							value={userData.gender || ""}
							onChange={handleChangeData}
							className="edit-profile__input"
						>
							<option value="">Select Gender</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
						</select>
						<input
							type="text"
							name="age"
							value={age}
							readOnly
							className="edit-profile__input"
						/>
						<input
							type="text"
							name="phoneNumber"
							value={userData.phoneNumber}
							onChange={handleChangeData}
							placeholder="Phone Number"
							className="edit-profile__input"
						/>
					</div>
				</div>
			</div>
			<button
				className="edit-profile__submit-btn"
				onClick={handleUpdateProfile}
			>
				Cập nhật
			</button>

			<AvatarCropModal
				isOpen={isCropModalOpen}
				imageFile={avatarFile}
				onClose={() => setIsCropModalOpen(false)}
				onCropComplete={handleCroppedAvatar}
			/>
		</div>
	);
};

export default EditNewProfileCard;
