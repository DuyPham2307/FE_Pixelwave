import { UserDetailResponse } from "@/models/UserModel";
import { getUserById } from "@/services/userService";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EditNewProfileCard from "@/components/Profile/EditNewProfileCard";
import { useAuth } from "@/hooks/useAuth";

const EditNewProfile = () => {
	const { user } = useAuth();

	const [profile, setProfile] = useState<UserDetailResponse>();

	useEffect(() => {
		const fetchUserProfile = async (): Promise<UserDetailResponse> => {
			try {
				const response = await getUserById(Number(user?.id));
				console.log("fetchUserProfile: ", response);
				setProfile(response);
				toast.success("Get profile user from id successfully");
				return response;
			} catch (error) {
				toast.error("Can't get profile user from id");
				console.log("new edit pages: ", error);
				throw error; // Re-throw the error to maintain the function's return type
			}
		};
		fetchUserProfile();
	}, [user]);

	return profile && <EditNewProfileCard {...profile} />;
};

export default EditNewProfile;
