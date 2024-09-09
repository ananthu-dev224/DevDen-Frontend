import { FC, useState, useEffect, useRef, CSSProperties } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";
import { resetPassword, validateResetToken } from "../../services/userAuth";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

export const ResetPass: FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    if (password.trim() === "" || confirmPass.trim() === "") {
      setLoading(false);
      toast.info("Fill the fields.");
      return;
    } else if (password !== confirmPass) {
      setLoading(false);
      toast.error("Passwords do not match.");
      return;
    }
    const resetData = {
      password,
      token,
    };
    const res = await resetPassword(resetData);
    setLoading(false);
    if (res.status === "success") {
      toast.success(res.message);
      navigate("/login");
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
        {loading && (
          <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
            <ScaleLoader
              color="black"
              loading={loading}
              cssOverride={override}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
      </div>
    </>
  );
};