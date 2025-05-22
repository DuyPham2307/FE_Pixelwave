import { useEffect, useState } from "react";
import {
	acceptFriendRequest,
	getPendingFriendRequests,
	rejectFriendRequest,
} from "@/services/friendService";
import { AddFriendRequestDTO } from "@/models/UserModel";
import toast from "react-hot-toast";
import "@/styles/components/_friendRequestDropdowm.scss";
import { formatTimestamp } from "@/utils/formatTimestamp";

const FriendRequestDropdown: React.FC = () => {
	const [requests, setRequests] = useState<AddFriendRequestDTO[]>([]);

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const data = await getPendingFriendRequests();
				setRequests(data);
				console.log("pending: ", data);
			} catch (error) {
				console.error(error);
				toast.error("Can't fetch friend requests");
			}
		};
		fetchRequests();
	}, []);

	const acceptFriend = async (requestId: number): Promise<void> => {
		try {
			await acceptFriendRequest(requestId);
			toast.success("Accept friend success!");
		} catch (error) {
			console.error(error);
			toast.error("Can't accept friend requests");
		}
	};

	const rejectFriend = async (requestId: number): Promise<void> => {
		try {
			await rejectFriendRequest(requestId);
			toast.success("Already reject friend!");
		} catch (error) {
			console.error(error);
			toast.error("Can't reject friend requests");
		}
	};

	return (
		<div className="friend-request-dropdown">
			<h4>Friend Requests</h4>
			{requests.length === 0 ? (
				<p>No new requests</p>
			) : (
				<ul>
					{requests.map((req) => (
						<li key={req.id}>
							<img src={req.sender.avatar} alt="Avatar" />
							<div>
								<span>
									<a href={`/user/${req.id}`}>{req.sender.fullName}</a>
								</span>
								<span>{formatTimestamp(req.createAt)}</span>
							</div>
							<button onClick={() => acceptFriend(req.id)}>Accept</button>
							<button onClick={() => rejectFriend(req.id)}>Deny</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default FriendRequestDropdown;
