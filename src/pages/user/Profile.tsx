import ProfileCard from "@/components/Profile/ProfileCard";
import { UserDetailResponse } from "@/models/UserModel";
import { getUserById } from "@/services/userService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import NotFoundPage from "../NotFoundPage";

const Profile = () => {
	const { id: profileUserId } = useParams(); // ID trên URL
	const [profile, setProfile] = useState<UserDetailResponse>();
		const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		if (!profileUserId || isNaN(Number(profileUserId))) {
			setNotFound(true);
			return;
		}
		const fetchUserProfile = async (): Promise<UserDetailResponse> => {
			try {
				const response = await getUserById(Number(profileUserId));
				console.log("fetchUserProfile: ", response);
				setProfile(response);
				return response;
			} catch (error) {
				toast.error("Can't get profile user from id");
				console.log("profilePage", error);
							setNotFound(true);
				throw error; 
			}
		};
		fetchUserProfile();
	}, [profileUserId]);

		if (notFound) return <NotFoundPage />;

	return <div>{profile && <ProfileCard {...profile} />}</div>;
};

export default Profile;
