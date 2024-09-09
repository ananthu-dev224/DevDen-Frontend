import { FC, useState, useEffect, CSSProperties } from "react";
import pfp from "../assets/pfp.jpeg";
import ReportModal from "./Report";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  FaEllipsisV,
  FaHeart,
  FaComment,
  FaBookmark,
  FaTicketAlt,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import DotDropdown from "./DotDropdown";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  abortEvent,
  likeEvent,
  saveEvent,
  checkSaved,
} from "../services/event";
import { eventDetails } from "../services/ticket";
import { toast } from "sonner";
import EditEventModal from "./EditEventModal";
import CommentModal from "./CommentModal";
import BuyTicketModal from "./BuyTicket";
import { CardProps } from "../types/type";
import EventDetailsModal from "./EventDetails";
import { ScaleLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const Card: FC<CardProps> = ({
  eventId,
  userProfileImage,
  username,
  postedTime,
  image,
  description,
  date,
  time,
  venue,
  isFree,
  ticketsLeft,
  ticketPrice,
  likeCount,
  isProfile,
  profileEventChange,
  fetchSaved,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isReport, setReport] = useState(false);
  const [isEditModal, setEditModal] = useState(false);
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [showDetails, setshowDetails] = useState(false);
  const [details, setDetails] = useState(["free"]);
  const [isBuyTicketsModalOpen, setBuyTicketsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(likeCount);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const user = useSelector((store: any) => store.user.user);

  const initialEventData = {
    eventId,
    image,
    description,
    date,
    time,
    venue,
    isFree,
    totalTickets: ticketsLeft || 0,
    ticketPrice: ticketPrice || 0,
  };

  useEffect(() => {
    if (user?._id) {
      const checkIfSaved = async () => {
        const result = await checkSaved(eventId, dispatch);
        if (result.status === "success") {
          setIsSaved(result.isSaved);
        }
      };

      checkIfSaved();
    }
  }, [eventId, user?._id, dispatch]);

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

  const openReportModal = () => {
    setReport(true);
    setDropdownOpen(false);
  };

  const handleLike = async () => {
    const likeData = {
      eventId,
    };

    const result = await likeEvent(likeData, dispatch);
    if (result.status === "success") {
      if (likes.includes(user._id)) {
        setLikes(likes.filter((id: string) => id !== user._id));
      } else {
        setLikes([...likes, user._id]);
      }
    }
  };

  const handleSave = async () => {
    const saveData = {
      eventId,
    };

    const result = await saveEvent(saveData, dispatch);
    if (result.status === "success") {
      setIsSaved(!isSaved);
      if (fetchSaved) {
        fetchSaved();
      }
      toast.success(isSaved ? "Event unsaved" : "Event saved");
    }
  };
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <img
            src={userProfileImage ? userProfileImage : pfp}
            alt={username}
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-2">
            <span className="font-semibold">{username}</span>
            <span className="block text-sm text-gray-500">{postedTime}</span>
          </div>
        </div>
        <FaEllipsisV
          className="text-gray-500 cursor-pointer"
          onClick={() => setDropdownOpen((prev) => !prev)}
        />
        {isDropdownOpen && !isProfile && (
          <DotDropdown
            onReport={openReportModal}
            onClose={() => setDropdownOpen(false)}
          />
        )}
        {isDropdownOpen && isProfile && (
          <DotDropdown
            isProfile={true}
            onAbort={() => {
              confirmAlert({
                title: "Confirm to Abort the Event",
                message:
                  "This Action cant be undone , if the event has tickets then all the tickets will be refunded!",
                buttons: [
                  {
                    label: "Yes",
                    onClick: async () => {
                      setLoading(true);
                      const result = await abortEvent(eventId, dispatch);
                      setLoading(false);
                      if (result.status === "success") {
                        if (profileEventChange) {
                          profileEventChange();
                        }
                        toast.success(result.message);
                      }
                    },
                  },
                  {
                    label: "No",
                  },
                ],
              });
            }}
            onDetails={async () => {
              if (!isFree) {
                const result = await eventDetails(eventId, dispatch);
                setDetails(result.details);
              }
              setshowDetails(true);
            }}
            onEdit={() => {
              setEditModal(true);
            }}
            onClose={() => setDropdownOpen(false)}
          />
        )}
      </div>
      <div className="w-full h-auto">
        <img src={image} alt="Event" className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <p className="text-gray-700 mb-4">{description}</p>
        <div className="flex justify-between text-gray-600 mb-2">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <FaClock className="mr-2 animate-rotate" />
            <span>{time}</span>
          </div>
        </div>
        <div className="flex justify-between text-gray-600 mb-2">
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2" />
            <span>{venue}</span>
          </div>
          {isFree ? (
            <span>Free</span>
          ) : (
            <div className="flex items-center">
              <FaTicketAlt className="mr-2 text-green-500" />
              <span>{ticketsLeft} Left</span>
            </div>
          )}
        </div>
        {ticketPrice && !isFree && (
          <div className="flex justify-end text-green-600 font-semibold mb-4">
            <span>${ticketPrice} per ticket</span>
          </div>
        )}
        <div className="flex justify-between items-center mt-7">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaHeart
                className={`text-gray-500 hover:text-red-500 transition duration-300 mr-1 cursor-pointer ${
                  user && likes.includes(user._id) ? "text-red-500" : ""
                }`}
                onClick={handleLike}
              />
              <span>{likes.length}</span>
            </div>
            <div className="flex items-center">
              <FaComment
                className="text-gray-500 hover:text-blue-500 transition duration-300 mr-1 cursor-pointer"
                onClick={() => setCommentModalOpen(true)}
              />
            </div>
            <FaBookmark
              className={`text-gray-500 hover:text-yellow-500 transition duration-300 cursor-pointer ${
                isSaved ? "text-yellow-500" : ""
              }`}
              onClick={handleSave}
            />
          </div>
          {ticketPrice && !isFree && (
            <button
              className="text-white text-sm font-medium py-2 px-4 rounded  bg-indigo-600 hover:bg-indigo-700 transition duration-300"
              onClick={() => setBuyTicketsModalOpen(true)}
            >
              Buy Ticket
            </button>
          )}
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
        <ReportModal
          isOpen={isReport}
          onRequestClose={() => setReport(false)}
          category="event"
          id={eventId}
        />
        <CommentModal
          eventId={eventId}
          isOpen={isCommentModalOpen}
          onRequestClose={() => setCommentModalOpen(false)}
        />
        <EventDetailsModal
          eventTickets={details}
          isOpen={showDetails}
          onRequestClose={() => setshowDetails(false)}
        />
        <Elements stripe={stripePromise}>
          <BuyTicketModal
            isOpen={isBuyTicketsModalOpen}
            onRequestClose={() => setBuyTicketsModalOpen(false)}
            ticketPrice={ticketPrice || 0}
            eventImg={image}
            eventId={eventId}
          />
        </Elements>
        <EditEventModal
          profileEventChange={profileEventChange}
          showModal={isEditModal}
          closeModal={() => setEditModal(false)}
          initialEventData={initialEventData}
        />
      </div>
    </div>
  );
};

export default Card;