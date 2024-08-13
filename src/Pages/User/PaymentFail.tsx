import { useEffect, FC } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar";

const PaymentFail: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
      if (!sessionId) {
        navigate('/')
      }
  }, []);

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="flex flex-col space-y-10 pb-20 md:pb-0">
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-xl font-semibold text-gray-700">
             Payment Failed ❌
            </h1>
            <p className="text-gray-500 mt-2">
             Please try again to get the tickets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaymentFail;