import React from "react";

interface EventDetailsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  eventTickets: any[];
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onRequestClose,
  eventTickets,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
        onClick={onRequestClose}
      ></div>
      {/* Modal Content */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 w-full max-w-2xl mx-4 relative z-50">
        <button
          onClick={onRequestClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
          {eventTickets[0] === 'free' ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h1 className="text-xl font-semibold text-gray-700">Event is free entry.</h1>
              <p className="text-gray-500 mt-2">There is nothing to show in details 📃.</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">Ticket Sales</h2>

              {/* Table for User Tickets */}
              <div className="mb-6 max-h-80 overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border px-4 py-2">Username</th>
                      <th className="border px-4 py-2">Profile</th>
                      <th className="border px-4 py-2">No. of Tickets</th>
                      <th className="border px-4 py-2">Status</th>
                      <th className="border px-4 py-2">Amount Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventTickets.map((ticket, index) => (
                      <tr key={index} className="border-t">
                        <td className="border px-4 py-2">@{ticket.userId.username}</td>
                        <td className="border px-4 py-2">
                          <img
                            src={ticket.userId.dp}
                            alt={ticket.userId.username}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </td>
                        <td className="border px-4 py-2">{ticket.numberOfTickets}</td>
                        <td className="border px-4 py-2">{ticket.status}</td>
                        <td className="border px-4 py-2">${ticket.totalCost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={onRequestClose}
                className="text-white text-sm font-medium py-2 px-4 rounded bg-indigo-600 hover:bg-indigo-700 transition duration-300"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;