import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const EventCardSkeleton = () => {
  return (
      <div className="mb-3">
        <Skeleton height={150} width={300}/>
      </div>
  );
};

export default EventCardSkeleton;