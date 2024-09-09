import AdminNav from "../../Components/AdminNav";
import { FC, useState, useEffect } from "react";
import { Pagination } from "flowbite-react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { getAdminEvents, approveEvent } from "../../services/adminAuth";
import { calculatePostedTime } from "../../utils/postedTime";
import Card from "../../Components/Card";

const EventPortal: FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAdminEvents(dispatch);
        setEvents(response.events);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents();
  }, [dispatch]);

  const handleApprove = async (id: string) => {
    try {
      confirmAlert({
        title: "Confirm Alert",
        message: "Are you sure you want to approve the event?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              const response = await approveEvent(id, dispatch);
              if (response.status === "success") {
                toast.success("Event Approved! On Live...");
                setEvents(events.filter((event) => event._id !== id));
              }
            },
          },
          {
            label: "No",
          },
        ],
      });
    } catch (error) {
      console.error("Error approving event: ", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = events.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(events.length / itemsPerPage);

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <AdminNav />
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="flex flex-col space-y-10 pb-20 md:pb-0">
          {currentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-xl font-semibold text-gray-700">
                No events available in the portal
              </h1>
              <p className="text-gray-500 mt-2">
                It looks like there are no events to display at the moment.
              </p>
            </div>
          ) : (
            <>
              {currentItems.map((event) => {
                const createdAtDate = new Date(event.createdAt);
                const postedTime = calculatePostedTime(createdAtDate);
                return (
                  <div key={event._id} className="relative">
                    <Card
                      eventId={event._id}
                      date={event.date}
                      postedTime={postedTime}
                      time={event.time}
                      isFree={event.isFree}
                      userProfileImage={event.hostId.dp ? event.hostId.dp : ""}
                      username={event.hostId.username}
                      venue={event.venue}
                      ticketPrice={event.ticketPrice}
                      ticketsLeft={event.totalTickets}
                      likeCount={event.likes}
                      image={event.image}
                      description={event.description}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4  flex justify-center items-center">
                      Make Event Live on DevDen : &nbsp;
                      <button
                        onClick={() => handleApprove(event._id)}
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-center mt-4">
                {totalPages > 1 && (
                  <Pagination
                    layout="table"
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    showIcons={true}
                    className="pagination"
                    previousLabel="Previous"
                    nextLabel="Next"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPortal;