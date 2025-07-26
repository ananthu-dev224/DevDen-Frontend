import { FC, useState, ChangeEvent, CSSProperties } from "react";
import Navbar from "../../Components/Navbar";
import EventCrop from "../../Components/EventCrop";
import MapPicker from "../../Components/MapPicker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { generateSign } from "../../services/profile";
import { addEvent } from "../../services/event";
import { EventData } from "../../types/type";
import ScaleLoader from "react-spinners/ScaleLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const CreateEvent: FC = () => {
  const [eventData, setEventData] = useState<EventData>({
    image: "",
    description: "",
    date: "",
    time: "",
    venue: null,
    isFree: false,
    totalTickets: 0,
    ticketPrice: 0,
  });
  const [loading, setLoading] = useState(false);
  const [venuename, setVenuename] = useState(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((store: any) => store.user.user);
  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = e.target.files?.[0];
    // Validate that the file is jpeg, jpg, or png
    if (file && ["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
      setShowCropper(true);
    } else {
      toast.info("Please select a valid image file (jpeg, jpg, or png).");
      fileInput.value = "";
    }
  };

  const handleCropComplete = (croppedImage: string, imageBlob: Blob) => {
    setEventData({ ...eventData, image: croppedImage });
    setImagePreview(croppedImage);
    setBlob(imageBlob);
  };

  const validateForm = () => {
    const {
      image,
      description,
      date,
      time,
      venue,
      isFree,
      totalTickets,
      ticketPrice,
    } = eventData;

    if (!image || !description || !date || !time || !venue) {
      return false;
    }
    if (!isFree && (!totalTickets || !ticketPrice)) {
      return false;
    }
    return true;
  };

  const handleLocationSelect = async (coords: { lat: number; lng: number }) => {
    try {
      // Reverse geocode using Google Maps API
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
      );

      const data = await res.json();
      const address = data.display_name || "Unknown location";

      setEventData((prev: any) => ({
        ...prev,
        venue: coords,
      }));

      setVenuename(address);
    } catch (error) {
      console.error("Failed to fetch venue name:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      toast.info("Please fill out all required fields.");
      return;
    }

    const { signature, timestamp } = await generateSign(dispatch);

    // Upload to Cloudinary
    const formData = new FormData();
    if (blob) {
      formData.append("file", blob, "cropped-image.jpg");
    }
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET || "");
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME || "");
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUD_NAME
      }/image/upload`,
      formData,
      {
        params: {
          api_key: import.meta.env.VITE_CLOUD_API_KEY,
        },
      }
    );

    const imageUrl = response.data.secure_url;
    let data;
    if (!eventData.isFree) {
      data = {
        hostId: user?._id,
        image: imageUrl,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        venue: eventData.venue,
        isFree: eventData.isFree,
        totalTickets: eventData.totalTickets,
        ticketPrice: eventData.ticketPrice,
      };
    } else {
      data = {
        hostId: user?._id,
        image: imageUrl,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        venue: eventData.venue,
        isFree: eventData.isFree,
      };
    }
    const result = await addEvent(data, dispatch);
    setLoading(false);
    if (result.status === "success") {
      toast.success("Event created successfully");
      navigate("/");
    }
  };

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="flex flex-col space-y-10 pb-20 md:pb-0">
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
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
                    <img
                      src={imagePreview}
                      alt="Event Preview"
                      className="w-full h-auto object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="venue"
                  className="block text-sm font-medium text-gray-700"
                >
                  Choose Venue :
                </label>
                {/* <input
                  type="text"
                  name="venue"
                  id="venue"
                  maxLength={50}
                  value={eventData.venue}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm h-12"
                /> */}
                <MapPicker onLocationSelect={handleLocationSelect} />
                {eventData.venue && (
                  <label
                    htmlFor="venue"
                    className="flex text-sm font-medium text-gray-700"
                  >
                    Selected Venue :
                    <p className="ml-3 text-sm text-blue-600 underline">
                      {venuename}
                    </p>
                  </label>
                )}
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
                <label
                  htmlFor="isFree"
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  Free Event
                </label>
              </div>
              {!eventData.isFree && (
                <>
                  <div>
                    <label
                      htmlFor="totalTickets"
                      className="block text-sm font-medium text-gray-700"
                    >
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
                    <label
                      htmlFor="ticketPrice"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Ticket Price (Note: A 5% commission will be applied to one
                      purchase)
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
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Event
              </button>
            </form>
          </div>
          {loading && (
            <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
              <ScaleLoader
                color="black"
                loading={loading}
                cssOverride={override}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          )}
        </div>
      </div>
      {showCropper && imageSrc && (
        <EventCrop
          imageSrc={imageSrc}
          onCropComplete={handleCropComplete}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
};

export default CreateEvent;
