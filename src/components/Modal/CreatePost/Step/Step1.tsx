import "@/styles/components/_createPostStepModal.scss";
import { ChangeEvent } from "react";
import createPost from "@/assets/images/createPost.png";

interface Step1Props {
	setImages: (images: File[]) => void;
	onNext: () => void;
}

const Step1 = ({ setImages, onNext }: Step1Props) => {
	const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files ? Array.from(e.target.files) : [];
		setImages(files);
		onNext();
	};

	return (
		<div className="step1">
			<h2>Create post</h2>
			<img src={createPost} alt="" />
			<input
				id="imageFile"
				type="file"
				multiple
				accept="image/*"
				onChange={handleSelect}
				hidden
			/>
			<label htmlFor="imageFile" className="choose-btn">
				Choose from computer
			</label>
		</div>
	);
};

export default Step1;
