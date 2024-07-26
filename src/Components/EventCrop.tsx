
import React, { useState, useCallback, FC } from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop/types";

interface EventCropProps {
  imageSrc: string;
  onCropComplete: (croppedImage: string, imageBlob: Blob) => void;
  onClose: () => void;
}

const EventCrop: FC<EventCropProps> = ({ imageSrc, onCropComplete, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const cropImage = useCallback(async () => {
    if (!croppedArea) return;

    const canvas = document.createElement("canvas");
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const ctx: any = canvas.getContext("2d");

    canvas.width = croppedArea.width;
    canvas.height = croppedArea.height;

    ctx.drawImage(
      image,
      croppedArea.x,
      croppedArea.y,
      croppedArea.width,
      croppedArea.height,
      0,
      0,
      croppedArea.width,
      croppedArea.height
    );
    const croppedImage = canvas.toDataURL("image/jpeg");
    canvas.toBlob((blob: Blob | null) => {
      if (blob) {
        onCropComplete(croppedImage,blob);
        onClose();
      }
    }, 'image/jpeg');
  }, [croppedArea, imageSrc, onCropComplete, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-4 rounded-lg shadow-lg w-full max-w-lg">
        <div className="relative h-80 w-full bg-gray-100">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 2}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteHandler}
          />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={cropImage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
};



export default EventCrop;