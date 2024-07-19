import { FC, useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import Card from "../../Components/Card";
import { toast } from 'sonner';
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../../services/event";

const Home: FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const dispatch = useDispatch()
  const user = useSelector((store:any) => store.user.user)
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

    const interval = setInterval(() => {
      toast.info("Please note: Ticket sales end the day before the event at 11:59 PM.");
    }, 15 * 60 * 1000); // 15 minutes interval

    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="flex flex-col space-y-10 pb-20 md:pb-0">
        {events.map(event => {
       const createdAtDate = new Date(event.createdAt);
       console.log("Created At:", createdAtDate);
       console.log("Current Time:", new Date());
       console.log("Difference (ms):", new Date().getTime() - createdAtDate.getTime());
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