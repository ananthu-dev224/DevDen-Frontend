import { FC, useState, CSSProperties } from "react";
import { FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setProfile } from "../services/profile";
import { toast } from "sonner";
import { editProfile } from "../redux/reducers/userSlice";
import ScaleLoader from "react-spinners/ScaleLoader";
import { EditProfileProps } from "../types/type";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const EditProfile: FC<EditProfileProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    name: user?.name || "",
    contact: user?.contact || "",
    place: user?.place || "",
    about: user?.about || "",
    website: user?.website || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const contactPattern = /^\d+$/;
    const usernamePattern = /^[a-z0-9_]+$/;
    const websitePattern =
      /^(https?:\/\/)?([\w\d\-]+\.)+\w{2,}(\/[\w\d#?&=]*)?$/;
    const placePattern = /^[A-Za-z\s]+$/;

    if (formData.contact && !contactPattern.test(formData.contact)) {
      toast.info("Contact should only contain numbers");
      return false;
    }
    if (formData.username && !usernamePattern.test(formData.username)) {
      toast.info(
        "Username should only contain lowercase letters, numbers, and underscores"
      );
      return false;
    }
    if (formData.website && !websitePattern.test(formData.website)) {
      toast.info("Website should be a valid URL");
      return false;
    }
    if (formData.place && !placePattern.test(formData.place)) {
      toast.info("Location should only contain alphabets");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const profileData = {
      _id: user?._id,
      username: formData.username,
      name: formData.name,
      contact: formData.contact,
      place: formData.place,
      about: formData.about,
      website: formData.website,
    };
    const result = await setProfile(profileData, dispatch);
    setLoading(false);
    if (result.status === "updated") {
      const userData = result.user;
      toast.success("Profile updated successfully");
      dispatch(editProfile({ user: userData }));
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 overflow-y-auto">
        <div className="flex justify-end">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
        <form className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4 relative">
              <label className="block text-gray-700 font-semibold">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                maxLength={20}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md shadow-sm text-gray-700 mt-2 p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <div className="absolute bottom-0 right-0 text-[10px] text-gray-500 mt-1 mr-2">
                {formData.username.length}/20
              </div>
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 font-semibold">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                maxLength={40}
                onChange={handleChange}
                className="w-full border-gray-300 text-gray-700 rounded-md shadow-sm mt-2 p-2 focus:outline-none focus:border-blue-500  focus:ring-1 focus:ring-blue-500"
              />
              <div className="absolute bottom-0 right-0 text-[10px] text-gray-500 mt-1 mr-2">
                {formData.name.length}/40
              </div>
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 font-semibold">
                Contact
              </label>
              <input
                type="text"
                name="contact"
                placeholder="Enter phone no."
                value={formData.contact}
                maxLength={10}
                onChange={handleChange}
                className="w-full border-gray-300 truncate text-gray-700 rounded-md shadow-sm mt-2 p-2 focus:outline-none focus:border-blue-500  focus:ring-1 focus:ring-blue-500"
              />
              <div className="absolute bottom-0 right-0 text-[10px] text-gray-500 mt-1 mr-2">
                {formData.contact.length}/10
              </div>
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 font-semibold">
                Location
              </label>
              <input
                type="text"
                name="place"
                placeholder="Enter your location"
                value={formData.place}
                maxLength={20}
                onChange={handleChange}
                className="w-full border-gray-300 text-gray-700 rounded-md shadow-sm mt-2 p-2 focus:outline-none focus:border-blue-500  focus:ring-1 focus:ring-blue-500"
              />
              <div className="absolute bottom-0 right-0 text-[10px] text-gray-500 mt-1 mr-2">
                {formData.place.length}/20
              </div>
            </div>
            <div className="mb-4 col-span-2 relative">
              <label className="block text-gray-700 font-semibold">About</label>
              <textarea
                name="about"
                value={formData.about}
                placeholder="Tell us about yourself."
                onChange={handleChange}
                maxLength={125}
                className="w-full h-24 border-gray-300 text-gray-700 rounded-md shadow-sm mt-2 p-2 resize-none focus:outline-none focus:border-blue-500  focus:ring-1 focus:ring-blue-500"
              />
              <div className="absolute bottom-0 right-0 text-[10px] text-gray-500 mt-1 mr-2">
                {formData.about.length}/125
              </div>
            </div>
            <div className="mb-4 col-span-2 relative">
              <label className="block text-gray-700 font-semibold">
                Website
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                placeholder="Enter your website URL."
                maxLength={45}
                onChange={handleChange}
                className="w-full border-gray-300 text-gray-700 rounded-md shadow-sm mt-2 p-2 focus:outline-none focus:border-blue-500  focus:ring-1 focus:ring-blue-500"
              />
              <div className="absolute bottom-0 right-0 text-[10px] text-gray-500 mt-1 mr-2">
                {formData.website.length}/45
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-gray-900 text-white font-semibold rounded-md"
            >
              Save Changes
            </button>
          </div>
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
  );
};

export default EditProfile;