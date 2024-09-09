import { FC, ReactElement, useEffect } from "react";
import { TbDeviceDesktopAnalytics, TbMessageReport } from "react-icons/tb";
import { FaUsersGear, FaRegCalendarCheck } from "react-icons/fa6";
import { MdEventBusy } from "react-icons/md";
import { Logout } from "../config/Icons";
import logo from "../assets/devden.jpg";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adminLogout } from "../redux/reducers/adminSlice";
import { NavItemProps } from "../types/type";

const AdminNav: FC = (): ReactElement => {
  const admin = useSelector((state: any) => state.admin.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!admin) {
      navigate("/admin");
    }
  }, []);
  const handleLogout = () => {
    confirmAlert({
      title: "Confirm to logout",
      message: "Are you sure you want to logout?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            dispatch(adminLogout());
          },
        },
        {
          label: "No",
        },
      ],
    });
  };
  return (
    <>
      <div className="md:w-64 bg-white md:fixed md:h-[calc(100%-2rem)] top-0 left-0 z-50 rounded-lg shadow-lg md:m-4 overflow-hidden ">
        <nav className="hidden md:flex md:flex-col md:h-full  justify-center items-center">
          <div className="p-4 flex justify-center md:justify-start">
            <img src={logo} alt="Logo" className="w-full object-contain" />
          </div>
          <div className="flex flex-col items-center mt-10 space-y-4 overflow-auto">
            <h1 className="text-lg font-semibold">{admin}</h1>
          </div>
          <div className="flex flex-col items-center mt-10 space-y-4 overflow-auto">
            <NavItem
              icon={<TbDeviceDesktopAnalytics className="h-6 w-6" />}
              text="Dashboard"
              to="/dashboard"
            />
            <NavItem
              icon={<FaUsersGear className="h-6 w-6" />}
              text="User Desk"
              to="/user-desk"
            />
            <NavItem
              icon={<TbMessageReport className="h-6 w-6" />}
              text="Comment Reports"
              to="/comments"
            />
            <NavItem
              icon={<MdEventBusy className="h-6 w-6" />}
              text="Event Reports"
              to="/events"
            />
            <NavItem
              icon={<FaRegCalendarCheck className="h-6 w-6" />}
              text="Event Portal"
              to="/event-portal"
            />
          </div>
          <div className="mt-auto mb-10 mr-10" onClick={handleLogout}>
            <NavItem icon={<Logout />} text="Logout" />
          </div>
        </nav>
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white py-2 border-t border-gray-300 flex justify-around">
          <TbDeviceDesktopAnalytics
            className="h-6 w-6"
            onClick={() => navigate("/dashboard")}
          />
          <FaUsersGear
            className="h-6 w-6"
            onClick={() => navigate("/user-desk")}
          />
          <TbMessageReport
            className="h-6 w-6"
            onClick={() => navigate("/comments")}
          />
          <MdEventBusy
            className="h-6 w-6"
            onClick={() => navigate("/events")}
          />
          <FaRegCalendarCheck
            className="h-6 w-6"
            onClick={() => navigate("/event-portal")}
          />
          <Logout fn={handleLogout} />
        </div>
        <div className="hidden md:block absolute bottom-0 left-0 right-0 h-4 bg-white"></div>
      </div>
    </>
  );
};

const NavItem: FC<NavItemProps> = ({ icon, text, to }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (to) {
      navigate(to);
    }
  };
  return (
    <div
      className="flex items-center hover:bg-gray-200 rounded-lg p-2 cursor-pointer w-full text-center md:text-left"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        {icon}
        {text && (
          <span className="hidden md:inline text-lg font-semibold">{text}</span>
        )}
      </div>
    </div>
  );
};

export default AdminNav;