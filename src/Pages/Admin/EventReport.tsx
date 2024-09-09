import AdminNav from "../../Components/AdminNav";
import { FC, useState, useEffect } from "react";
import { Pagination } from "flowbite-react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { getEventReports, toggleEvent } from "../../services/adminAuth";

const EventReport: FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const dispatch = useDispatch();

  const fetchEvents = async () => {
    try {
      const response = await getEventReports(dispatch);
      setEvents(response.events);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleBlockUnblock = async (id: string) => {
    try {
      confirmAlert({
        title: "Confirm Alert",
        message: "Are you sure you want to restrict/unrestrict this event?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              const response = await toggleEvent(id, dispatch);
              if (response.status === "success") {
                toast.success("Event status changed success.");
                fetchEvents();
              }
            },
          },
          {
            label: "No",
          },
        ],
      });
    } catch (error) {
      console.error("Error toggling event status: ", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredEvents = events.filter((event) =>
    event.reportType.toLowerCase().startsWith(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <AdminNav />
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="flex flex-col space-y-10 pb-20 md:pb-0">
          <div className="flex justify-between items-center mb-4">
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search by report type..."
              className="p-2 w-full border border-gray-200 rounded focus:border-green-500 outline-none"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 md:p-4 border-b border-gray-200">
                    Status
                  </th>
                  <th className="p-2 md:p-4 border-b border-gray-200">Count</th>
                  <th className="p-2 md:p-4 border-b border-gray-200">Type</th>
                  <th className="p-2 md:p-4 border-b border-gray-200">
                    Event Date
                  </th>
                  <th className="p-2 md:p-4 border-b border-gray-200">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-100">
                    <td
                      className={`p-2 md:p-4 border-b border-gray-200 font-medium ${
                        event.eventId.isActive
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {event.eventId.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="p-2 md:p-4 border-b border-gray-200">
                      <span className="bg-red-500 text-white rounded-full px-3 py-1 text-center w-8 h-8 flex items-center justify-center">
                        {event.count}
                      </span>
                    </td>
                    <td className="p-2 md:p-4 border-b border-gray-200">
                      {event.reportType}
                    </td>
                    <td className="p-2 md:p-4 border-b border-gray-200">
                      {event.eventId.date}
                    </td>
                    <td className="p-2 md:p-4 border-b border-gray-200">
                      <button
                        className="px-2 py-1 bg-gray-900 text-white font-semibold rounded"
                        onClick={() => handleBlockUnblock(event.eventId)}
                      >
                        {event.eventId.isActive ? "Restrict" : "Undo Restrict"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventReport;