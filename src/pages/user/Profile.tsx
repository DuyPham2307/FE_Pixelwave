import ProfileCard from "@/components/Profile/ProfileCard";
import { UserDetailResponse } from "@/models/UserModel";
import { getUserById } from "@/services/userService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const Profile = () => {
	const { id: profileUserId } = useParams(); // ID trên URL
	const [profile, setProfile] = useState<UserDetailResponse>();

	useEffect(() => {

		const fetchUserProfile = async (): Promise<UserDetailResponse> => {
			try {
				const response = await getUserById(Number(profileUserId));
				console.log("fetchUserProfile: ", response);
				setProfile(response);
				return response;
			} catch (error) {
				toast.error("Can't get profile user from id");
				console.log("profilePage", error);
				throw error; // Re-throw the error to maintain the function's return type
			}
		};
		fetchUserProfile();
	}, [profileUserId]);

	return <div>{profile && <ProfileCard {...profile} />}</div>;
};

export default Profile;
