import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AdminNav from "../../Components/AdminNav";
import { Line, Bar } from "react-chartjs-2";
import { getDashboard } from "../../services/adminAuth";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement, // Import BarElement
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, // Register BarElement
  Title,
  Tooltip,
  Legend
);

const Dashboard: FC = () => {
  const [totalCommission, setTotalCommission] = useState(0);
  const [totalUsersActive, setTotalUsersActive] = useState(0);
  const [totalEventsActive, setTotalEventsActive] = useState(0);
  const [users,setUsers] = useState([])
  const [earned,setEarned] = useState([])
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDashboard(dispatch);
      setTotalCommission(data.totalCommission);
      setTotalUsersActive(data.totalUsersActive);
      setTotalEventsActive(data.totalEventsActive);
      setUsers(data.usersJoinedMonthly)
      setEarned(data.dailyCommission)
    };

    fetchData();
  }, [dispatch]);

  // Dummy data for graphs
  const monthlyUsersData = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
      {
        label: "Users Joined",
        data: users,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const dailyCommissionData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Commission Earned",
        data: earned,
        borderColor: "black",
        backgroundColor: "black",
        barThickness: 12,
      },
    ],
  };

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <AdminNav />
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded-md shadow-lg flex flex-col items-center transform transition-transform hover:scale-105 hover:shadow-xl">
            <span className="text-lg font-semibold text-gray-700">
              Total Commission Earned
            </span>
            <span className="text-2xl mt-2 text-black font-bold">
              ${totalCommission}
            </span>
          </div>
          <div className="bg-white p-4 rounded-md shadow-lg flex flex-col items-center transform transition-transform hover:scale-105 hover:shadow-xl">
            <span className="text-lg font-semibold text-gray-700">
              Total Users Active
            </span>
            <span className="text-2xl mt-2 text-black font-bold">
              {totalUsersActive} Users
            </span>
          </div>
          <div className="bg-white p-4 rounded-md shadow-lg flex flex-col items-center transform transition-transform hover:scale-105 hover:shadow-xl">
            <span className="text-lg font-semibold text-gray-700">
              Total Events Active
            </span>
            <span className="text-2xl mt-2 text-black font-bold">
              {totalEventsActive} Events
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Users Joined Monthly</h2>
            <Line data={monthlyUsersData} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
            <h2 className="text-xl font-semibold mb-4">
              Commission Earned Weekly
            </h2>
            <Bar data={dailyCommissionData} /> {/* Updated to Bar chart */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;