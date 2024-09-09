import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ReactDOM from "react-dom";
import { ReportModalProps } from "../types/type";
import { reportComment, reportEvent } from "../services/report";
import { toast } from "sonner";

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onRequestClose,
  category,
  id,
}) => {
  const [selectedReportType, setSelectedReportType] = useState<string>("");
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleReportTypeChange = (type: string) => {
    setSelectedReportType(type);
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (selectedReportType) {
      const data = {
        id,
        type: selectedReportType,
      };
      try {
        if (category === "event") {
          const res = await reportEvent(data, dispatch);
          if (res.status === "success") {
            toast.success("Event reported successfully.");
          }
        } else if (category === "comment") {
          const res = await reportComment(data, dispatch);
          if (res.status === "success") {
            toast.success("Comment reported successfully.");
          }
        }
      } catch (error) {
        console.error("Error reporting:", error);
      }
    }
    onRequestClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
        <button
          className="absolute top-1 right-3 text-2xl text-gray-500 hover:text-gray-700"
          onClick={onRequestClose}
        >
          &times;
        </button>
        <h2 className="text-xl text-center font-semibold mb-4">Report</h2>
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Select Report Type:</label>
          <select
            className="border p-2 mb-4 rounded-sm"
            value={selectedReportType}
            onChange={(e) => handleReportTypeChange(e.target.value)}
          >
            <option value="">Choose</option>
            <option value="spam">Spam</option>
            <option value="inappropriate">Inappropriate</option>
            <option value="misinformation">Misinformation</option>
            <option value="harassment">Harassment</option>
            <option value="other">Other</option>
          </select>
          <button
            className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800"
            onClick={handleSubmit}
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReportModal;