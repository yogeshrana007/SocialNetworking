// === ConnectionButton.jsx (frontend) ===
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { HiUserAdd } from "react-icons/hi";
import { MdAccessTime } from "react-icons/md";
import { io } from "socket.io-client";
import { AuthDataContext } from "../context/AuthContext.jsx";
import { UserDataContext } from "../context/UserContext.jsx";

// Create a single persistent socket connection (ensure this file is imported only once)
const socket = io("http://localhost:8000", { autoConnect: true });

function ConnectionButton({ userId }) {
    const { serverUrl } = useContext(AuthDataContext);
    const { userData } = useContext(UserDataContext);

    // Connection status states: "connect", "pending", "received", "disconnect"
    const [status, setStatus] = useState("connect");
    const [loading, setLoading] = useState(false);

    // requestId used when status is "received" for accepting/rejecting requests
    const [requestId, setRequestId] = useState(null);

    // Fetch the current connection status for this userId
    const fetchStatus = async () => {
        try {
            const response = await axios.get(
                `${serverUrl}/api/connection/getstatus/${userId}`,
                { withCredentials: true }
            );
            const data = response.data || {};
            // data.status should be one of the expected states
            setStatus(data.status || "connect");
            setRequestId(data.requestId || null);
        } catch (error) {
            console.error("Error fetching connection status:", error);
        }
    };

    useEffect(() => {
        if (!userData?.user?._id) return;

        // initial fetch
        fetchStatus();

        // Register the logged-in user with the socket server for real-time updates
        socket.emit("register", userData.user._id);

        // Listen for status updates related to this userId
        const statusUpdateHandler = ({
            updatedUserId,
            newStatus,
            requestId: incomingRequestId,
        }) => {
            // The backend emits updatedUserId referring to the user whose status changed
            // If that id matches the `userId` prop of this button, update the UI
            if (updatedUserId === userId) {
                setStatus(newStatus);
                if (typeof incomingRequestId !== "undefined")
                    setRequestId(incomingRequestId || null);
                // After an instant socket update, ensure we reconcile with server to get the canonical state
                fetchStatus();
            }
        };

        socket.on("statusUpdate", statusUpdateHandler);

        // Cleanup listener on component unmount or userId change
        return () => {
            socket.off("statusUpdate", statusUpdateHandler);
        };
    }, [userId, userData]);

    // Handlers for connection actions - always refresh status from server afterwards and reset loading
    const handleSendConnection = async () => {
        setLoading(true);
        try {
            await axios.post(
                `${serverUrl}/api/connection/send/${userId}`,
                {},
                { withCredentials: true }
            );
            // Refresh to ensure UI matches server (in case socket was missed)
            await fetchStatus();
        } catch (error) {
            console.error("Error sending connection:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptConnection = async () => {
        if (!requestId) return;
        setLoading(true);
        try {
            await axios.put(
                `${serverUrl}/api/connection/accept/${requestId}`,
                {},
                { withCredentials: true }
            );
            // Refresh server state
            await fetchStatus();
            console.log("accept button clicked");
        } catch (error) {
            console.error("Error accepting connection:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRejectConnection = async () => {
        if (!requestId) return;
        setLoading(true);
        try {
            await axios.put(
                `${serverUrl}/api/connection/reject/${requestId}`,
                {},
                { withCredentials: true }
            );
            // Refresh server state
            await fetchStatus();
            console.log("reject button clicked");
        } catch (error) {
            console.error("Error rejecting connection:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveConnection = async () => {
        setLoading(true);
        try {
            await axios.delete(`${serverUrl}/api/connection/remove/${userId}`, {
                withCredentials: true,
            });
            // Refresh current status from server after removal
            await fetchStatus();
        } catch (error) {
            console.error("Error removing connection:", error);
        } finally {
            setLoading(false);
        }
    };

    // Configure button label, click handler, and disabled state based on status
    let buttonContent, onClick, disabled;

    switch (status) {
        case "connect":
            buttonContent = loading ? "Sending..." : "Connect";
            onClick = handleSendConnection;
            disabled = loading;
            break;

        case "pending":
            buttonContent = "Pending";
            onClick = undefined;
            disabled = true;
            break;

        case "received":
            break;

        case "disconnect":
            disabled = true;
            break;

        default:
            buttonContent = "Connect";
            onClick = handleSendConnection;
            disabled = loading;
    }

    return (
        <div className="w-[140px] h-[40px] text-[#2dc0ff] flex justify-center items-center space-x-2">
            {status === "received" ? (
                buttonContent
            ) : (
                <button
                    className="w-full h-full"
                    onClick={onClick}
                    disabled={disabled}
                >
                    {status != "disconnect" && (
                        <div className="flex justify-center py-[5px] border-2 rounded-full gap-[5px] items-center text-[18px]">
                            {buttonContent == "Connect" && (
                                <div>
                                    <HiUserAdd />
                                </div>
                            )}
                            {buttonContent == "Pending" && (
                                <div>
                                    <MdAccessTime />
                                </div>
                            )}
                            <div>{buttonContent}</div>
                        </div>
                    )}
                </button>
            )}
        </div>
    );
}

export default ConnectionButton;
