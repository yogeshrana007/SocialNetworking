import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthDataContext } from "./AuthContext";

export const UserDataContext = createContext();

function UserContext({ children }) {
    let [userData, setUserData] = useState(null);
    let { serverUrl } = useContext(AuthDataContext);
    let [showEdit, setShowEdit] = useState(false);
    let [showPopup, setShowPopup] = useState(false);
    let [postData, setPostData] = useState([]);

    const getCurrentUser = async () => {
        try {
            let token = localStorage.getItem("token");
            let result = await axios.get(`${serverUrl}/api/user/currentuser`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserData(result.data);
            console.log("Fetched user data:", result.data);
        } catch (error) {
            setUserData(null);
            console.log("User fetch failed:", error.message);
        }
    };

    let getPost = async () => {
        try {
            let token = localStorage.getItem("token");
            let result = await axios.get(`${serverUrl}/api/post/getpost`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPostData(result.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCurrentUser();
        getPost();
    }, []);

    const value = {
        userData,
        setUserData,
        showEdit,
        setShowEdit,
        getCurrentUser,
        showPopup,
        setShowPopup,
        postData,
        setPostData,
        getPost,
    };
    return (
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    );
}

export default UserContext;
