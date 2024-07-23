import { FC , useState} from "react";
import pfp from '../assets/pfp.jpeg'
import ReportModal from "./Report";
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
import { confirmAlert } from 'react-confirm-alert';
import { useDispatch } from "react-redux";
import { abortEvent } from "../services/event";
import {toast} from 'sonner'
import EditEventModal from "./EditEventModal";
interface CardProps {
  eventId: string;
  userProfileImage: string;
  username: string;
  postedTime: string;
  image: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  isFree: boolean;
  ticketsLeft?: number;
  ticketPrice?: number;
  likeCount: number;
  commentCount: number;
  isProfile?:boolean;
  profileEventChange?: () => void;
}

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
  commentCount,
  isProfile,
  profileEventChange
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isReport, setReport] = useState(false);
  const [isEditModal,setEditModal] = useState(false);
  const dispatch = useDispatch()

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

  const openReportModal = () => {
    setReport(true);
    setDropdownOpen(false);
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
        <FaEllipsisV className="text-gray-500 cursor-pointer" onClick={() => setDropdownOpen(prev => !prev)} />
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
                  title: 'Confirm to Abort the Event',
                  message: 'This Action cant be undone , if the event has tickets then all the tickets will be refunded!',
                  buttons: [
                    {
                      label: 'Yes',
                      onClick: async() => {
                          const result = await abortEvent(eventId,dispatch)
                          if(result.status === 'success'){
                            if(profileEventChange){
                              profileEventChange();
                            }
                            toast.success("Event aborted successfully.")
                          }
                      }
                    },
                    {
                      label: 'No',
                    }
                  ]
                });
              }}
              onDetails={() => {
                // Logic for showing details
              }}
              onEdit={() => {
                setEditModal(true)
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
          <div className="flex justify-end text-gray-600 mb-4">
            <span>&#8377;{ticketPrice} per ticket</span>
          </div>
        )}
        <div className="flex justify-between items-center mt-7">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaHeart className="text-gray-500 hover:text-red-500 transition duration-300 mr-1 cursor-pointer" />
              <span>{likeCount}</span>
            </div>
            <div className="flex items-center">
              <FaComment className="text-gray-500 hover:text-blue-500 transition duration-300 mr-1 cursor-pointer" />
              <span>{commentCount}</span>
            </div>
            <FaBookmark className="text-gray-500 hover:text-yellow-500 transition duration-300 cursor-pointer" />
          </div>
          {ticketPrice && !isFree && (
            <button className="text-white text-sm font-medium py-2 px-4 rounded  bg-indigo-600 hover:bg-indigo-700 transition duration-300">
              Buy Ticket
            </button>
          )}
        </div>
        <ReportModal
        isOpen={isReport}
        onRequestClose={() => setReport(false)}
      />
      <EditEventModal profileEventChange={profileEventChange} showModal={isEditModal} closeModal={() => setEditModal(false)} initialEventData={initialEventData}/>
      </div>
    </div>
  );
};

export default Card;