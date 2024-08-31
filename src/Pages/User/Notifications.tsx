import { FC, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../../Components/Navbar";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { getNotifications } from "../../services/notifications";
import { formatTimestamp } from "../../utils/chatTime";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Notifications: FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchNoti = async () => {
      const res = await getNotifications(dispatch);
      if (res.status === "success") {
        setNotifications(res.notifications);
        setHistory(res.history);
      }
    };

    fetchNoti();
  }, []);

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto mb-6">
        <div className="bg-white shadow-md rounded-lg p-4">
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
                <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((noti) => (
                      <div key={noti.id} className="p-4 bg-gray-100 rounded-lg flex justify-between">
                        <p className="text-sm text-gray-700">
                          {noti.text}
                        </p>
                        <p className="text-xs text-gray-500">{formatTimestamp(noti.createdAt)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No notifications available.</p>
                  )}
                </div>
              </TabPanel>
              <TabPanel>
                <div className="space-y-4">
                {history.length > 0 ? (
                     <div>
                     <p className="text-sm text-gray-500">Showing the latest history.</p>
                     {history.map((value, index) => (
                       <div key={index} className="p-4 bg-gray-100 rounded-lg mt-4">
                         <p className="text-sm text-gray-700">{value}</p>
                       </div>
                     ))}
                   </div>
                  ) : (
                    <p className="text-center text-gray-500">No payment history available.</p>
                  )}
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
