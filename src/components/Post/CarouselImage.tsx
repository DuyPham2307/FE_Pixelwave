import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import '@/styles/components/_carouselImage.scss'; // Import your CSS file for styling
import { ImageDTO } from "@/models/ImageModel";

type CarouselImageProps = {
	img_urls: ImageDTO[];
};

const CarouselImage: React.FC<CarouselImageProps> = (props) => {
	const { img_urls } = props;

	const [currentImageIndex, setCurrentImageIndex] = React.useState<number>(0);

	const handleNextImage = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === img_urls.length - 1 ? 0 : prevIndex + 1
		);
	};

	const handlePreviousImage = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === 0 ? img_urls.length - 1 : prevIndex - 1
		);
	};

	return (
		<div className="post-images">
			<button className="prev-btn" onClick={handlePreviousImage}>
				<ChevronLeft />
			</button>
			<img
				src={img_urls[currentImageIndex]?.url || ""}
				alt={`Post Image ${currentImageIndex + 1}`}
				className={`post-image`}
			/>
			<button className="next-btn" onClick={handleNextImage}>
				<ChevronRight />
			</button>
		</div>
	);
};

export default CarouselImage;
