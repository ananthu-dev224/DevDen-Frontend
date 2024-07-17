import React,{useRef} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {toast} from 'sonner';

const AdminProtected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const admin_token = useSelector((state: any) => state.admin.token);
  const navigate = useNavigate();
  const isFirstRun = useRef(true);
  React.useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    
    if (!admin_token) {
      navigate('/admin');
    }
  }, [admin_token, navigate]);

  return admin_token ? children : null;
};


export default AdminProtected;