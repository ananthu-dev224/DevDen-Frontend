import { FC } from "react";
import AdminNav from "../../Components/AdminNav";


const Dashboard: FC = () => {


  return (
    <div className="flex bg-gray-200 min-h-screen">
      <AdminNav />
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="flex flex-col space-y-10 pb-20 md:pb-0">

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
