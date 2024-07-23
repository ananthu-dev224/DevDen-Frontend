import React, { useState, FC, CSSProperties } from 'react';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { useDispatch, useSelector } from 'react-redux';
import {toast} from 'sonner';
import axios from "axios";
import { generateSign } from '../services/profile';
import { updateEvent } from '../services/event';
import EventCrop from './EventCrop';

interface EditEventModalProps {
  showModal: boolean;
  closeModal: () => void;
  profileEventChange?: () => void;
  initialEventData: {
    eventId: string;
    description: string;
    image: string;
    date: string;
    time: string;
    venue: string;
    isFree: boolean;
    totalTickets?: number;
    ticketPrice?: number;
  };
}

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const EditEventModal: FC<EditEventModalProps> = ({ showModal, closeModal, initialEventData, profileEventChange }) => {
  const [eventData, setEventData] = useState(initialEventData);
  const [imagePreview, setImagePreview] = useState(initialEventData.image ? initialEventData.image : "");
  const [loading, setLoading] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const dispatch = useDispatch();
  const user = useSelector((store: any) => store.user.user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setEventData({
        ...eventData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setEventData({
        ...eventData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
      setShowCropper(true);
    }
  };

  const handleCropComplete = (croppedImage: string, imageBlob: Blob) => {
    setImagePreview(croppedImage);
    setBlob(imageBlob);
  };

  const validateForm = () => {
    const { image, description, date, time, venue, isFree, totalTickets, ticketPrice } = eventData;
    if (!image || !description || !date || !time || !venue) {
      return false;
    }
    if (!isFree && (!totalTickets || !ticketPrice)) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false)
      toast.info("Please fill out all required fields.");
      return;
    }

    let imageUrl = eventData.image;

    if (blob) {
      // Upload the new image to Cloudinary
      const { signature, timestamp } = await generateSign(dispatch);
      const formData = new FormData();
      formData.append("file", blob, "cropped-image.jpg");
      formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET || "");
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME || "");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
        formData,
        {
          params: {
            api_key: import.meta.env.VITE_CLOUD_API_KEY,
          },
        }
      );

      imageUrl = response.data.secure_url;
    }

    const data = {
      eventId: eventData.eventId,
      hostId: user?._id,
      image: imageUrl,
      description: eventData.description,
      date: eventData.date,
      time: eventData.time,
      venue: eventData.venue,
      isFree: eventData.isFree,
      totalTickets: eventData.isFree ? undefined : eventData.totalTickets,
      ticketPrice: eventData.isFree ? undefined : eventData.ticketPrice,
    };

    const result = await updateEvent(data, dispatch);
    setLoading(false);
    if (result.status === 'success') {
      toast.success("Event updated successfully");
      closeModal();
      if(profileEventChange){
        profileEventChange();
      }
    } else {
      toast.error("Failed to update event");
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white border border-gray-300 rounded-lg p-6 w-full max-w-2xl mx-4 my-8 relative">
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          &times;
        </button>
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto mr-3 p-3">
          <form className="space-y-6">
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Event Image
              </label>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm h-12"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img src={imagePreview} alt="Event Preview" className="w-full h-auto object-cover rounded-md" />
                </div>
              )}
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={eventData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm h-20"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Event Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                value={eventData.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm h-12"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Event Time
              </label>
              <input
                type="time"
                name="time"
                id="time"
                value={eventData.time}
                onChange={handleChange}
                className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm h-12"
              />
            </div>
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
                Venue
              </label>
              <input
                type="text"
                name="venue"
                id="venue"
                maxLength={50}
                value={eventData.venue}
                onChange={handleChange}
                className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm h-12"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isFree"
                id="isFree"
                checked={eventData.isFree}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded-sm focus:ring-0 focus:ring-transparent"
              />
              <label htmlFor="isFree" className="ml-2 block text-sm font-medium text-gray-700">
                Free Event
              </label>
            </div>
            {!eventData.isFree && (
              <>
                <div>
                  <label htmlFor="totalTickets" className="block text-sm font-medium text-gray-700">
                    Total Tickets
                  </label>
                  <input
                    type="number"
                    name="totalTickets"
                    id="totalTickets"
                    value={eventData.totalTickets}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm h-12"
                  />
                </div>
                <div>
                  <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700">
                    Ticket Price
                  </label>
                  <input
                    type="number"
                    name="ticketPrice"
                    id="ticketPrice"
                    value={eventData.ticketPrice}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm h-12"
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              onClick={handleSubmit}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Event
            </button>
          </form>
          {loading && (
            <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
              <ScaleLoader color="black" loading={loading} cssOverride={override} aria-label="Loading Spinner" data-testid="loader" />
            </div>
          )}
        </div>
      </div>
      {showCropper && imageSrc && (
        <EventCrop
          imageSrc={imageSrc}
          onClose={() => setShowCropper(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};

export default EditEventModal;