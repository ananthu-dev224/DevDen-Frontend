import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const EventCard: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Skeleton circle={true} height={40} width={40} />
          <div className="ml-2">
            <Skeleton width={100} height={20} />
            <Skeleton width={60} height={15} />
          </div>
        </div>
        <Skeleton width={20} height={20} />
      </div>
      <Skeleton height={300} />
      <div className="p-4">
        <Skeleton count={2} />
        <div className="flex justify-between text-gray-600 mt-4">
          <Skeleton width={100} height={20} />
          <Skeleton width={50} height={20} />
        </div>
        <div className="flex justify-between text-gray-600 mt-4">
          <Skeleton width={100} height={20} />
          <Skeleton width={50} height={20} />
        </div>
        <Skeleton width={150} height={20} className="mt-4" />
        <div className="flex justify-between items-center mt-7">
          <Skeleton width={100} height={20} />
          <Skeleton width={100} height={20} />
        </div>
      </div>
    </div>
  );
};


export default EventCard;