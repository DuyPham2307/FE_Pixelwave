import { useAuth } from "@/hooks/useAuth";
import { CollectionResponseDTO } from "@/models/CollectionModel";
import { addPostToCollection, getUserCollections } from "@/services/collectionService";
import React, { useEffect, useState } from "react";
import "@/styles/components/_listCollectionModal.scss";
import toast from "react-hot-toast";
import CreateCollectionModal from "../CreateCollection/CreateCollectionModal";

interface ListCollectionProps {
  postId: number;
	onClose: () => void;
}

const ListCollection: React.FC<ListCollectionProps> = ({ onClose, postId }) => {
	const { user } = useAuth();
		const [showModal, setShowModal] = useState(false);
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
			{showModal && <CreateCollectionModal closeModal={() => setShowModal(false)} />	}
			<div className="modal-content">
      <h1>Lưa vào</h1>
				<button className="close-btn" onClick={onClose}>
					×
				</button>
				<div className="modal-collection-list">
					{listCollection.length === 0 && "Chưa có bộ sưu tập nào"}
					{listCollection.map((collection) => (
						<div key={collection.id} className="collection-item" onClick={() => handleSelectCollection(collection.id)}>
							<h3>{collection.title}</h3>
							<p>{collection.description}</p>
							<p>Count: {collection.postCount}</p>
							<p>{collection.isPublic ? "Public" : "Private"}</p>
						</div>
					))}
				</div>
				<div className="create-new-collection">
					<button className="create-new-collection-btn" onClick={() => setShowModal(true)}>
						+
					</button>
					<p className="create-new-collection-text">Bộ sưu tập mới</p>
				</div>
			</div>
		</div>
	);
};

export default ListCollection;
