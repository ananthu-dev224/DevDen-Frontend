import { FC, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
  FaCalendarAlt,
  FaLink,
  FaRegAddressCard,
  FaMapMarkerAlt,
  FaCamera,
  FaWallet,
} from "react-icons/fa";
import header from "../../assets/header.jpg";
import pfp from "../../assets/pfp.jpeg";
import EditProfile from "../../Components/EditProfile";
import ImageCropperModal from "../../Components/ImageCropper";
import { toast } from "sonner";
import Card from "../../Components/Card";
import { getCreatedEvents, userSaved } from "../../services/event";
import { getFollowers, getFollowing } from "../../services/network";
import ListNetwork from "../../Components/ListNetwork";
import { calculatePostedTime } from "../../utils/postedTime";

const Profile: FC = () => {
  const [isEditProfileOpen, setEditProfileOpen] = useState(false);
  const [isCropperOpen, setCropperOpen] = useState(false);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [isListNetworkOpen, setListNetworkOpen] = useState(false);
  const [listNetworkType, setListNetworkType] = useState<
    "followers" | "following"
  >("followers");
  const [imageToCrop, setImageToCrop] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [savedEvents, setSavedEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const navigate = useNavigate();
  const [cropShape, setCropShape] = useState<"rectangular" | "circular">(
    "rectangular"
  );
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  const openEditProfile = () => setEditProfileOpen(true);
  const closeEditProfile = () => setEditProfileOpen(false);

  const openListNetwork = (type: "followers" | "following") => {
    setListNetworkType(type);
    setListNetworkOpen(true);
  };

  const closeListNetwork = () => setListNetworkOpen(false);

  const fetchEvents = async () => {
    try {
      const userId = user._id;
      const response = await getCreatedEvents(userId, dispatch);
      if (response.status === "success") {
        setEvents(response.events);
      } else {
        toast.error("Failed to fetch your events");
      }
    } catch (error) {
      console.error("Error fetching events", error);
      toast.error("An error occurred while fetching events");
    }
  };

  const fetchFollowersAndFollowing = async () => {
    try {
      const userId = user._id;
      const followersResponse = await getFollowers(userId, dispatch);
      const followingResponse = await getFollowing(userId, dispatch);

      if (followersResponse.status === "success") {
        setFollowers(followersResponse.followers);
      } else {
        toast.error("Failed to fetch followers");
      }

      if (followingResponse.status === "success") {
        setFollowing(followingResponse.following);
      } else {
        toast.error("Failed to fetch following");
      }
    } catch (error) {
      console.error("Error fetching followers and following", error);
    }
  };

  const fetchSavedEvents = async () => {
    const response = await userSaved(dispatch);
    if (response.status === "success") {
      setSavedEvents(response.saved);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchFollowersAndFollowing();
    fetchSavedEvents();
  }, [Card]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const fileInput = event.target;
      const file = event.target.files[0];
      if (
        file &&
        ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          setImageToCrop(reader.result as string);
          setCropperOpen(true);
          if (event.target.id === "profile-image-input") {
            setCropShape("circular");
          } else {
            setCropShape("rectangular");
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast.info("Please select a valid image file (jpeg, jpg, or png).");
        fileInput.value = "";
      }
    }
  };

  const handleCropperClose = () => {
    setCropperOpen(false);
    setImageToCrop("");
  };

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex-1 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="flex flex-col space-y-10 pb-20 md:pb-0">
          <div className="relative w-full">
            <img
              src={user?.banner || header}
              alt="Banner"
              className="w-full max-h-60 object-cover rounded-sm hover:cursor-pointer"
              onClick={() =>
                document.getElementById("banner-image-input")?.click()
              }
            />
            <div className="absolute left-1/2 transform -translate-x-1/2 md:left-10 -bottom-14">
              <img
                src={user?.dp || pfp}
                alt="Profile"
                className="w-28 h-28 rounded-full border-2 border-white hover:cursor-pointer"
                onClick={() =>
                  document.getElementById("profile-image-input")?.click()
                }
              />
              <label className="absolute bottom-2 right-2 cursor-pointer">
                <FaCamera className="text-gray-500" />
                <input
                  type="file"
                  id="profile-image-input"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <label className="absolute bottom-4 right-4 cursor-pointer">
              <FaCamera className="text-gray-500" />
              <input
                type="file"
                id="banner-image-input"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <div className="flex flex-col items-center md:items-start md:ml-40 mt-16 px-4 md:px-0">
            <h1 className="text-2xl font-semibold mt-4 sm:mt-0">
              @{user?.username}
            </h1>
            <div className="flex space-x-4 mt-2">
              <span
                onClick={() => openListNetwork("followers")}
                className="cursor-pointer"
              >
                <strong>{followers.length}</strong> Followers
              </span>
              <span
                onClick={() => openListNetwork("following")}
                className="cursor-pointer"
              >
                <strong>{following.length}</strong> Following
              </span>
              <span>
                <strong>{events?.length || 0}</strong> Events
              </span>
            </div>
            <div>
              <button
                className="mt-2 px-4 py-2 bg-gray-900 text-white font-semibold rounded-full"
                onClick={openEditProfile}
              >
                Edit Profile
              </button>
              <button
                className="mt-2 ml-2  px-4 py-2 bg-gray-300 text-black font-semibold rounded-full"
                onClick={() => navigate("/my-tickets")}
              >
                My tickets
              </button>
            </div>
          </div>
          <div className="px-4 md:px-0">
            <p className="text-center md:text-left font-bold mb-3">
              {user?.name || "Name"}
            </p>
            <p className="text-center md:text-left">
              {user?.about || "Member of Devden community."}
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start space-x-6 text-gray-600  px-4 md:px-0">
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="w-5 h-5" />
              <span>
                Joined:{" "}
                {user?.createdAt
                  ? new Date(parseInt(user.createdAt)).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            {user?.website && (
              <div className="flex items-center space-x-2">
                <FaLink className="w-5 h-5" />
                <span>
                  <a href={user?.website} className="text-blue-500">
                    {user?.website}
                  </a>
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <FaRegAddressCard className="w-5 h-5" />
              <span>{user?.contact || user?.email}</span>
            </div>
            {user?.place && (
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="w-5 h-5" />
                <span>{user?.place}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center px-4 md:px-0 text-green-600">
            <div className="flex items-center space-x-2">
              <FaWallet className="w-5 h-5" />
              <span>Balance: $ {user?.wallet}</span>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg">
              Withdraw
            </button>
          </div>

          <TabGroup>
            <TabList className="flex space-x-4 border-b ml-4 sm:ml-0">
              <Tab
                as="button"
                className={({ selected }) =>
                  selected
                    ? "text-gray-900 border-b-2 border-gray-900 font-bold focus:outline-none hover:bg-zinc-300 p-2"
                    : "text-gray-500"
                }
              >
                Events
              </Tab>
              <Tab
                as="button"
                className={({ selected }) =>
                  selected
                    ? "text-gray-900 border-b-2 border-gray-900 font-bold focus:outline-none hover:bg-zinc-300 p-2"
                    : "text-gray-500"
                }
              >
                Saved
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {/*Created Events*/}
                {events.length === 0 && (
                  <>
                    <div className="flex flex-col items-center justify-center h-full">
                      <h1 className="text-xl font-semibold text-gray-700">
                        No Events Hosted.
                      </h1>
                      <p className="text-gray-500 m-2">
                        DevDen helps to connect and collaborate through tech
                        events.
                      </p>
                    </div>
                  </>
                )}
                {events.map((event) => {
                  const createdAtDate = new Date(event.createdAt);
                  const postedTime = calculatePostedTime(createdAtDate);
                  return (
                    <div className="m-3" key={event._id}>
                      <Card
                        eventId={event._id}
                        key={event._id}
                        date={event.date}
                        postedTime={postedTime}
                        time={event.time}
                        isFree={event.isFree}
                        userProfileImage={event.hostId.dp}
                        username={event.hostId.username}
                        venue={event.venue}
                        ticketPrice={event.ticketPrice}
                        ticketsLeft={event.totalTickets}
                        likeCount={event.likes}
                        image={event.image}
                        description={event.description}
                        isProfile={true}
                        profileEventChange={fetchEvents}
                        fetchSaved={fetchSavedEvents}
                      />
                      {!event.isApproved && (
                        <div className="p-3 flex justify-center items-center bg-blue-500 text-white font-semibold rounded-b-lg">
                          This Event will go live until admin approve!
                        </div>
                      )}
                    </div>
                  );
                })}
              </TabPanel>
              <TabPanel>
                {selectedEvent ? (
                  <div className="m-3">
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="mb-4 px-4 py-2 bg-gray-300 text-black font-semibold rounded-lg"
                    >
                      Back to Saved Events
                    </button>
                    <Card
                      eventId={selectedEvent.eventId._id}
                      key={selectedEvent.eventId._id}
                      date={selectedEvent.eventId.date}
                      postedTime={calculatePostedTime(
                        new Date(selectedEvent.eventId.createdAt)
                      )}
                      time={selectedEvent.eventId.time}
                      isFree={selectedEvent.eventId.isFree}
                      userProfileImage={selectedEvent.eventId.hostId.dp}
                      username={selectedEvent.eventId.hostId.username}
                      venue={selectedEvent.eventId.venue}
                      ticketPrice={selectedEvent.eventId.ticketPrice}
                      ticketsLeft={selectedEvent.eventId.totalTickets}
                      likeCount={selectedEvent.eventId.likes}
                      image={selectedEvent.eventId.image}
                      description={selectedEvent.eventId.description}
                      isProfile={true}
                      fetchSaved={fetchSavedEvents}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
                    {savedEvents.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full w-full col-span-full">
                        <h1 className="text-xl font-semibold text-gray-700">
                          No Saved Events.
                        </h1>
                      </div>
                    )}
                    {savedEvents.map((event) => (
                      <div key={event.eventId._id} className="cursor-pointer">
                        <img
                          src={event.eventId.image}
                          alt={event.eventId.date}
                          className="w-full h-32 object-cover rounded-md"
                          onClick={() => setSelectedEvent(event)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
        <ListNetwork
          isOpen={isListNetworkOpen}
          onClose={closeListNetwork}
          followers={listNetworkType === "followers" ? followers : []}
          following={listNetworkType === "following" ? following : []}
        />
        <EditProfile isOpen={isEditProfileOpen} onClose={closeEditProfile} />
        <ImageCropperModal
          isOpen={isCropperOpen}
          onClose={handleCropperClose}
          imageSrc={imageToCrop}
          cropShape={cropShape}
        />
      </div>
    </div>
  );
};

export default Profile;
