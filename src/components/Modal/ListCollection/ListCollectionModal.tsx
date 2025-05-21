import { useAuth } from "@/hooks/useAuth";
import { CollectionResponseDTO } from "@/models/CollectionModel";
import { addPostToCollection, getUserCollections } from "@/services/collectionService";
import React, { useEffect } from "react";
import "@/styles/components/_listCollectionModal.scss";
import toast from "react-hot-toast";

interface ListCollectionProps {
  postId: number;
	onClose: () => void;
}

const ListCollection: React.FC<ListCollectionProps> = ({ onClose, postId }) => {
	const { user } = useAuth();
	const [listCollection, setListCollection] = React.useState<
		CollectionResponseDTO[]
	>([]);

	useEffect(() => {
		const fetchUserCollections = async () => {
			try {
				const collections = await getUserCollections();
				setListCollection(collections);
			} catch (error) {
				console.error("Error fetching user collections:", error);
			}
		};
		if (user?.id) {
			fetchUserCollections();
		}
	}, [user]);

  const handleSelectCollection = async(collectionId: number): Promise<void> => {
    try {
      addPostToCollection(collectionId, postId);
      console.log("Selected collection:", collectionId);
      toast.success("Thêm bài viết vào collection thành công!");
      onClose();
    } catch (error) {
      console.error("Error adding post to collection:", error);
      toast.error("Có lỗi khi thêm bài viết vào collection");
    }
  }

	return (
		<div className="list-collection-modal">
			<div className="modal-content">
      <h1>Danh sách collection: </h1>
				<button className="close-btn" onClick={onClose}>
					×
				</button>
				{listCollection.map((collection) => (
					<div key={collection.id} className="collection-item" onClick={() => handleSelectCollection(collection.id)}>
						<h3>Collection title: {collection.title}</h3>
						<p>Collection description{collection.description}</p>
						<p>Count: {collection.postCount}</p>
						<p>Privacy: {collection.isPublic ? "Public" : "Private"}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default ListCollection;
