import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaHandHolding } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Link } from "react-router-dom";
import DP from "../assets/DP.png";
import Navbar from "../components/Navbar.jsx";
import { AuthDataContext } from "../context/AuthContext.jsx";
import { UserDataContext } from "../context/UserContext.jsx";
import { getSocket } from "../utils/socket.js";

export default function Network() {
    const { serverUrl } = useContext(AuthDataContext);
    const { userData } = useContext(UserDataContext);

    const socket = getSocket(serverUrl);

    let [showReq, setShowReq] = useState(false);
    const [requests, setRequests] = useState([]);

    let [showConnections, setShowConnections] = useState(false);
    const [connections, setConnections] = useState([]);

    const fetchRequests = async () => {
        try {
            const res = await axios.get(
                `${serverUrl}/api/connection/requests`,
                { withCredentials: true }
            );
            setRequests(res.data);
        } catch (error) {
            console.log("Error fetching request : ", error);
        }
    };

    const fetchConnections = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/connection/`, {
                withCredentials: true,
            });
            setConnections(res.data);
        } catch (err) {
            console.log("get connection error", err);
        }
    };

    useEffect(() => {
        fetchConnections();
        fetchRequests();
    }, []);

    const handleAccept = async (requestId) => {
        try {
            await axios.put(
                `${serverUrl}/api/connection/accept/${requestId}`,
                {},
                { withCredentials: true }
            );
            // Refresh both lists after a successful action
            fetchRequests();
            fetchConnections();
        } catch (error) {
            console.log("handle accept error :", error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await axios.put(
                `${serverUrl}/api/connection/reject/${requestId}`,
                {},
                { withCredentials: true }
            );
            // Refresh the requests list
            fetchRequests();
        } catch (err) {
            console.log("handle reject req error ", err);
        }
    };

    const handleRemoveConnection = async (userId) => {
        try {
            await axios.delete(`${serverUrl}/api/connection/remove/${userId}`, {
                withCredentials: true,
            });
            // Refresh the connections list
            fetchConnections();
        } catch (err) {
            console.log("handle connection remove error ", err);
        }
    };

    useEffect(() => {
        if (!userData?.user?._id) return;

        // register socket for this user
        socket.emit("register", userData.user._id);

        fetchConnections();
        fetchRequests();
    }, [userData]);

    useEffect(() => {
        // This effect handles real-time updates from the server
        socket.on("statusUpdate", ({ updatedUserId, newStatus }) => {
            // console.log(
            //     "📩 statusUpdate in Network:",
            //     updatedUserId,
            //     newStatus
            // );
            fetchRequests();
            fetchConnections();
        });

        // Cleanup the socket listener when the component unmounts
        return () => {
            socket.off("statusUpdate");
        };
    }, []);

    return (
        <>
            <div className="w-[100%] h-[100vh] bg-[#f4f2ee]">
                <Navbar />
                <div className="pt-[12vh] flex flex-col lg:items-center">
                    <div className="md:w-full lg:w-[60%] h-[70px] bg-white flex items-center font-semibold text-[17px] px-[40px]">
                        Manage my network
                    </div>
                    <div
                        className="w-full h-[70px] lg:w-[60%] mt-[4px] mb-[2px] flex items-center justify-between px-[40px] text-[16px] font-semibold bg-white hover:bg-gray-200 cursor-pointer"
                        onClick={() => setShowReq((prev) => !prev)}
                    >
                        <p className="opacity-[0.7] flex">
                            <FaHandHolding className="mr-[10px]" /> Request (
                            {requests.length})
                        </p>
                        <p className="opacity-[0.7] text-[20px]">
                            {showReq ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </p>
                    </div>
                    {/* showing requests */}
                    {showReq && (
                        <div className="w-full lg:w-[60%] bg-gray-50 mt-1 mb-2">
                            {requests.length === 0 ? (
                                <p className="p-4 text-gray-500">
                                    No pending requests
                                </p>
                            ) : (
                                requests.map((req) => (
                                    <div
                                        key={req._id}
                                        className="flex items-center justify-between p-2 border-b bg-white px-[40px]"
                                    >
                                        <Link to={`/profile/${req.sender._id}`}>
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={
                                                        req.sender?.profileImage
                                                            ?.url || DP
                                                    }
                                                    alt="profile"
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-semibold">
                                                        {req.sender?.firstName}{" "}
                                                        {req.sender?.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {req.sender?.headline}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleReject(req._id)
                                                }
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                            >
                                                ignore
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleAccept(req._id)
                                                }
                                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                            >
                                                accept
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    <div
                        className="w-full lg:w-[60%] h-[70px] flex items-center justify-between px-[40px] bg-white text-[16px] font-semibold hover:bg-gray-200 cursor-pointer"
                        onClick={() => setShowConnections((prev) => !prev)}
                    >
                        <div className="flex items-center gap-[10px]">
                            <p className="opacity-[0.7] ">
                                <FaUserGroup />
                            </p>
                            <p className="opacity-[0.7]">
                                Connections ({connections.length})
                            </p>
                        </div>
                        <div>
                            <p className="opacity-[0.7] text-[25px]">
                                {showConnections ? (
                                    <IoIosArrowUp />
                                ) : (
                                    <IoIosArrowDown />
                                )}
                            </p>
                        </div>
                    </div>

                    {showConnections && (
                        <div className="w-full lg:w-[60%] bg-gray-50 mt-2">
                            {connections.length === 0 ? (
                                <p className="p-4 text-gray-500">
                                    You have no connections yet
                                </p>
                            ) : (
                                connections.map((user) => (
                                    <div
                                        key={user._id}
                                        className="flex items-center bg-gray-50 justify-between p-2 border-b px-[40px] hover:bg-slate-100"
                                    >
                                        <Link to={`/profile/${user._id}`}>
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={
                                                        user?.profileImage
                                                            ?.url || DP
                                                    }
                                                    alt="dp"
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-semibold">
                                                        {user.firstName}{" "}
                                                        {user.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {user?.headline}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleRemoveConnection(user._id)
                                            }
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
