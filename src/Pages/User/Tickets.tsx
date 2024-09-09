import { FC } from "react";
import Navbar from "../../Components/Navbar";
import TicketCard from "../../Components/TicketCard";

const Tickets: FC = () => {
  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="flex flex-col space-y-10 pb-20 md:pb-0">
          <TicketCard />
        </div>
      </div>
    </div>
  );
};

export default Tickets;