import { FC, useState, useEffect, CSSProperties } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../../Components/Navbar";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { getNotifications, clearNoti } from "../../services/notifications";
import { formatTimestamp } from "../../utils/chatTime";
import { confirmAlert } from "react-confirm-alert";
import ScaleLoader from "react-spinners/ScaleLoader";
import { toast } from "sonner";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Notifications: FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const fetchNoti = async () => {
    const res = await getNotifications(dispatch);
    if (res.status === "success") {
      setNotifications(res.notifications);
      setHistory(res.history);
    }
  };

  useEffect(() => {
    fetchNoti();
  }, []);

  const handleClearNoti = async () => {
    confirmAlert({
      title: "Confirm Alert!",
      message: "do you want to clear all notifications and history?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              setLoading(true);
              const result = await clearNoti(dispatch);
              setLoading(false);
              if (result.status === "success") {
                toast.success("Notifications cleared successfully");
                fetchNoti();
              }
            } catch (error) {
              console.error("Failed to clear notifications:", error);
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto mb-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-end">
            <button className="text-gray-600" onClick={handleClearNoti}>
              Clear all notifications and history?
            </button>
          </div>
          <TabGroup>
            <TabList className="flex border-b">
              <Tab
                className={({ selected }) =>
                  classNames(
                    "py-2 px-4 text-gray-600 focus:outline-none border-b-2",
                    selected ? "text-black border-black" : "border-transparent"
                  )
                }
              >
                All
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    "py-2 px-4 text-gray-600 focus:outline-none border-b-2",
                    selected ? "text-black border-black" : "border-transparent"
                  )
                }
              >
                Payment History
              </Tab>
            </TabList>
            <TabPanels className="mt-4">
              <TabPanel>
                <div
                  className="space-y-4 overflow-y-auto scrollbar-hide"
                  style={{ maxHeight: "calc(95vh - 200px)" }}
                >
                  {notifications.length > 0 ? (
                    notifications.map((noti) => (
                      <div
                        key={noti.id}
                        className="p-4 bg-gray-100 rounded-lg flex justify-between"
                      >
                        <p className="text-sm text-gray-700">{noti.text}</p>
                        <p className="text-xs text-gray-500">
                          {formatTimestamp(noti.createdAt)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      No notifications available.
                    </p>
                  )}
                </div>
              </TabPanel>
              <TabPanel>
                <div
                  className="space-y-4 overflow-y-auto scrollbar-hide"
                  style={{ maxHeight: "calc(95vh - 200px)" }}
                >
                  {history.length > 0 ? (
                    <div>
                      <p className="text-sm text-gray-500">
                        Showing the latest history.
                      </p>
                      {history.map((value, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-100 rounded-lg mt-4"
                        >
                          <p className="text-sm text-gray-700">{value}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">
                      No payment history available.
                    </p>
                  )}
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
        {loading && (
          <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
            <ScaleLoader
              color="black"
              loading={loading}
              cssOverride={override}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
