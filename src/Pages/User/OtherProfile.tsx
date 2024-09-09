import { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
  getUserDetails,
  getFollowers,
  getFollowing,
  follow,
  unfollow,
} from "../../services/network";
import {
  FaCalendarAlt,
  FaLink,
  FaRegAddressCard,
  FaMapMarkerAlt,
} from "react-icons/fa";
import header from "../../assets/header.jpg";
import pfp from "../../assets/pfp.jpeg";
import Card from "../../Components/Card";
import ListNetwork from "../../Components/ListNetwork";
import { addConversation } from "../../services/chat";
import { toast } from "sonner";
import { calculatePostedTime } from "../../utils/postedTime";
import { ClipLoader } from "react-spinners";

const OtherProfile: FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [isListNetworkOpen, setListNetworkOpen] = useState(false);
  const [listNetworkType, setListNetworkType] = useState<
    "followers" | "following"
  >("followers");
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const activeUser = useSelector((store: any) => store.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    if (!userId) {
      toast.error("User not available, try again...");
      return;
    }

    if (userId === activeUser._id) {
      navigate("/profile");
      return;
    }

    try {
      const response = await getUserDetails(userId, dispatch);
      if (response.status === "success") {
        setUser(response.user);
        setEvents(response.events);
      }
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };

  const fetchFollowersAndFollowing = async () => {
    if (!userId) {
      toast.error("User not available, try again...");
      return;
    }
    try {
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

      // Check if the active user is following this profile
      const isFollowing = followersResponse.followers.some(
        (follower: any) => follower._id === activeUser._id
      );
      setIsFollowing(isFollowing);
    } catch (error) {
      console.error("Error fetching followers and following", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!userId) {
      toast.error("User not available, try again...");
      return;
    }
    try {
      if (isFollowing) {
        const unfollowRes = await unfollow({ followerId: userId }, dispatch);
        if (unfollowRes.status === "success") {
          toast.success("Unfollowed successfully");
          setFollowers((prev) =>
            prev.filter((follower) => follower._id !== activeUser._id)
          );
        }
      } else {
        const followRes = await follow({ followerId: userId }, dispatch);
        if (followRes.status === "success") {
          toast.success("Followed successfully");
          setFollowers((prev) => [...prev, activeUser]);
        }
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow", error);
      toast.error("Failed to update follow status");
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchFollowersAndFollowing();
  }, [userId]);

  const openListNetwork = (type: "followers" | "following") => {
    setListNetworkType(type);
    setListNetworkOpen(true);
  };

  const closeListNetwork = () => setListNetworkOpen(false);

  const handleMessage = async () => {
    const data = {
      recieverId: userId,
    };
    const res = await addConversation(data, dispatch);
    if (res.status === "success") {
      navigate(`/chat?conversationId=${res.conversation._id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="mb-5 font-semibold text-gray-800">
          DEVDEN - CONNECT & COLLABORATE
        </h1>
        <ClipLoader color="black" loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex-1 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="flex flex-col space-y-10 pb-20 md:pb-0">
          <div className="relative w-full">
            <img
              src={user?.banner || header}
              alt="Banner"
              className="w-full max-h-60 object-cover rounded-sm"
            />
            <div className="absolute left-1/2 transform -translate-x-1/2 md:left-10 -bottom-14">
              <img
                src={user?.dp || pfp}
                alt="Profile"
                className="w-28 h-28 rounded-full border-2 border-white"
              />
            </div>
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
                onClick={handleFollowToggle}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
              {isFollowing && (
                <button
                  onClick={handleMessage}
                  className="mt-2 ml-3 px-4 py-2 text-green-800 ring-1 ring-green-800 font-semibold rounded-full"
                >
                  Message
                </button>
              )}
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
          <div className="flex flex-wrap justify-center md:justify-start space-x-6 text-gray-600 px-4 md:px-0">
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
            </TabList>
            <TabPanels>
              <TabPanel>
                {events?.map((event: any) => {
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
                        isProfile={false}
                      />
                    </div>
                  );
                })}
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
      </div>
    </div>
  );
};

export default OtherProfile;