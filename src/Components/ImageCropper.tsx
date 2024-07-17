import { FC, useState, useCallback, CSSProperties} from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop/types";
import { useDispatch, useSelector } from "react-redux";
import { generateSign, editBanner, editDp } from "../services/profile";
import axios from "axios";
import {toast} from 'sonner'
import { getCroppedImg } from "../utils/crop";
import { editProfile } from "../redux/reducers/userSlice";
import ScaleLoader from 'react-spinners/ScaleLoader';
import { ImageCropperModalProps } from "../types/type";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const ImageCropperModal: FC<ImageCropperModalProps> = ({ isOpen, onClose, imageSrc, cropShape }) => {
  if (!isOpen) return null;
  const [loading, setLoading] = useState<boolean>(false);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const dispatch = useDispatch()
  const user = useSelector((store:any) => store.user.user)
  
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
        setLoading(true)
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

        const {signature,timestamp} = await generateSign(dispatch)

         // Upload to Cloudinary
         const formData = new FormData();
         formData.append("file", croppedImage, "cropped-image.jpg");
         formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET || "");
         formData.append("timestamp", timestamp.toString());
         formData.append("signature", signature);
         formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME || "");
         ;
         const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
          formData,
          {
            params:{
              api_key:import.meta.env.VITE_CLOUD_API_KEY
            }
          }
        );

        const imageUrl = response.data.secure_url
        console.log(imageUrl)

        if(cropShape === 'circular'){
          const dpData = {
            userId:user._id,
            dp:imageUrl
          }
          const res = await editDp(dpData,dispatch)
          if(res.status === 'success'){
            const userData = res.user;
            setLoading(false)
            toast.success("Profile Dp updated.");
            dispatch(editProfile({ user: userData }));
            onClose();
          }
          setLoading(false)
        }else{
          const bannerData = {
            userId:user._id,
            banner:imageUrl
          }
          const res = await editBanner(bannerData,dispatch)
          if(res.status === 'success'){
            const userData = res.user;
            setLoading(false)
            toast.success("Banner updated.");
            dispatch(editProfile({ user: userData }));
            onClose();
          }
          setLoading(false)
        }
      } catch (error:any) {
        setLoading(false)
        console.error("Failed to save changes", error);
        if (error.response) {
          console.error("Cloudinary Error Response:", error.response.data);
        }
      }
    }
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
        {loading && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
        <ScaleLoader color="black" loading={loading} cssOverride={override} aria-label="Loading Spinner" data-testid="loader" />
      </div>
      )}
      </div>
    </div>
  );
};

export default ImageCropperModal;