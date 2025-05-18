import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/components/_createPostModal.scss";

import Step1 from "./Step/Step1";
import Step2 from "./Step/Step2";
import Step3 from "./Step/Step3";
import { uploadPost } from "@/services/postService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface CreatePostProps {
	onClose: () => void;
}

const CreatePost = ({ onClose }: CreatePostProps) => {
	const [step, setStep] = useState<number>(1);
	const [images, setImages] = useState<File[]>([]);
	const [caption, setCaption] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [privacySetting, setPrivacySetting] = useState<string>("public");
	const [taggedUserIds, setTaggedUserIds] = useState<number[] | null>(null);

	const navigate = useNavigate();

	const nextStep = () => setStep((prev) => prev + 1);
	const prevStep = () => setStep((prev) => prev - 1);

	const handlePost = async () => {
		setLoading(true);
		try {
			console.log("Ingredient for post: ",{ caption, images, privacySetting, taggedUserIds });
			await uploadPost({ caption, images, privacySetting, taggedUserIds });
			toast.success("Create a new post successful!");
			onClose();
		} catch (error: any) {
			console.error("Upload post failed: 123123", error);

			// Nếu là lỗi từ axios (có response từ server)
			if (error.response && error.response.data?.message) {
				toast.error(error.response.data.message);
			} else if (error.message) {
				toast.error(error.message);
			} else {
				toast.error("An unexpected error occurred.");
			}
		} finally{
			setLoading(false);
			navigate('/user/profile');
		}
	};

	return (
		<div className="modalOverlay">
			<button className="closeBtn" onClick={onClose}>
				✕
			</button>
			<div className="modalContent">
				<AnimatePresence mode="wait">
					{step === 1 && (
						<motion.div key="step1" {...fadeAnim}>
							<Step1 setImages={setImages} onNext={nextStep} />
						</motion.div>
					)}
					{step === 2 && (
						<motion.div key="step2" {...fadeAnim}>
							<Step2 images={images} setImages={setImages} onPrev={prevStep} onNext={nextStep} />
						</motion.div>
					)}
					{step === 3 && (
						<motion.div key="step3" {...fadeAnim}>
							<Step3
								caption={caption}
								setCaption={setCaption}
								privacy={privacySetting}
								setPrivacy={setPrivacySetting}
								onPrev={prevStep}
								onPost={handlePost}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default CreatePost;

const fadeAnim = {
	initial: { opacity: 0, x: 30 },
	animate: { opacity: 1, x: 0 },
	exit: { opacity: 0, x: -30 },
	transition: { duration: 0.3 },
};
