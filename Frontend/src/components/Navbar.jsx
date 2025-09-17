import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { IoNotificationsSharp, IoSearchSharp } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { TiHome } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";
import DP from "../assets/DP.png";
import logo2 from "../assets/logo2.png";
import { AuthDataContext } from "../context/AuthContext.jsx";
import { UserDataContext } from "../context/UserContext.jsx";

function Navbar() {
    let [activeSearch, setActiveSearch] = useState(false);
    let {
        userData,
        setUserData,
        showPopup,
        setShowPopup,
        showSearch,
        setShowSearch,
    } = useContext(UserDataContext);
    let { serverUrl } = useContext(AuthDataContext);
    let navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            setShowPopup(false);
            let result = await axios.get(serverUrl + "/api/auth/logout", {
                withCredentials: true,
            });
            console.log(result);
            setUserData(null);

            navigate("/login");
        } catch (error) {
            console.log("logout error", error.message);
        }
    };

    let [searchInput, setSearchInput] = useState("");
    let [searchedData, setSearchedData] = useState([]);

    const handleSearch = async () => {
        try {
            let result = await axios.get(
                `${serverUrl}/api/user/search?query=${searchInput}`,
                { withCredentials: true }
            );
            setSearchedData(result.data);
            console.log(result.data);
        } catch (error) {
            console.log("search err", error);
        }
    };

    useEffect(() => {
        if (searchInput) {
            handleSearch();
            setShowSearch(true);
        } else {
            setShowSearch(false);
        }
    }, [searchInput]);
    return (
        <>
            <div className="w-full h-[10vh] bg-[hsl(0,0%,100%)] shadow-md flex justify-between md:justify-around items-center px-[10px] z-[80] fixed">
                {/* left div */}
                <div className="flex justify-center items-center gap-[10px]  ">
                    <div
                        onClick={() => {
                            setShowPopup(false);
                            setActiveSearch(false);
                            setShowSearch(false);
                        }}
                        className="cursor-pointer"
                    >
                        <img
                            src={logo2}
                            alt="linkedin-logo"
                            className=""
                            onClick={() => navigate("/")}
                        />
                    </div>
                    {!activeSearch && (
                        <div>
                            <IoSearchSharp
                                onClick={() => {
                                    setShowPopup(false);
                                    setActiveSearch(true);
                                }}
                                className="w-[22px] h-[22px] text-gray-700 lg:hidden"
                            />
                        </div>
                    )}
                    <div className="">
                        <div>
                            <form
                                className={`w-[200px] lg:w-[350px] h-[40px] bg-[#f0efe7] lg:flex items-center gap-[10px] px-[10px] py-[5px] rounded-md ${
                                    !activeSearch ? "hidden" : "flex"
                                }`}
                            >
                                <div className="">
                                    <IoSearchSharp className="w-[22px] h-[22px] text-gray-700" />
                                </div>
                                <input
                                    type="text"
                                    className="w-[80%] h-full bg-transparent outline-none bottom-0"
                                    placeholder="search users.."
                                    onChange={(e) =>
                                        setSearchInput(e.target.value)
                                    }
                                    value={searchInput}
                                />
                                {searchInput != "" ? (
                                    <MdCancel
                                        className="cursor-pointer"
                                        onClick={() => setSearchInput("")}
                                    />
                                ) : (
                                    ""
                                )}
                            </form>
                        </div>
                        <div className="absolute">
                            {/* showing searched users */}
                            {showSearch && (
                                <div className="w-[300px] mt-[20px] bg-white">
                                    {searchedData.length === 0 ? (
                                        <p className="p-4 text-gray-500">
                                            No user found
                                        </p>
                                    ) : (
                                        searchedData.map((user) => (
                                            <div
                                                key={user._id}
                                                className="flex items-center justify-between p-2 border-b bg-white px-[20px] md:px-[40px]"
                                            >
                                                <Link
                                                    to={`/profile/${user._id}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={
                                                                user
                                                                    ?.profileImage
                                                                    ?.url || DP
                                                            }
                                                            alt="profile"
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                        <div>
                                                            <p className="font-semibold">
                                                                {
                                                                    user?.firstName
                                                                }{" "}
                                                                {user?.lastName}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {user?.headline}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Right div */}
                <div className="flex justify-center items-center gap-[20px] ">
                    {/* Profile drawer */}
                    {showPopup && (
                        <div className="w-[300px] min-h-[320px] flex flex-col items-center bg-white gap-[20px] shadow top-[5.5rem] rounded absolute z-[200] right-[10px] sm:right-[80px] lg:right-[250px]">
                            {/* DP */}
                            <div className="h-[70px] w-[70px] rounded-full text-gray-700 pt-[10px] ">
                                <img
                                    src={
                                        userData.user.profileImage.url
                                            ? userData.user?.profileImage.url
                                            : DP
                                    }
                                    alt="DP"
                                    className="h-full w-[90%] rounded-full object-cover"
                                />
                            </div>
                            <div className="text-[19px] font-semibold text-gray-700">
                                {`${userData?.user?.firstName} ${userData?.user?.lastName}`}
                            </div>
                            <button
                                className="w-[85%] h-[40px] border-2 border-[#2dc0ff] text-[#2dc0ff] rounded-full"
                                onClick={() => {
                                    setShowSearch(false);
                                    setShowPopup(false);
                                    navigate("/profile");
                                }}
                            >
                                View Profile
                            </button>
                            <div className="w-[85%] h-[1px] bg-gray-300">
                                <hr></hr>
                            </div>

                            {/* My Network */}
                            <div
                                className=" w-full flex items-center justify-start text-gray-600 hover:text-gray-900 pl-[20px] gap-[10px] cursor-pointer"
                                onClick={() => {
                                    setShowSearch(false);
                                    setShowPopup(false);
                                    navigate("/network");
                                }}
                            >
                                <FaUserGroup className="w-[22px] h-[22px] " />
                                <div>My Networks</div>
                            </div>

                            <button
                                onClick={handleSignOut}
                                className="w-[85%] h-[40px] border-2 border-[#e84545] text-[#e84545] rounded-full"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}

                    {/* Home icon */}
                    <div
                        className=" lg:flex flex-col items-center justify-center text-[14px] text-gray-600 hover:text-gray-900 hidden cursor-pointer"
                        onClick={() => {
                            setShowSearch(false);
                            setShowPopup(false);
                            navigate("/");
                        }}
                    >
                        <TiHome className="w-[22px] h-[22px] " />
                        <div>Home</div>
                    </div>

                    {/* My Network */}
                    <div
                        className=" md:flex flex-col items-center text-[14px] justify-center text-gray-600 hover:text-gray-900 hidden cursor-pointer"
                        onClick={() => {
                            setShowSearch(false);
                            setShowPopup(false);
                            navigate("/network");
                        }}
                    >
                        <FaUserGroup className="w-[22px] h-[22px] " />
                        <div>My Networks</div>
                    </div>

                    {/* Notification */}
                    <div
                        className=" flex flex-col items-center justify-center text-[14px] text-gray-600 hover:text-gray-900 cursor-pointer"
                        // onClick={() => navigate("/notification")}
                    >
                        <IoNotificationsSharp className="w-[23px] h-[23px] " />
                        <div className="hidden md:block">Notification</div>
                    </div>

                    {/* DP */}
                    <div
                        onClick={() => {
                            setShowSearch(false);
                            setShowPopup((prev) => !prev);
                        }}
                        className="h-[45px] w-[45px] rounded-full text-gray-500 cursor-pointer"
                    >
                        <img
                            src={
                                userData.user?.profileImage.url
                                    ? userData.user?.profileImage.url
                                    : DP
                            }
                            alt="DP"
                            className="h-full w-full rounded-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;
