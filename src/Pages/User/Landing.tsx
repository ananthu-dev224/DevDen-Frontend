import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Card from "../../Components/Card";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../services/event";
import { calculatePostedTime } from "../../utils/postedTime";
import { ClipLoader } from "react-spinners";

const Landing: FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const user = useSelector((store: any) => store.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents(dispatch);
        if (response.status === "success") {
          setEvents(response.events);
        } else {
          toast.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events", error);
        toast.error("An error occurred while fetching events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, []);

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
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="flex justify-between items-center pb-4"></div>
        <div className="flex flex-col space-y-5 pb-20 md:pb-0">
        <div className="pb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Explore The Latest Tech Events In DEVDEN.
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Discover and join exciting tech events hosted by industry experts.
            Purchase your tickets and get ready to connect, learn, and
            collaborate with like-minded individuals.
          </p>
        </div>
          {events.map((event) => {
            const createdAtDate = new Date(event.createdAt);
            const postedTime = calculatePostedTime(createdAtDate);
            return (
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
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Landing;
