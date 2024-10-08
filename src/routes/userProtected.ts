import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"

const UserProtected: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userToken = useSelector((state: any) => state.user.token);
  const user = useSelector((state: any) => state.user.user);
  const navigate = useNavigate();


  useEffect(() => {
    console.log("User token:", userToken);
    console.log("User status:", user?.isActive);
    if (!userToken) {
      navigate("/login");
    } else if (user && !user.isActive) {
      navigate("/login");
      toast.info("Your account is blocked by Admin.");
    }
  }, [userToken, user, navigate]);

  return userToken && user && user.isActive ? children : null;
};




export default UserProtected;