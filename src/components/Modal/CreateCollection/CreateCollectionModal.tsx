import { CollectionRequestDTO } from "@/models/CollectionModel";
import { createCollection } from "@/services/collectionService";
import "@/styles/components/_createCollectionModal.scss";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface CreateCollectionModalProps {
	closeModal: () => void;
}

const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
	closeModal,
}) => {
	const [newCollectionName, setNewCollectionName] = useState("");
	const [isPublic, setIsPulic] = useState(true);
	const [newDescription, setNewDescription] = useState("");

	const handleCreate = async () => {
		const data: CollectionRequestDTO = {
			title: newCollectionName,
			isPublic,
			description: newDescription,
		};
		if (!data.title) {
			toast.error("Collection title is required.");
			return;
		}
		if (!data.description) {
			toast.error("Collection description is required.");
			return;
		}
		await createCollection(data);
		setNewCollectionName("");
		setNewDescription("");
		setIsPulic(true);
		toast.success("Create collection successfully!");
    closeModal();
	};

	return (
		<div className="modal-collection">
			<div className="modal-content">
				<h3>Create New Collection</h3>
				<input
					type="text"
					placeholder="Collection title"
					value={newCollectionName}
					onChange={(e) => setNewCollectionName(e.target.value)}
				/>
				<label>
					<input
						type="text"
						placeholder="Collection description"
						onChange={(e) => setNewDescription(e.target.value)}
					/>
				</label>
				<label>
					<input
						type="checkbox"
						checked={isPublic}
						onChange={(e) => setIsPulic(e.target.checked)}
					/>
					Public
				</label>
				<div className="modal-actions">
					<button onClick={handleCreate}>Create</button>
					<button onClick={closeModal}>Cancel</button>
				</div>
			</div>
		</div>
	);
};

export default CreateCollectionModal;
