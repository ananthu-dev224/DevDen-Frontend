import { FC, useEffect, useState, useCallback } from "react";
import Navbar from "../../Components/Navbar";
import Card from "../../Components/Card";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { getEvents, getTopHosts } from "../../services/event";
import { calculatePostedTime } from "../../utils/postedTime";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import pfp from "../../assets/pfp.jpeg";

const Home: FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [hosts, setHosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [initialLoadComplete, setInitialLoadComplete] =
    useState<boolean>(false);
  const dispatch = useDispatch();
  const user = useSelector((store: any) => store.user.user);

  const fetchEvents = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const response = await getEvents(dispatch, page);
        if (response.status === "success") {
          const { events: newEvents, pagination } = response;
          console.log(`Received events for page ${page}:`, newEvents);
          setEvents((prevEvents) => {
            return page === 1 ? newEvents : [...prevEvents, ...newEvents];
          });
          setTotalPages(pagination.totalPages);
          setHasMore(page < pagination.totalPages);
        } else {
          toast.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events", error);
        toast.error("An error occurred while fetching events");
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100 &&
      !loading &&
      hasMore
    ) {
      setLoading(true);
      setTimeout(() => {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          console.log(`Fetching page ${nextPage}`);
          fetchEvents(nextPage);
          return nextPage;
        });
      }, 1000); // 1-second delay for loading animation
    }
  }, [loading, hasMore, fetchEvents]);

  useEffect(() => {
    if (!initialLoadComplete) {
      fetchEvents(page); // Initial fetch
      setInitialLoadComplete(true);
    }
  }, [fetchEvents, page, initialLoadComplete]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    const fetchHosts = async () => {
      const res = await getTopHosts(dispatch);
      if (res.status === "success") {
        setHosts(res.data);
      }
    };
    fetchHosts();
  },[dispatch])


  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-lg font-bold animate-fadeIn">Most Popular Hosts</h1>
        </div>

        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {hosts.map((host, index) => (
            <Link to={`/profile/${host._id}`}>
              <div className="flex flex-col items-center" key={index}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-blue-500 animate-fadeIn">
                  <img
                    src={host.dp || pfp}
                    alt="host pfp"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm sm:text-md font-medium mt-2 mb-5">
                  @{host.username}
                </span>
              </div>
            </Link>
          ))}
        </div>
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
          {loading && (
            <div className="flex justify-center items-center">
              <ClipLoader color="black" loading={true} size={30} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;