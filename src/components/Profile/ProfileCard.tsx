import { useAuth } from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { UserDetailResponse } from "@/models/UserModel";
import { PostDetail, PostRequestPage, PostSimple } from "@/models/PostModel";
import {
	getPostById,
	getPostFromUserId,
	getPostTagged,
} from "@/services/postService";
import "@/styles/components/_profileCard.scss";
import {
	Ban,
	Cake,
	Command,
	Heart,
	LayoutGrid,
	Phone,
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
import { unFriend } from '@/services/friendService';

const ProfileCard: React.FC<UserDetailResponse> = (props) => {
	const { user } = useAuth();
	const myId = user?.id;
	const profileUserId = props.id;
	const totalPost: number = props.postCount | 1;
	const isMyWall = myId === profileUserId;
	const [userPosts, setUserPosts] = useState<PostSimple[] | null>(null);
	const [taggedPosts, setTaggedPosts] = useState<PostSimple[] | null>(null);
	const [fetchPosts, setFetchPosts] = useState<PostSimple[]>([]);
	const [isShowingTaggedPosts, setIsShowingTaggedPosts] = useState(false);

	const [detailPost, setDetailPost] = useState<PostDetail | null>(null);
	const [typeRelationShipModal, setTypeRelationShipModal] =
		useState<string>("");
	const [showModalRelationShip, setShowModalRelationShip] =
		useState<boolean>(false);

	useEffect(() => {
		const loadPosts = async () => {
			if (!isShowingTaggedPosts) {
				if (!userPosts) {
					try {
						const payload: PostRequestPage = {
							userId: profileUserId,
							size: totalPost,
						};
						const response = await getPostFromUserId(payload);
						console.log(response.posts);
						setUserPosts(response.posts);
						setFetchPosts(response.posts);
					} catch (error) {
						console.error("getPost error: ", error);
						toast.error("Can't fetch post from userId");
					}
				} else {
					setFetchPosts(userPosts);
				}
			} else {
				if (!taggedPosts) {
					try {
						const payload: PostRequestPage = {
							userId: profileUserId,
							size: totalPost,
						};
						const response = await getPostTagged(payload);
						setTaggedPosts(response.posts);
						setFetchPosts(response.posts);
					} catch (error) {
						console.error("get tagged post error: ", error);
						toast.error("Can't fetch tagged posts");
					}
				} else {
					setFetchPosts(taggedPosts);
				}
			}
		};

		loadPosts();
	}, [profileUserId, totalPost, isShowingTaggedPosts]);

	const handleShowPost = async (postId: number) => {
		try {
			const res = await getPostById(postId);
			setDetailPost(res);
			window.history.pushState({}, "", `/user/p/${postId}`);
		} catch (error) {
			console.error("Showpost error: ", error);
			toast.error("Can't Showpost from post Id");
		}
	};

const requestAddFriend = async (userId: number) => {
	try {
		await addFriend(userId);
		toast.success("Gửi lời mời kết bạn thành công!");
	} catch (error: any) {
		if (error.response?.status === 409) {
			toast.error("Bạn đã gửi lời mời kết bạn trước đó.");
		} else {
			console.error(error);
			toast.error("Gửi lời mời kết bạn thất bại!");
		}
	}
};

const handleUnFriend = async (userId: number) => {
	try {
		const res = await unFriend(userId);
		console.log(res);
		

		toast.success("Xóa kết bạn thành công!");
	} catch (error: any) {
		if (error.response?.status === 409) {
			toast.error("Bạn đã gửi lời mời kết bạn trước đó.");
		} else {
			console.error(error);
			toast.error("Gửi lời mời kết bạn thất bại!");
		}
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
				<PostDetails
					post={detailPost}
					onClose={() => {
						setDetailPost(null);
						window.history.pushState({}, "", `/user/${user?.id}`);
					}}
				/>
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
										onClick={() => handleUnFriend(props.id)}
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
								<button className="block" onClick={() => requestBlock(props.id)}>
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
					<button
						className={`personal ${!isShowingTaggedPosts ? "active" : ""}`}
						onClick={() => setIsShowingTaggedPosts(false)}
					>
						<LayoutGrid />
					</button>
					<button
						className={`tagging ${isShowingTaggedPosts ? "active" : ""}`}
						onClick={() => setIsShowingTaggedPosts(true)}
					>
						<Tags />
					</button>
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
