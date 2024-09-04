import { FC, useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import Card from "../../Components/Card";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../../services/event";
import { calculatePostedTime } from "../../utils/postedTime";
import { ClipLoader } from "react-spinners";
import EventCard from "../../Components/Skeletons/EventCard";

const Home: FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
      } finally {
        setLoading(false)
      }
    };

    fetchEvents();
  }, []);

  // if (loading) {
  //   return (
  //     <div className="flex flex-col justify-center items-center min-h-screen">
  //       <h1 className="mb-5 font-semibold text-gray-800">
  //         DEVDEN - CONNECT & COLLABORATE
  //       </h1>
  //       <ClipLoader color="black" loading={loading} size={50} />
  //     </div>
  //   );
  // }


  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="flex justify-between items-center pb-4"></div>
        {loading ? (
          <div className="flex flex-col space-y-10">
            <EventCard />
            <EventCard />
            <EventCard />
          </div>
        ) : (
        <div className="flex flex-col space-y-10 pb-20 md:pb-0">
          {events.map((event) => {
            const createdAtDate = new Date(event.createdAt);
            const postedTime = calculatePostedTime(createdAtDate);
            const username =
              user.username === event.hostId.username
                ? `${event.hostId.username} (You)`
                : event.hostId.username;
            return (
              <Card
                eventId={event._id}
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
                likeCount={event.likes}
                image={event.image}
                description={event.description}
              />
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
};

export default Home;