import React, { useState } from 'react';
import ReactDOM from 'react-dom';


interface ReportModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onRequestClose }) => {
  const [selectedReportType, setSelectedReportType] = useState<string>('');

  if (!isOpen) return null;

  const handleReportTypeChange = (type: string) => {
    setSelectedReportType(type);
  };

  const handleSubmit = () => {

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
        <h2 className="text-xl text-center font-semibold mb-4">Report Event</h2>
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
            className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900"
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