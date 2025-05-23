import { UserRecommendationDTO } from "@/models/UserModel";
import { addFriend, getRecommendUser } from "@/services/friendService";
import "@/styles/components/_suggestionBar.scss"; // Import your CSS file here
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../Spinner/Spinner";

const SuggestionBar = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [userRecommend, setUserRecommend] = useState<UserRecommendationDTO[]>(
		[]
	);

	useEffect(() => {
		const fetchRecommend = async (): Promise<void> => {
			setIsLoading(true);
			try {
				const data = await getRecommendUser(5);
				setUserRecommend(data);
				toast.success("get rcm");
				console.log(data);
			} catch (error) {
				console.error("Error handling reaction:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRecommend();
	}, []);

	const requestAddFriend = async (userId: number) => {
		try {
			await addFriend(userId);
			toast.success("Send add friend request success!")
			setUserRecommend((prev) => prev.filter((user) => user.id !== userId));
		} catch (error) {
			console.log(error);
			toast.error("Send add friend request fail!")
		}
	}

	return (
		<div className="suggestion-bar">
			<div className="label">
				<span>Suggested For You</span>
				<span className="sub-label">See all</span>
			</div>
			{isLoading ? (
				<Spinner />
			) : (
				<div className="list">
					{userRecommend.map((user) => (
						<div key={user.id} className="item">
							<img src={user.avatar || "https://avatar.iran.liara.run/public/30"} alt={user.fullName} className="avatar" />
							<div className="info">
								<h3 className="name">
									<a href={`/user/${user.id}`}>{user.fullName}</a>
								</h3>
								<p className="desc">
									{user.mutualFriendsCount > 0
										? `${user.mutualFriendsCount} mutual friend`
										: ""}
								</p>
							</div>
							<button onClick={() => requestAddFriend(user.id)} className="direct">
								<UserPlus />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default SuggestionBar;
