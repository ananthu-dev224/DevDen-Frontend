import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const NotiSkeleton = () => {
  return (
      <div className="w-full">
        <Skeleton height={40} />
      </div>
  );
};

export default NotiSkeleton;