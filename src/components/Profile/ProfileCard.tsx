import { useAuth } from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { UserDetailResponse } from "@/models/UserModel";
import { PostDetail, PostRequestPage, PostSimple } from "@/models/PostModel";
import { getPostFromId, getPostFromUserId } from "@/services/postService";
import "@/styles/components/_profileCard.scss";
import {
	Ban,
	Cake,
	Command,
	Heart,
	LayoutGrid,
	Phone,
	SquarePen,
	Tags,
	VenusAndMars,
} from "lucide-react";
import toast from "react-hot-toast";
import PostDetails from "./../Post/PostDetails";
import {
	addFriend,
	blockUser,
	followUser,
	unblockUser,
	unFollowUser,
} from "@/services/friendService";
import ListUserRelationship from "../Modal/ListUserRelationship/ListUserRelationship";

const ProfileCard: React.FC<UserDetailResponse> = (props) => {
	const { user } = useAuth();
	const myId = user?.id;
	const profileUserId = props.id;
	const totalPost: number = props.postCount | 1;
	const isMyWall = myId === profileUserId;
	const [fetchPosts, setFetchPosts] = useState<PostSimple[]>([]);
	const [detailPost, setDetailPost] = useState<PostDetail | null>(null);
	const [typeRelationShipModal, setTypeRelationShipModal] =
		useState<string>("");
	const [showModalRelationShip, setShowModalRelationShip] =
		useState<boolean>(false);

	useEffect(() => {
		const fetchUserPost = async () => {
			try {
				const payload: PostRequestPage = {
					userId: profileUserId,
					size: totalPost,
				};
				const response = await getPostFromUserId(payload);
				console.log("GetPost on Card success", response);
				setFetchPosts(response.posts);
			} catch (error) {
				console.error("getPost error: ", error);
				toast.error("Can't fetch post from userId");
			}
		};
		fetchUserPost();
	}, [profileUserId, totalPost]);

	const handleShowPost = async (postId: number) => {
		try {
			const res = await getPostFromId(postId);
			setDetailPost(res);
		} catch (error) {
			console.error("Showpost error: ", error);
			toast.error("Can't Showpost from post Id");
		}
	};

	const requestAddFriend = async (userId: number) => {
		try {
			await addFriend(userId);
			toast.success("Send add friend request success!");
		} catch (error) {
			console.log(error);
			toast.error("Send add friend request fail!");
		}
	};

	const requestFollow = async (userId: number) => {
		try {
			await followUser(userId);
			toast.success("Send follow request success!");
		} catch (error) {
			console.log(error);
			toast.error("Send follow request fail!");
		}
	};

	const requestUnFollow = async (userId: number) => {
		try {
			await unFollowUser(userId);
			toast.success("Send unfollow request success!");
		} catch (error) {
			console.log(error);
			toast.error("Send unfollow request fail!");
		}
	};

	const requestBlock = async (userId: number) => {
		try {
			await blockUser(userId);
			toast.success("Send unfollow request success!");
		} catch (error) {
			console.log(error);
			toast.error("Send unfollow request fail!");
		}
	};

	const requestUnBlock = async (userId: number) => {
		try {
			await unblockUser(userId);
			toast.success("Send unfollow request success!");
		} catch (error) {
			console.log(error);
			toast.error("Send unfollow request fail!");
		}
	};

	const handleOpenModalRelationship = (type: string) => {
		setTypeRelationShipModal(type);
		setShowModalRelationShip(true);
	};

	return (
		<div className="profile-container">
			{showModalRelationShip && (
				<ListUserRelationship
					userId={props.id}
					type={typeRelationShipModal}
					onClose={() => setShowModalRelationShip(false)}
				/>
			)}
			{detailPost ? (
				<PostDetails post={detailPost} onClose={() => setDetailPost(null)} />
			) : (
				""
			)}
			<div className="profile-header">
				<img src={props.avatar} alt="" className="avatar" />
				<div className="info">
					<div className="tilte">
						<span className="name">{props.fullName}</span>
						{isMyWall ? undefined : (
							<div className="interaction">
								{props.isFollowing ? (
									<button
										className="follow"
										onClick={() => requestUnFollow(props.id)}
									>
										Following
									</button>
								) : (
									<button
										className="follow"
										onClick={() => requestFollow(props.id)}
									>
										+Follow
									</button>
								)}
								{props.isFriend ? (
									<button
										className="addFriend"
										onClick={() => requestAddFriend(props.id)}
									>
										Friend
									</button>
								) : (
									<button
										className="addFriend"
										onClick={() => requestAddFriend(props.id)}
									>
										+ Add friend
									</button>
								)}
								<button className="block">
									{/* check block 
								=> hiển thị block > requestBlock(props.id)
								=> hiển thị unblock > requestUnBlock(props.id) */}
									<Ban /> Block
								</button>
							</div>
						)}
					</div>
					<div className="quantity">
						<span className="post-count">{props.postCount} post</span>
						<span
							className="followers-count"
							onClick={() => handleOpenModalRelationship("follower")}
						>
							{props.followerCount} followers
						</span>
						<span className="followings-count">
							{props.followingCount} followings
						</span>
						<span
							className="friends-count"
							onClick={() => handleOpenModalRelationship("friend")}
						>
							{props.friendCount} friends
						</span>
					</div>
					<p>{props.bio}</p>
					<div className="introduce">
						<p>
							<VenusAndMars /> {props.gender}
						</p>
						<p>
							<Cake /> {props.age}
						</p>
						<p>
							<Phone /> {props.phoneNumber}
						</p>
					</div>
				</div>
			</div>
			<div className="profile-wall">
				<div className="wall-actions">
					<button className="personal">
						<LayoutGrid />
					</button>
					<button className="tagging">
						<Tags />
					</button>
					{isMyWall ? (
						<button className="edit">
							<SquarePen />
						</button>
					) : undefined}
				</div>
				<div className="wall-posts">
					{fetchPosts.map((post) => {
						return (
							<div
								className="item"
								key={post.id}
								onClick={() => handleShowPost(post.id)}
							>
								<img src={post.imageUrl} alt="Post image" />
								<div className="counter">
									<span>
										{post.likeCount} <Heart />
									</span>
									<span>
										{post.commentCount} <Command />
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default ProfileCard;
