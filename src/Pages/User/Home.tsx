import { FC, useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import Card from "../../Components/Card";
import { toast } from 'sonner';
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../../services/event";

const Home: FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const dispatch = useDispatch();
  const user = useSelector((store: any) => store.user.user);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents(dispatch);
        if (response.status === "success") {
          setEvents(response.events);
        } else {
          toast.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events", error);
        toast.error("An error occurred while fetching events");
      }
    };

    fetchEvents();
  }, []);
  

  const handleFilterChange = (filter: string) => {
    setFilter(filter);
  };

  // Function to calculate "posted time" relative to current time
  const calculatePostedTime = (eventDate: Date): string => {
    const currentDateTime = new Date();
    const diffMs = currentDateTime.getTime() - eventDate.getTime();

    // Convert milliseconds to minutes
    const diffMinutes = Math.round(diffMs / (1000 * 60));

    if (diffMinutes < 1) {
      return "Now";
    } else if (diffMinutes === 1) {
      return "1 minute ago";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffMinutes < 120) {
      return "1 hour ago";
    } else if (diffMinutes < 1440) {
      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours} hours ago`;
    } else {
      return eventDate.toLocaleString();
    }
  };

  // Filter events based on the selected filter
  const filteredEvents = events.filter(event => {
    if (filter === "all") {
      return true;
    }
    if (filter === "free") {
      return event.isFree;
    }
    if (filter === "ticketed") {
      return !event.isFree;
    }
    return true;
  });

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="flex justify-between items-center pb-4">
        <div className="flex space-x-2">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                filter === "all" ? "bg-gray-800 text-white shadow-lg animate-pulse" : "bg-white text-gray-800 border border-gray-800"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange("free")}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                filter === "free" ? "bg-gray-800 text-white shadow-lg animate-pulse" : "bg-white text-gray-800 border border-gray-800"
              }`}
            >
              Free
            </button>
            <button
              onClick={() => handleFilterChange("ticketed")}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                filter === "ticketed" ? "bg-gray-800 text-white shadow-lg animate-pulse" : "bg-white text-gray-800 border border-gray-800"
              }`}
            >
              Ticketed
            </button>
          </div>
        </div>
        <div className="flex flex-col space-y-10 pb-20 md:pb-0">
          {filteredEvents.map(event => {
            const createdAtDate = new Date(event.createdAt);
            const postedTime = calculatePostedTime(createdAtDate);
            const username = user.username === event.hostId.username ? `${event.hostId.username} (You)` : event.hostId.username;
            return (
              <Card
                key={event._id}
                date={event.date}
                postedTime={postedTime}
                time={event.time}
                isFree={event.isFree}
                userProfileImage={event.hostId.dp}
                username={username}
                venue={event.venue}
                ticketPrice={event.ticketPrice}
                ticketsLeft={event.totalTickets}
                commentCount={0}
                likeCount={event.likes.length}
                image={event.image}
                description={event.description}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
