import { FC, useState, useEffect, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { userTickets, cancelTicket } from "../services/ticket";
import { Pagination } from "flowbite-react";
import { confirmAlert } from "react-confirm-alert";
import { downloadTicket } from "../services/ticket";
import { toast } from "sonner";

const TicketCard: FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ticketsPerPage] = useState<number>(2);
  const dispatch = useDispatch();

  const fetchTickets = async () => {
    try {
      const response = await userTickets(dispatch);
      setTickets(response.tickets);
      setFilteredTickets(response.tickets);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [dispatch]);

  // Search handler
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term === "") {
      setFilteredTickets(tickets);
    } else {
      const filtered = tickets.filter((ticket) =>
        ticket.ticketId.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredTickets(filtered);
    }
    setCurrentPage(1); // Reset to first page on search
  };

  // Paginate tickets
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );

  // Change page handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCancelTicket = async (ticketId: string) => {
    confirmAlert({
      title: `Confirm to cancel ticket #${ticketId}?`,
      message:
        "Cancellations can be made up to one day before the event, with a full refund provided.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const cancelData = { ticketId };
              const result = await cancelTicket(cancelData, dispatch);
              if (result.status === "success") {
                toast.success(result.message);
                fetchTickets();
              }
            } catch (error) {
              console.error("Failed to cancel ticket:", error);
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handleDownload = async (ticketId: string) => {
    await downloadTicket(ticketId, dispatch);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <input
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by ticket id..."
          className="p-2 w-full border border-gray-200 rounded focus:border-green-500 outline-none"
        />
      </div>
      {/* Tickets */}
      {filteredTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-xl font-semibold text-gray-700">
            No tickets available.
          </h1>
          <p className="text-gray-500 mt-2">
            Checkout the latest events and snatch the tickets 🎫.
          </p>
        </div>
      ) : (
        <>
          {currentTickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white border border-gray-300 rounded-lg shadow-md p-6 flex flex-col md:flex-row items-start mb-6"
            >
              {/* Event Image */}
              <div className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                <img
                  src={ticket.eventId.image}
                  alt="Event"
                  className="w-full object-fill rounded-lg border border-gray-200"
                />
                <p className="text-2xl font-bold text-gray-800 text-center mt-4">
                  Ticket ID: #{ticket.ticketId}
                </p>
              </div>

              {/* Ticket Details */}
              <div className="w-full md:w-2/3 flex flex-col justify-between">
                <div className="flex flex-col md:flex-row justify-between mb-6">
                  <div className="flex flex-col mb-4 md:mb-0">
                    <p className="text-gray-700 mb-1">
                      <strong>Admit: </strong>
                      {ticket.numberOfTickets}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Hosted by: </strong>@
                      {ticket.eventId.hostId.username}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Total Cost: </strong>${ticket.totalCost}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Event Venue: </strong>
                      {ticket.eventId.venue}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Event Date: </strong>
                      {ticket.eventId.date}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Event Time: </strong>
                      {ticket.eventId.time}
                    </p>
                    <p
                      className={`mb-2 ${
                        ticket.status === "Purchased"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      <strong>Status: </strong>
                      {ticket.status}
                    </p>
                  </div>

                  {/* QR Code */}
                  {ticket.qrCode && (
                    <div className="flex justify-center items-center md:w-1/3">
                      <img
                        src={ticket.qrCode}
                        alt="QR Code"
                        className="w-40 h-40 border border-gray-300 rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row justify-between">
                  {ticket.status === "Purchased" && (
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                      <button
                        onClick={() => handleCancelTicket(ticket.ticketId)}
                        className="text-white text-sm font-medium py-2 px-4 rounded bg-red-600 hover:bg-red-700 transition duration-300"
                      >
                        Cancel Ticket
                      </button>
                      <button
                        onClick={() => handleDownload(ticket.ticketId)}
                        className="text-white text-sm font-medium py-2 px-4 rounded bg-indigo-600 hover:bg-indigo-700 transition duration-300"
                      >
                        Download
                      </button>
                    </div>
                  )}
                  {ticket.status === "Cancelled" && (
                    <p className="text-lg font-bold text-red-800 text-center">
                      Ticket cancelled, Amount refunded ✅
                    </p>
                  )}
                  {ticket.status === "Aborted" && (
                    <p className="text-lg font-bold text-red-800 text-center">
                      Event is Aborted by the host, Ticket amount is refunded ✅
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredTickets.length / ticketsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </>
  );
};

export default TicketCard;
