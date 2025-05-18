import { useAuth } from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { UserDetailResponse } from "@/models/UserModel";
import { PostDetail, PostRequestPage, PostSimple } from "@/models/PostModel";
import { getPostFromId, getPostFromUserId } from "@/services/postService";
import "@/styles/components/_profileCard.scss";
import { Ban, Command, Heart, LayoutGrid, SquarePen, Tags } from "lucide-react";
import toast from "react-hot-toast";
import PostDetails from "./../Post/PostDetails";

const ProfileCard: React.FC<UserDetailResponse> = (props) => {
	const { user } = useAuth();
	const myId = user?.id;
	const profileUserId = props.id;
	const totalPost: number = props.postCount | 1;
	const isMyWall = myId === profileUserId;
	const [fetchPosts, setFetchPosts] = useState<PostSimple[]>([]);
	const [detailPost, setDetailPost] = useState<PostDetail | null>(null);

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

	return (
		<div className="profile-container">
			{detailPost ? (
				<PostDetails
					post={detailPost}
					onClose={() => setDetailPost(null)}
					setLike={() => setDetailPost(null)}
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
								<button className="follow">Following</button>
								<button className="addFriend">+ Add friend</button>
								<button className="block">
									<Ban /> Block
								</button>
							</div>
						)}
					</div>
					<div className="quantity">
						<span className="post-count">{props.postCount} post</span>
						<span className="followers-count">
							{props.followerCount} followers
						</span>
						<span className="followings-count">
							{props.followingCount} followings
						</span>
					</div>
					<div className="introduce">
						<p>{props.bio}</p>
						<p>Gender: {props.gender}</p>
						<p>Age: {props.age}</p>
						<p>Phone number: {props.phoneNumber}</p>
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
							<div className="item" key={post.id} onClick={() => handleShowPost(post.id)}>
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
