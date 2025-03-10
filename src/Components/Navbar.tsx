import { FC, ReactElement, useEffect, MouseEventHandler } from "react";
import { FaComments } from "react-icons/fa";
import {
  Home as HomeIcon,
  Explore,
  Notification,
  Host,
  Logout,
  Profile,
} from "../config/Icons";
import logo from "../assets/devden.jpg";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "sonner";
import socket from "../config/socket";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogout } from "../redux/reducers/userSlice";
import { NavItemProps } from "../types/type";

const Navbar: FC = (): ReactElement => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    confirmAlert({
      title: "Confirm to logout",
      message: "Are you sure you want to logout?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            dispatch(userLogout());
            socket.disconnect();
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
          <div className="flex flex-col items-center mt-10 space-y-4 overflow-hiddenz ">
            <NavItem
              icon={<HomeIcon />}
              text="Home"
              handleClick={() => navigate("/home")}
            />
            <NavItem
              icon={<Explore />}
              text="Explore"
              handleClick={() => navigate("/explore")}
            />
            <NavItem
              icon={<Host />}
              text="Create Event"
              handleClick={() => navigate("/create-event")}
            />
            <div className="relative">
              <NavItem
                icon={<Notification />}
                text="Notification"
                handleClick={() => navigate("/notifications")}
              />
              <span className="absolute top-3 right-0  flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            <NavItem
              icon={<FaComments className="h-6 w-6" />}
              text="Chat"
              handleClick={() => navigate("/chat")}
            />
          </div>
          <div className="mt-auto mb-10 mr-10">
            <NavItem
              icon={<Profile />}
              text="Profile"
              handleClick={() => navigate("/profile")}
            />
            <NavItem
              icon={<Logout />}
              text="Logout"
              handleClick={handleLogout}
            />
          </div>
        </nav>
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white py-2 border-t border-gray-300 flex justify-around">
          <HomeIcon fn={() => navigate("/home")} />
          <Explore fn={() => navigate("/explore")} />
          <Host fn={() => navigate("/create-event")} />
          <Notification fn={() => navigate("/notifications")} />
          <FaComments className="h-6 w-6" onClick={() => navigate("/chat")} />
          <Profile fn={() => navigate("/profile")} />
          <Logout fn={handleLogout} />
        </div>
        <div className="hidden md:block absolute bottom-0 left-0 right-0 h-4 bg-white"></div>
      </div>
    </>
  );
};

const NavItem: FC<NavItemProps> = ({ icon, text, handleClick }) => (
  <div
    className="flex items-center hover:bg-gray-200 rounded-lg p-2 cursor-pointer w-full text-center md:text-left"
    onClick={handleClick}
  >
    <div className="flex items-center space-x-3">
      {icon}
      {text && (
        <>
          <span className="hidden md:inline text-lg font-semibold">{text}</span>
        </>
      )}
    </div>
  </div>
);

export default Navbar;