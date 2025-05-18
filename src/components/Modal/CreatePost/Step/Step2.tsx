import React, { useState, useCallback, useEffect } from 'react';
import Cropper, { Area } from 'react-easy-crop';

interface Step2Props {
  images: File[];
	setImages: (images: File[]) => void;
  onPrev: () => void;
  onNext: () => void;
}

const Step2 = ({ images, setImages, onPrev, onNext }: Step2Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreas, setCroppedAreas] = useState<Record<number, Area>>({});
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (!images.length) return;

    const url = URL.createObjectURL(images[currentIndex]);
    setImageUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [images, currentIndex]);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: Area) => {
    setCroppedAreas((prev) => ({ ...prev, [currentIndex]: croppedAreaPixels }));
  }, [currentIndex]);

  const getCroppedImg = async (imageFile: File, croppedAreaPixels: Area): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(imageFile);
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Cannot get canvas context'));
          return;
        }

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          resolve(blob);
        }, imageFile.type || 'image/jpeg');
      };

      image.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    });
  }

  const applyCropToCurrentImage = async () => {
    if (!croppedAreas[currentIndex]) return;

    const croppedArea = croppedAreas[currentIndex];
    const croppedImageBlob = await getCroppedImg(images[currentIndex], croppedArea);

    const croppedImageFile = new File([croppedImageBlob], images[currentIndex].name, { type: images[currentIndex].type });

    const newImages = [...images];
    newImages[currentIndex] = croppedImageFile;
    setImages(newImages)
  };

  const goToPrevImage = async () => {
    await applyCropToCurrentImage();
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  const goToNextImage = async () => {
    await applyCropToCurrentImage();
    if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  return (
    <div className="step2">
      <div className="header">
        <button onClick={onPrev}>Back</button>
        <h2>Crop Image</h2>
        <button onClick={onNext}>Next</button>
      </div>

      <div className="previewWrapper">
        <button onClick={goToPrevImage} disabled={currentIndex === 0}>←</button>

        <div className="cropContainer">
          {imageUrl && (
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={4/3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>

        <button onClick={goToNextImage} disabled={currentIndex === images.length - 1}>→</button>
      </div>
    </div>
  );
};

export default Step2;
