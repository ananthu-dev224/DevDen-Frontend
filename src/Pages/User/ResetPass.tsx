import { FC, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

import { resetPassword, validateResetToken } from "../../services/userAuth";

export const ResetPass: FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const { token }: any = useParams();
  const navigate = useNavigate();

  const validate = async () => {
    const res = await validateResetToken(token);
    if (res.status === "success") {
      return;
    } else {
      navigate("/login");
    }
  };

  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    validate();
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (password.trim() === "" || confirmPass.trim() === "") {
      toast.info("Fill the fields.");
      return;
    } else if (password !== confirmPass) {
      toast.error("Passwords do not match.");
      return;
    }
    const resetData = {
        password,
        token
    }
    const res = await resetPassword(resetData);
    console.log(res)
    if(res.status === 'success'){
        toast.success(res.message)
        navigate('/login')
    }
  };

  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen overflow-hidden">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Password Reset Form
          </h1>
          <form>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:ring-black focus:border-gray-950 sm:text-sm"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="cpassword"
                name="cpassword"
                onChange={(e) => setConfirmPass(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-gray-950 sm:text-sm"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full sm:w-auto px-4 py-2 bg-black text-white font-medium rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
