import "@/styles/pages/_explore.scss";
import PostDetails from "@/components/Post/PostDetails";
import { PostDetail } from "@/models/PostModel";
import { getPostFromId } from "@/services/postService";
import { ChevronRight, Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ImageTag, TagImageResponse } from "@/models/ImageModel";
import { getImagesByTag, getTagForExplore } from "@/services/exploreService";
import TagModal from "./../../components/Modal/TagModal/TagModal";
import Spinner from "@/components/Spinner/Spinner";

const Explore: React.FC = () => {
	const [tagNames, setTagNames] = useState<ImageTag[]>([]);
	const [selectedTagImages, setSelectedTagImages] = useState<
		TagImageResponse[]
	>([]);
	const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
	const [detailPost, setDetailPost] = useState<PostDetail | null>(null);
	const [showselectTagModal, setShowSelectTagModal] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingImages, setIsLoadingImages] = useState(false);

	useEffect(() => {
		const fetchTags = async (): Promise<void> => {
			setIsLoading(true);
			try {
				const data = await getTagForExplore(10);
				setTagNames(data);
				console.log(data);
				toast.success("Get tag successfully!");
			} catch (error) {
				console.error("Error handling reaction:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchTags();
	}, []);

	const handleTagClick = async (tagId: number) => {
		setSelectedTagId(tagId);
		setIsLoadingImages(true);
		try {
			const res = await getImagesByTag(tagId, 1, 20); // hoặc page, size tùy pagination
			console.log(tagId);
			setSelectedTagImages(res.content);
			console.log(res.content);

			toast.success("Loaded images for tag!");
		} catch (error) {
			console.error("Error loading images for tag:", error);
			toast.error("Không thể tải ảnh của tag này.");
		} finally {
			setIsLoadingImages(false);
		}
	};

	const handleShowPost = async (postId: number) => {
		try {
			const res = await getPostFromId(postId);
			setDetailPost(res);
		} catch (error) {
			console.error("Showpost error: ", error);
			toast.error("Can't Showpost from post Id");
		}
	};

	const handleReact = async (): Promise<void> => {
		try {
			if (detailPost.liked) {
				const res = await unlikePost(detailPost.id);
				if (res.status !== 200) {
					throw new Error("Unlike failed");
				}
				setIsLiked(false);
				setLikeCount((prev) => Math.max(0, prev - 1));
				toast.success("Unlike post successfully!");
			} else {
				const res = await likePost(detailPost.id);
				if (res.status !== 200) {
					throw new Error("Like failed");
				}
				setIsLiked(true);
				setLikeCount((prev) => prev + 1);

				toast.success("Like post successfully!");
			}
		} catch (error) {
			console.error("Error handling reaction:", error);
			toast.error("Có lỗi khi like/unlike");
		}
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<div className="explore-container">
			{showselectTagModal && (
				<TagModal
					onClose={() => setShowSelectTagModal(false)}
					setTag={handleTagClick}
				/>
			)}

			{detailPost ? (
				<PostDetails
					post={detailPost}
					onClose={() => setDetailPost(null)}
					onLikeChanged={handleReact}
				/>
			) : (
				""
			)}
			<div className="tag-posts">
				{tagNames.map((tag) => (
					<div
						key={tag.id}
						className={`tag-item ${selectedTagId === tag.id ? "active" : ""}`}
						onClick={() => handleTagClick(tag.id)}
					>
						{tag.name}
					</div>
				))}
				<div className="tag-item" onClick={() => setShowSelectTagModal(true)}>
					More <ChevronRight />
				</div>
			</div>
			{selectedTagId ? (
				<div className="wall-posts">
					{isLoadingImages ? (
						<Spinner />
					) : (
						selectedTagImages.map((tagImage) => (
							<div
								className="item"
								key={tagImage.imageId}
								onClick={() => handleShowPost(tagImage.postId)}
							>
								<img src={tagImage.url} alt="Post image" />
								<div className="counter">
									<span>
										{tagImage.likeCount} <Heart />
									</span>
								</div>
							</div>
						))
					)}
				</div>
			) : (
				<div className="blank-space">
					<h1>Select 1 tags to explore about them!</h1>
				</div>
			)}
		</div>
	);
};

export default Explore;
