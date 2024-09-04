import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const ChatSkeleton = () => {
  return (
      <div className="w-full">
        <Skeleton height={60} />
      </div>
  );
};

export default ChatSkeleton;