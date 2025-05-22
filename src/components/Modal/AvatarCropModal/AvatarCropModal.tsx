import React, { useState, useCallback, useEffect } from "react";
import Cropper, { Area } from "react-easy-crop";
import { createPortal } from "react-dom";

interface AvatarCropModalProps {
  isOpen: boolean;
  imageFile: File | null;
  onClose: () => void;
  onCropComplete: (file: File) => void;
}

const AvatarCropModal: React.FC<AvatarCropModalProps> = ({
  isOpen,
  imageFile,
  onClose,
  onCropComplete,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const onCropCompleteHandler = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const getCroppedImg = async (): Promise<File | null> => {
    if (!imageFile || !croppedAreaPixels) return null;

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(imageFile);
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) return reject("Canvas context not found");

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
          if (!blob) return reject("Failed to create blob");

          const croppedFile = new File([blob], imageFile.name, {
            type: imageFile.type,
          });
          resolve(croppedFile);
        }, imageFile.type || "image/jpeg");
      };

      image.onerror = () => reject("Image load error");
    });
  };

  const handleConfirm = async () => {
    const cropped = await getCroppedImg();
    if (cropped) onCropComplete(cropped);
  };

  if (!isOpen || !imageFile) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-xl">
        <h2 className="text-lg font-semibold mb-4">Crop your avatar</h2>
        <div className="relative w-full h-96">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1 / 1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AvatarCropModal;
