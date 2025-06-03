import "@/styles/pages/_explore.scss";
import "@/styles/_animate.scss";
import PostDetails from "@/components/Post/PostDetails";
import { PostDetail } from "@/models/PostModel";
import { getPostById } from "@/services/postService";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ImageTag, TagImageResponse } from "@/models/ImageModel";
import { getImagesByTag, getTagForExplore } from "@/services/exploreService";
import TagModal from "@/components/Modal/TagModal/TagModal";
import Spinner from "@/components/Spinner/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "../NotFoundPage";

const Explore = () => {
	const { tagId } = useParams();
	const navigate = useNavigate();

	const [tagNames, setTagNames] = useState<ImageTag[]>([]);
	const [selectedTagImages, setSelectedTagImages] = useState<
		TagImageResponse[]
	>([]);
	const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLastPage, setIsLastPage] = useState(false);
	const [detailPost, setDetailPost] = useState<PostDetail | null>(null);
	const [showselectTagModal, setShowSelectTagModal] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingImages, setIsLoadingImages] = useState(false);
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		const parsedTagId = tagId ? parseInt(tagId) : NaN;
		if (!tagId || isNaN(parsedTagId)) {
			navigate("/user/explore/23", { replace: true });
		} else {
			setSelectedTagId(parsedTagId);
			fetchImagesByTag(parsedTagId, 1);
		}
	}, []);

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

	const fetchImagesByTag = async (tagId: number, page: number) => {
		setIsLoadingImages(true);
		try {
			const res = await getImagesByTag(tagId, page, 20);
			setSelectedTagImages(res.content);
			setCurrentPage(page);
			setIsLastPage(res.content.length < 20); // nếu ít hơn 20 ảnh => là trang cuối
			toast.success("Loaded images for tag!");
		} catch (error) {
			console.error("Error loading images for tag:", error);
			toast.error("Không thể tải ảnh của tag này.");
			setNotFound(true);
			return;
		} finally {
			setIsLoadingImages(false);
		}
	};

	// 3. Khi click tag mới
	const handleTagClick = async (tagId: number) => {
		setSelectedTagId(tagId);
		navigate(`/user/explore/${tagId}`, { replace: true }); // update URL mà không reload
		await fetchImagesByTag(tagId, 1); // fetch ảnh mới
	};

	const handleShowPost = async (postId: number) => {
		try {
			const res = await getPostById(postId);
			setDetailPost(res);
			window.history.pushState({}, "", `/user/p/${postId}`);
		} catch (error) {
			console.error("Showpost error: ", error);
			toast.error("Can't show post from post Id");
		}
	};

	if (notFound) return <NotFoundPage />;

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
					onClose={() => {
						setDetailPost(null);
						window.history.pushState({}, "", `/user/explore/${tagId}`);
					}}
				/>
			) : (
				""
			)}
			<div className="tag-posts">
				<h1
					className={`welcome-title ${
						isLoading ? "animate-in-title" : "animate-out-title"
					}`}
				>
					Welcome to the explore!!!
				</h1>
				<div
					className={`tag-list ${
						isLoading ? "animate-out-content" : "animate-in-content"
					}`}
					style={{ display: isLoading ? "none" : "flex" }}
				>
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
						{`More >`}
					</div>
				</div>
			</div>
			{isLoadingImages ? (
				<Spinner />
			) : (
				<div className="wall-post-wrapper">
					{selectedTagId ? (
						<>
							<div className="wall-posts">
								{selectedTagImages.map((tagImage) => (
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
								))}
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
							<div className="pagination-posts">
								<button
									className="prev-btn"
									onClick={() => {
										if (currentPage > 1 && selectedTagId) {
											fetchImagesByTag(selectedTagId, currentPage - 1);
										}
									}}
									disabled={currentPage === 1}
								>
									<ChevronLeft />
								</button>
								<span>{currentPage}</span>
								<button
									className="next-btn"
									onClick={() => {
										if (!isLastPage && selectedTagId) {
											fetchImagesByTag(selectedTagId, currentPage + 1);
										}
									}}
									disabled={isLastPage}
								>
									<ChevronRight />
								</button>
							</div>
						</>
					) : (
						<div className="blank-space">
							<h1>Select 1 tags to explore about them!</h1>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Explore;
