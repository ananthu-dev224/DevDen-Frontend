import React, { FC, useState, useEffect } from "react";
import { FaTimes, FaFlag, FaTrash, FaHeart, FaReply } from "react-icons/fa";
import { fetchComments, addComment, deleteComment, likeComment } from "../services/comment";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { confirmAlert } from 'react-confirm-alert';
import pfp from "../assets/pfp.jpeg";

interface CommentModalProps {
  eventId: string;
  isOpen: boolean;
  onRequestClose: () => void;
}

const CommentModal: FC<CommentModalProps> = ({
  eventId,
  isOpen,
  onRequestClose,
}) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const user = useSelector((store: any) => store.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await fetchComments(eventId, dispatch);
        setComments(response.comments || []);
      } catch (error) {
        toast.error("Failed to load comments.");
      }
    };

    if (isOpen) {
      loadComments();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, eventId]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const commentData = {
          eventId,
          userId: user._id,
          text: newComment,
        };
        const response = await addComment(commentData, dispatch);
        if (response.status === "success") {
          toast.success("Comment Added successfully");
          setComments([response.newComment, ...comments]);
          setNewComment("");
        } else {
          toast.error("Failed to add comment.");
        }
      } catch (error) {
        toast.error("Failed to add comment.");
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await deleteComment(commentId, dispatch);
      if (response.status === "success") {
        toast.success("Comment Deleted successfully");
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      toast.error("Failed to delete comment.");
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const likeData = {
        userId: user._id,
        commentId,
      };
      const response = await likeComment(likeData, dispatch);
      if (response.status === "success") {
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? { ...comment, likes: response.updatedLikes || [] }
              : comment
          )
        );
      } else {
        toast.error("Failed to like comment.");
      }
    } catch (error) {
      toast.error("Failed to like comment.");
    }
  };

  const calculatePostedTime = (commentDate: Date): string => {
    const currentDateTime = new Date();
    const diffMs = currentDateTime.getTime() - commentDate.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));

    if (diffMinutes < 1) {
      return "Now";
    } else if (diffMinutes === 1) {
      return "1 minute ago";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffMinutes < 120) {
      return "1 hour ago";
    } else if (diffMinutes < 1440) {
      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours} hours ago`;
    } else {
      return commentDate.toLocaleString();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onRequestClose}
      ></div>
      <div className="bg-white rounded-lg overflow-hidden shadow-lg w-11/12 max-w-lg mx-auto z-10">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Comments</h3>
          <FaTimes className="cursor-pointer" onClick={onRequestClose} />
        </div>
        <div className="p-4 max-h-80 overflow-y-scroll">
          <div className="mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              placeholder="Add a comment..."
            />
            <button
              onClick={handleAddComment}
              className="mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            >
              Post
            </button>
          </div>

          {comments.length > 0 ? (
            comments.map((comment: any) => {
              const createdAtDate = new Date(comment.createdAt);
              const postedTime = calculatePostedTime(createdAtDate);
              const username =
                user.username === comment.userId.username
                  ? `${comment.userId.username} (You)`
                  : comment.userId.username;

              return (
                <div
                  key={comment._id}
                  className="mb-2 relative ring-1 p-2 rounded-sm"
                >
                  <div className="flex items-center">
                    <img
                      src={comment.userId.dp ? comment.userId.dp : pfp}
                      alt={comment.userId.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="ml-2">
                      <span className="font-semibold">{username}</span>
                      <span className="block text-sm text-gray-500">
                        {postedTime}
                      </span>
                    </div>

                      <div className="absolute top-2 right-2 flex space-x-2">
                        <FaFlag
                          className="text-gray-500 hover:text-gray-800 cursor-pointer"
                          onClick={() => {
                            //report logic
                            
                          }}
                        />
                  {user._id === comment.userId._id && (
                        <FaTrash
                          className="text-gray-500 hover:text-red-500 cursor-pointer"
                          onClick={() => { 
                            confirmAlert({
                            title: 'Confirm to Delete Comment',
                            message: 'Are you sure?',
                            buttons: [
                              {
                                label: 'Yes',
                                onClick: () => {
                                  handleDeleteComment(comment._id);
                                }
                              },
                              {
                                label: 'No',
                              }
                            ]
                          });
                        }}
                        />
                    )}
                      </div>
                  </div>
                  <p className="ml-10">{comment.text}</p>
                  <div className="flex justify-end space-x-2 mt-2">
                    <button className="flex items-center text-gray-500 hover:text-red-500 transition duration-300">
                      <FaHeart
                        className={`text-gray-500 hover:text-red-500 transition duration-300 mr-1 cursor-pointer ${
                          comment.likes.includes(user._id) ? "text-red-500" : ""
                        }`}
                        onClick={() => handleLike(comment._id)}
                      />
                      <span>{comment.likes.length}</span>
                    </button>
                    {/* <button className="flex items-center text-gray-500 hover:text-gray-800">
                      <FaReply className="mr-1" />
                    </button> */}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentModal;