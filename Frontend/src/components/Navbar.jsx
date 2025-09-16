import axios from "axios";
import { useContext, useState } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { IoNotificationsSharp, IoSearchSharp } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import DP from "../assets/DP.png";
import logo2 from "../assets/logo2.png";
import { AuthDataContext } from "../context/AuthContext.jsx";
import { UserDataContext } from "../context/UserContext.jsx";

function Navbar() {
    let [activeSearch, setActiveSearch] = useState(false);
    let { userData, setUserData, showPopup, setShowPopup } =
        useContext(UserDataContext);
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

    return (
        <>
            <div className="w-full h-[10vh] bg-[hsl(0,0%,100%)] shadow-md flex justify-between md:justify-around items-center px-[10px] z-[80] fixed">
                {/* left div */}
                <div className="flex justify-center items-center gap-[10px]  ">
                    <div
                        onClick={() => {
                            setShowPopup(false);
                            setActiveSearch(false);
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
                        />
                    </form>
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
                        onClick={() => setShowPopup((prev) => !prev)}
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
