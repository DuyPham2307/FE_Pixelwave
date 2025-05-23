import React, { useEffect, useState } from "react";
import {
	deleteCollection,
	getUserCollections,
	// getCollectionById,
	// updateCollection,
	getPostsInCollection,
	// removePostFromCollection,
} from "@/services/collectionService";
import { CollectionResponseDTO } from "@/models/CollectionModel";
import { PostDetail, PostSimple } from "@/models/PostModel";
import "@/styles/pages/_collection.scss";
import toast from "react-hot-toast";
import { SquarePlus, Trash } from "lucide-react";
import { getPostFromId } from "@/services/postService";
import PostDetails from "@/components/Post/PostDetails";
import CreateCollectionModal from "./../../components/Modal/CreateCollection/CreateCollectionModal";

const CollectionsPage = () => {
	const [collections, setCollections] = useState<CollectionResponseDTO[]>([]);
	const [selectedCollection, setSelectedCollection] =
		useState<CollectionResponseDTO | null>(null);
	const [posts, setPosts] = useState<PostSimple[]>([]);
	const [postDetails, setPostDetails] = useState<PostDetail | null>(null);
	const [showModal, setShowModal] = useState(false);
	// const [newCollectionName, setNewCollectionName] = useState("");
	// const [isPublic, setIsPulic] = useState(true);
	// const [newDescription, setNewDescription] = useState("");

	useEffect(() => {
		loadCollections();
	}, []);

	const loadCollections = async () => {
		const data = await getUserCollections();
		setCollections(data);
	};

	const selectCollection = async (collection: CollectionResponseDTO) => {
		setSelectedCollection(collection);
		const postList = await getPostsInCollection(collection.id);
		setPosts(postList);
	};

	const handleDelete = async (collectionId: number) => {
		await deleteCollection(collectionId);
		setCollections(collections.filter((c) => c.id !== collectionId));
		setSelectedCollection(null);
		setPosts([]);
		toast.success("Delete collection successfully!");
	};

	const handleLoadDetail = async (postId: number): Promise<void> => {
		try {
			const res = await getPostFromId(postId);
			setPostDetails(res);
		} catch (error) {
			toast.error("Failed to load post details");
			console.error("Error loading post details:", error);
		}
	};

	return (
		<div className="collections-page">
			<aside className="sidebar">
				<button onClick={() => setShowModal(true)} className="create-button">
					<SquarePlus /> Create collections
				</button>
				<div className="collection-list">
					{collections.map((collection) => (
						<div
							key={collection.id}
							className="collection-item"
							onClick={() => selectCollection(collection)}
						>
							<div className="collection-options">
								<span className="dots">⋯</span>
								<button
									className="delete-button"
									onClick={(e) => {
										e.stopPropagation();
										handleDelete(collection.id);
									}}
								>
									<Trash fill="red" />
								</button>
							</div>

							<p className="collection-title">{collection.title}</p>
							{/* <p className="collection-privacy">
								{collection.isPublic ? "Public" : "Private"}
							</p> */}
							<p className="collection-description">{collection.description}</p>
						</div>
					))}
				</div>
			</aside>
			<main className="main-content">
				{selectedCollection ? (
					<div>
						<div className="collection-header">
							<div>
								<h2>{selectedCollection.title}</h2>
								<h5>{selectedCollection.title}</h5>
							</div>
							<button
								className="delete-button"
								onClick={() => handleDelete(selectedCollection.id)}
							>
								Delete
							</button>
						</div>
						<p>Quantity of posts: {posts.length}</p>
						<div className="post-grid">
							{posts.map((post) => (
								<img
									key={post.id}
									src={post.imageUrl}
									alt="post"
									className="post-thumbnail"
									onClick={() => {
										handleLoadDetail(post.id);
									}}
								/>
							))}
						</div>
					</div>
				) : (
					<h2></h2>
				)}
			</main>
			{postDetails && (
				<PostDetails
					post={postDetails}
					key={postDetails.id}
					onClose={() => setPostDetails(null)}
				/>
			)}
			{showModal && (
				<CreateCollectionModal closeModal={() => setShowModal(false)} />
			)}
		</div>
	);
};

export default CollectionsPage;
