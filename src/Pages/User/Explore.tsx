import { FC, useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import Navbar from "../../Components/Navbar";
import { searchUsers } from "../../services/network";
import { getAllEvents } from "../../services/event";
import Card from "../../Components/Card";
import pfp from "../../assets/pfp.jpeg";
import { calculatePostedTime } from "../../utils/postedTime";
import EventCardSkeleton from "../../Components/Skeletons/ExploreCard";
import { Link } from "react-router-dom";

const Explore: FC = () => {
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [clickedEvent, setClickedEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [eventLoading, setEventLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await getAllEvents(dispatch);
      if (res.status === "success") {
        setEvents(res.events);
      }
      setLoading(false);
      setEventLoading(false);
    };

    fetchEvents();
  }, [dispatch]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);

    if (query.length > 0 && query.trim().length > 0) {
      setLoading(true);
      const res = await searchUsers(query, dispatch);
      if (res.status === "success") {
        setUsers(res.users);
      }
      setLoading(false);
    } else {
      setUsers([]);
    }
  };

  const handleEventClick = (event: any) => {
    setClickedEvent(event);
  };

  const orderedEvents = clickedEvent
    ? [
        clickedEvent,
        ...events.filter((event) => event._id !== clickedEvent._id),
      ]
    : events;

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="flex flex-col space-y-10 pb-20 md:pb-0">
          <div className="flex justify-between items-center mb-4">
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search people..."
              className="p-2 w-full border border-gray-200 rounded focus:border-green-500 outline-none"
            />
          </div>
          {eventLoading && (
            <>
              <div className="flex flex-wrap gap-4">
                {Array.from({ length: 9 }).map((_, index) => (
                  <EventCardSkeleton key={index} />
                ))}
              </div>
            </>
          )}
          {loading && <div>Searching...</div>}
          {search.length > 2 && users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user) => (
                <Link to={`/profile/${user._id}`}>
                  <div
                    key={user._id}
                    className="flex items-center border-b border-gray-300 p-2"
                  >
                    <img
                      src={user.dp ? user.dp : pfp}
                      alt={user.username}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-bold">{user.username}</div>
                      <div className="text-gray-500">{user.name}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div>
              {clickedEvent ? (
                <>
                  <button
                    onClick={() => setClickedEvent(null)}
                    className="mb-4"
                  >
                    <FaArrowLeft />
                  </button>
                  {orderedEvents.map((event) => (
                    <div key={event._id} className="mb-5">
                      <Card
                        eventId={event._id}
                        date={event.date}
                        postedTime={calculatePostedTime(
                          new Date(event.createdAt)
                        )}
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
                      />
                    </div>
                  ))}
                </>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 mt-5">
                  {events.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full w-full col-span-full">
                      <h1 className="text-xl font-semibold text-gray-700">
                        No Events Available.
                      </h1>
                    </div>
                  )}
                  {events.map((event) => (
                    <div key={event._id} className="relative cursor-pointer">
                      <img
                        src={event.image}
                        alt={event.date}
                        className="w-full h-full object-cover"
                        onClick={() => handleEventClick(event)}
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity"
                        onClick={() => handleEventClick(event)}
                      >
                        <span className="text-white text-lg font-semibold">
                          {event.likes.length}
                        </span>
                        <p className="text-white ml-2">
                          <FaHeart />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {search.length > 0 && users.length === 0 && <div>No users found</div>}
        </div>
      </div>
    </div>
  );
};

export default Explore;