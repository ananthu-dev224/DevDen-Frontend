import { FC, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop/types";

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  cropShape: "rectangular" | "circular";
}

const ImageCropperModal: FC<ImageCropperModalProps> = ({ isOpen, onClose, imageSrc, cropShape }) => {
  if (!isOpen) return null;

  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const handleZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const handleSave = async () => {
    if (croppedAreaPixels && imageSrc) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        console.log("Cropped image:", croppedImage);
        
        onClose(); 
      } catch (error) {
        console.error("Failed to crop image:", error);
      }
    }
  };

  const getCroppedImg = (imageSrc: string, pixelCrop: Area) => {
    return new Promise<string>((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return reject(new Error("Failed to get canvas context"));
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            return reject(new Error("Failed to create blob from canvas"));
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(blob);
        });
      };
      image.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 p-6 relative max-h-screen overflow-y-auto my-6 mx-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Adjust the image :</h2>
        <div className="relative w-full h-60 rounded-md overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={cropShape === "circular" ? 1 : 4}
            cropShape={cropShape === "circular" ? "round" : "rect"}
            onCropChange={handleCropChange}
            onZoomChange={handleZoomChange}
            onCropComplete={onCropComplete}
            showGrid={false}
          />
        </div>
        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-md font-semibold" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;