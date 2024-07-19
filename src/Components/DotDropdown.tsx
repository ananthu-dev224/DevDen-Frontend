import React, { FC, useEffect, useRef } from "react";
import { DropdownProps } from "../types/type";


const DotDropdown: FC<DropdownProps> = ({
  onReport,
  onClose,
  isProfile,
  onAbort,
  onDetails,
  onEdit
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      className="absolute right-5 mt-2 w-48 bg-white shadow-lg rounded-sm"
      ref={dropdownRef}
    >
      {onReport && (
        <button
        className="block w-full text-left ring-red-400 ring-1 px-4 py-2 rounded-sm text-gray-800 hover:bg-red-500"
        onClick={() => {
          onReport();
          onClose();
        }}
      >
        Report Event
      </button>
      )}
      {isProfile && (
        <div>
          {onEdit && (
            <button
              className="block w-full text-left  px-4 py-2  text-gray-800 hover:bg-blue-500"
              onClick={() => {
                onEdit();
                onClose();
              }}
            >
              Edit Event
            </button>
          )}
          {onAbort && (
            <button
              className="block w-full text-left  px-4 py-2  text-gray-800 hover:bg-red-500"
              onClick={() => {
                onAbort();
                onClose();
              }}
            >
              Abort Event
            </button>
          )}
          {onDetails && (
            <button
              className="block w-full text-left  px-4 py-2  text-gray-800 hover:bg-green-500"
              onClick={() => {
                onDetails();
                onClose();
              }}
            >
              Show Details
            </button>
          )}
        </div>
      )}
    </div>
  );
};



export default DotDropdown;