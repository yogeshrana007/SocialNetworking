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
    let [showSearch, setShowSearch] = useState(false);

    const getCurrentUser = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/user/currentuser`, {
                withCredentials: true,
            });
            setUserData(result.data);

            console.log("Fetched user data:", result.data);
            // console.log(result);
        } catch (error) {
            setUserData(null);
            console.log("User fetch failed:", error.message);
        }
    };

    let getPost = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/post/getpost`, {
                withCredentials: true,
            });
            // console.log("post data : ", result);
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
        showSearch,
        setShowSearch,
    };
    return (
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    );
}

export default UserContext;
