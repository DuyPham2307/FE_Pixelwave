import { ImageTag } from "@/models/ImageModel";
import { getTagForExplore } from "@/services/exploreService";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "@/styles/components/_tagModal.scss";
import Spinner from "@/components/Spinner/Spinner";

interface TagModalProps {
	onClose: () => void;
	setTag: (tagId: number) => void;
}

const TagModal: React.FC<TagModalProps> = ({ onClose, setTag }) => {
	const [tagNames, setTagNames] = useState<ImageTag[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchTags = async (): Promise<void> => {
			setIsLoading(true);
			try {
				const data = await getTagForExplore(50);
				setTagNames(data);
				toast.success("Get tag successfully!");
			} catch (error) {
				console.error("Error fetching tags:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchTags();
	}, []);

	return (
		<>
			{!isLoading && (
				<>
					<div className="modal-overlay" onClick={onClose}></div>
					<div className="tag-posts-modal">
						<button onClick={onClose}>x</button>
						{tagNames.map((tag) => (
							<div
								key={tag.id}
								className="tag-item"
								onClick={() => {
									setTag(tag.id);
									onClose();
								}}
							>
								{tag.name}
							</div>
						))}
					</div>
				</>
			)}
			{isLoading && (
				<div className="modal-overlay" onClick={onClose}>
					<Spinner />
				</div>
			)}
		</>
	);
};

export default TagModal;
