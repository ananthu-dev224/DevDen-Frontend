import React, { FC, useState, useEffect } from "react";
import { FaTimes, FaFlag, FaTrash, FaHeart, FaReply } from "react-icons/fa";
import { fetchComments, addComment, deleteComment, likeComment } from "../services/comment";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { confirmAlert } from 'react-confirm-alert';
import pfp from "../assets/pfp.jpeg";
import { calculatePostedTime } from "../utils/postedTime";
import { CommentModalProps } from "../types/type";


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
          text: newComment,
        };
        const response = await addComment(commentData, dispatch);
        if (response.status === "success") {
          toast.success("Comment added successfully");
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
        toast.success("Comment deleted successfully");
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      toast.error("Failed to delete comment.");
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const likeData = {
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


  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0 bg-black opacity-60"
        onClick={onRequestClose}
      ></div>
      <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-lg mx-auto z-10 relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Comments</h3>
          <FaTimes
            className="text-gray-600 cursor-pointer hover:text-gray-800 transition duration-150 text-sm"
            onClick={onRequestClose}
          />
        </div>
        <div className="p-4 max-h-80 overflow-y-auto">
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a comment..."
            />
            <button
              onClick={handleAddComment}
              className="ml-3 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition duration-150"
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
                  className="mb-4 p-3 rounded-lg border border-gray-200 bg-gray-50 relative"
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={comment.userId.dp ? comment.userId.dp : pfp}
                      alt={comment.userId.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <span className="font-semibold">{username}</span>
                      <span className="block text-sm text-gray-500">
                        {postedTime}
                      </span>
                    </div>
                    {user._id === comment.userId._id && (
                      <FaTrash
                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer transition duration-150 text-xs"
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
                  <p className="mt-2 text-gray-800">{comment.text}</p>
                  <div className="flex items-center justify-between mt-2 text-gray-500">
                    <button
                      className="flex items-center hover:text-red-500 transition duration-150"
                      onClick={() => handleLike(comment._id)}
                    >
                      <FaHeart
                        className={`mr-1 ${
                          comment.likes.includes(user._id) ? "text-red-500" : ""
                        } text-xs`}
                      />
                      <span>{comment.likes.length}</span>
                    </button>
                    <button className="flex items-center hover:text-gray-700 transition duration-150 text-xs">
                      <FaFlag className="mr-1" />
                      <span>Report</span>
                    </button>
                    <button className="flex items-center hover:text-blue-700 transition duration-150 text-xs">
                      <FaReply className="mr-1" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentModal;