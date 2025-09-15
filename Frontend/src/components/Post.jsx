import axios from "axios";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots, FaRegThumbsUp } from "react-icons/fa";
import { LuSendHorizontal } from "react-icons/lu";
import { io } from "socket.io-client";
import DP from "../assets/DP.png";
import ConnectionButton from "../components/ConnectionButton.jsx";
import { AuthDataContext } from "../context/AuthContext";
import { UserDataContext } from "../context/UserContext";

let socket = io("http://localhost:8000");
export default function Post({
    id,
    author,
    like,
    comment,
    description,
    image,
    createdAt,
}) {
    let { serverUrl } = useContext(AuthDataContext);

    let { postData, setPostData, userData } = useContext(UserDataContext);

    const [isExpanded, setIsExpanded] = useState(false);
    const maxChars = 120; // how many chars to show before "See More"

    const toggleExpand = () => setIsExpanded(!isExpanded);

    let [showComment, setShowComment] = useState(false);

    let [likes, setLikes] = useState(like || []);
    const handleLike = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/post/like/${id}`, {
                withCredentials: true,
            });

            setLikes(result.data.like);

            // Update postData globally (without refetching all posts)
            setPostData((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === id ? { ...post, like: result.data.like } : post
                )
            );

            // console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    let [comments, setComments] = useState(comment || []); // for showing comments
    let [newComment, setNewComment] = useState(""); // for input
    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return; // edge case: ignore blank
        try {
            let result = await axios.post(
                `${serverUrl}/api/post/comment/${id}`,
                { content: newComment },
                { withCredentials: true }
            );

            // Update UI locally without refetching all posts
            setComments(result.data.comment);

            // Update postData globally (without refetching all posts)
            setPostData((prevPosts) =>
                prevPosts.map((post) =>
                    post._id == id
                        ? { ...post, comment: result.data.comment }
                        : post
                )
            );
            console.log(result.data.comment);
            setNewComment("");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        socket.on("likeUpdated", ({ postId, likes }) => {
            if (postId == id) {
                setLikes(likes);
            }
        });

        socket.on("commentAdded", ({ postId, comment }) => {
            if (postId == id) {
                setComments(comment);
            }
        });

        return () => {
            socket.off("likeUpdated");
            socket.off("commentAdded");
        };
    }, [id]);
    return (
        <>
            <div className="w-full min-h-[200px] bg-white rounded-lg shadow-sm p-4">
                {/* User info */}
                <div className="flex justify-between">
                    <div className="flex items-start gap-3 mb-4">
                        <img
                            src={author.profileImage.url || DP}
                            alt="DP"
                            className="w-12 h-12 rounded-full object-cover border"
                        />
                        <div>
                            <div className="font-semibold text-[16px]">
                                {author.firstName} {author.lastName}
                            </div>
                            <div className="text-[12px] text-gray-500">
                                {author.headline}
                            </div>
                            <div className="text-[11px] text-gray-400">
                                {moment(createdAt).fromNow()}
                            </div>
                        </div>
                    </div>
                    {userData.user._id != author._id && (
                        <div className="">
                            <ConnectionButton userId={author._id} />
                        </div>
                    )}
                </div>

                {/* Description + Image */}
                <div className="mb-3">
                    {/* Description */}
                    {description && (
                        <p className="mb-2 text-[14px] whitespace-pre-line break-words">
                            {isExpanded
                                ? description
                                : description.length > maxChars
                                ? description.slice(0, maxChars) + "..."
                                : description}
                        </p>
                    )}

                    {/* Show See More / Less only if text is long */}
                    {description && description.length > maxChars && (
                        <button
                            onClick={toggleExpand}
                            className="text-blue-600 text-sm font-medium hover:underline"
                        >
                            {isExpanded ? "See Less" : "See More"}
                        </button>
                    )}

                    {/* Image */}
                    {image && (
                        <div className="w-full flex justify-center mt-2">
                            <img
                                src={image}
                                alt="post"
                                className="w-[90%] rounded-md shadow-sm object-contain max-h-[500px]"
                            />
                        </div>
                    )}
                    <div className="w-full flex gap-[7px] justify-start ml-[40px] mt-3 opacity-[0.6]">
                        <FaRegThumbsUp className="text-[18px]" />
                        {likes.length}
                    </div>
                </div>

                {/* Divider */}
                <hr className="my-3 border-gray-300" />

                {/* Like & Comment buttons */}
                <div className="flex justify-around text-gray-600 text-sm font-medium mb-2">
                    <button
                        className="flex items-center gap-2 hover:text-blue-500 transition"
                        onClick={handleLike}
                    >
                        {likes.includes(userData.user._id) ? (
                            <div className="text-blue-500 flex gap-[10px]">
                                <AiFillLike className="text-lg" />{" "}
                                <span>Liked</span>
                            </div>
                        ) : (
                            <div className="flex gap-[10px]">
                                <BiLike className="text-lg" /> <span>Like</span>
                            </div>
                        )}
                    </button>
                    <button
                        className="flex items-center gap-2 hover:text-blue-500 transition"
                        onClick={() => setShowComment(true)}
                    >
                        <FaRegCommentDots className="text-lg" />
                        <span>Comment</span>
                    </button>
                </div>

                {/* Comment functionality */}
                {showComment && (
                    <div className="ml-4 my-4">
                        <form
                            className="border-b border-gray-200 pb-2 mb-4 flex items-center gap-2"
                            onSubmit={handleComment}
                        >
                            {/* User DP */}
                            <img
                                src={userData.user?.profileImage?.url || DP}
                                alt="DP"
                                className="w-9 h-9 rounded-full object-cover"
                            />

                            {/* Input Box */}
                            <input
                                placeholder="Leave a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="flex-1 px-3 py-2 rounded-full bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            {/* Send Button */}
                            <button
                                type="submit"
                                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                            >
                                <LuSendHorizontal size={18} />
                            </button>
                        </form>

                        {/* Show Comments */}
                        <div className="mt-2">
                            {comments.map((c, i) => (
                                <div key={i} className="mb-4 ml-2">
                                    {/* User Info */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <img
                                            src={
                                                c.user?.profileImage?.url || DP
                                            }
                                            alt="user-DP"
                                            className="w-9 h-9 rounded-full border object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-sm">
                                                {c.user.firstName}{" "}
                                                {c.user.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {c.user.headline}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Comment Bubble */}
                                    <div className="ml-[45px] bg-gray-100 px-4 py-2 rounded-2xl inline-block max-w-[70%] text-sm shadow-sm">
                                        {c.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
