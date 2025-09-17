import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BsImage } from "react-icons/bs";
import { FiCamera, FiPlus } from "react-icons/fi";
import { HiPencil } from "react-icons/hi2";
import { RxCross1 } from "react-icons/rx";
import DP from "../assets/DP.png";
import EditProfile from "../components/EditProfile";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import { AuthDataContext } from "../context/AuthContext";
import { UserDataContext } from "../context/UserContext";

function Home() {
    let {
        userData,
        showEdit,
        setShowEdit,
        postData,
        setPostData,
        getCurrentUser,
        getPost,
        showPopup,
        setShowPopup,
        showSearch,
        setShowSearch,
    } = useContext(UserDataContext);

    let { serverUrl } = useContext(AuthDataContext);

    let [showAddPost, setShowAddPost] = useState(false);
    let [selectImage, setSelectImage] = useState(null);
    let [selectedFile, setSelectedFile] = useState(null);
    let [loading, setLoading] = useState(false);
    let [description, setDescription] = useState("");

    useEffect(() => {
        if (!userData?.user) {
            getCurrentUser(); // fetch user data if not fetched yet
        } else {
            // user data is loaded, now load posts
            getPost();
        }
    }, [userData, getCurrentUser, getPost]);

    if (!userData?.user) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <p className="text-gray-600 text-lg">Loading user data...</p>
            </div>
        );
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const imageUrl = URL.createObjectURL(file);
            setSelectImage(imageUrl);
        }
    };

    const handlePost = async () => {
        try {
            setLoading(true);
            let formDataToSend = new FormData();

            if (description) formDataToSend.append("description", description);
            if (selectedFile) formDataToSend.append("image", selectedFile);

            await axios.post(
                `${serverUrl}/api/post/createpost`,
                formDataToSend,
                {
                    withCredentials: true,
                }
            );

            setDescription("");
            setSelectedFile(null);
            setSelectImage(null);
            setShowAddPost(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="w-full min-h-screen bg-[#f4f2ee] flex flex-col items-center relative ">
                <Navbar />
                {showEdit && <EditProfile />}

                {/* Overlay for Add Post */}
                {showAddPost && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-start pt-[80px]">
                        <div className="w-[400px] max-h-[90vh] bg-white rounded-2xl shadow-lg z-[101] overflow-y-auto relative p-4">
                            <RxCross1
                                onClick={() => setShowAddPost(false)}
                                className="absolute top-3 right-3 h-5 w-5 text-gray-600 cursor-pointer hover:text-red-500"
                            />

                            {/* User Info */}
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={userData.user?.profileImage?.url || DP}
                                    alt="DP"
                                    className="w-12 h-12 rounded-full object-cover border"
                                />
                                <div>
                                    <h2 className="font-semibold text-lg">
                                        {`${userData.user?.firstName} ${userData.user?.lastName}`}
                                    </h2>
                                </div>
                            </div>

                            {/* Post Input */}
                            <textarea
                                className="w-full outline-none p-2 border rounded-md text-sm resize-none"
                                rows="3"
                                placeholder="What do you want to talk about..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            {/* Preview Image */}
                            {selectImage && (
                                <div className="mt-3">
                                    <img
                                        src={selectImage}
                                        alt="post-img"
                                        className="rounded-md shadow-md max-h-[250px] object-contain w-full"
                                    />
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-4 flex justify-between items-center">
                                <label
                                    htmlFor="postImg"
                                    className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-800"
                                >
                                    <BsImage className="w-5 h-5" />
                                    <span className="text-sm">Add Image</span>
                                </label>
                                <input
                                    id="postImg"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />

                                <button
                                    className="bg-blue-500 text-white px-5 py-2 rounded-full shadow hover:bg-blue-600 transition disabled:opacity-50"
                                    onClick={handlePost}
                                    disabled={
                                        (!description && !selectedFile) ||
                                        loading
                                    }
                                >
                                    {loading ? "Posting..." : "Post"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Layout */}
                <div
                    className="flex flex-col lg:flex-row items-start justify-center w-full max-w-[1200px] gap-4 p-4 mt-[65px]"
                    onClick={() => {
                        setShowPopup(false);
                        setShowSearch(false);
                    }}
                >
                    {/* Left Panel - Profile Card */}
                    <div className="w-full lg:w-1/4 bg-white shadow rounded-xl overflow-hidden">
                        {/* Cover */}
                        <div className="relative h-[100px] bg-gray-300">
                            {userData.user.coverImage.url && (
                                <img
                                    src={userData.user.coverImage?.url}
                                    alt="cover-Img"
                                    className="h-full w-full object-cover"
                                />
                            )}
                            <FiCamera className="absolute top-3 right-3 text-white w-5 h-5 cursor-pointer" />
                        </div>

                        {/* DP + Info */}
                        <div className="flex flex-col items-center -mt-10 px-4">
                            <div className="relative">
                                <img
                                    src={userData.user.profileImage.url || DP}
                                    alt="DP"
                                    className="h-20 w-20 rounded-full border-4 border-white shadow-md object-cover"
                                />
                                <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 shadow-md">
                                    <FiPlus />
                                </div>
                            </div>

                            <h3 className="mt-3 font-semibold text-lg text-center">
                                {`${userData?.user.firstName} ${userData?.user?.lastName}`}
                            </h3>
                            <p className="text-sm text-gray-600 text-center">
                                {userData?.user?.headline}
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                                {userData?.user?.location}
                            </p>

                            <button
                                onClick={() => setShowEdit(true)}
                                className="w-full mb-4 px-4 py-2 border border-blue-500 text-blue-500 rounded-full flex justify-center items-center gap-2 hover:bg-blue-50 transition"
                            >
                                Edit Profile <HiPencil />
                            </button>
                        </div>
                    </div>

                    {/* Center Feed */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        {/* Start a Post */}
                        <div className="bg-white shadow rounded-xl p-4 flex items-center gap-3">
                            <img
                                src={userData.user?.profileImage?.url || DP}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <button
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-gray-600 text-left hover:bg-gray-100 transition"
                                onClick={() => setShowAddPost(true)}
                            >
                                Start a post
                            </button>
                        </div>

                        {/* Posts */}
                        <div className="flex flex-col gap-4">
                            {postData.map((post, index) => (
                                <Post
                                    key={index}
                                    id={post._id}
                                    author={post.author}
                                    description={post.description}
                                    image={post.image}
                                    like={post.like}
                                    comment={post.comment}
                                    createdAt={post.createdAt}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-full lg:w-1/4 bg-white shadow rounded-xl min-h-[200px] p-4">
                        <h2 className="font-semibold text-gray-700 text-lg">
                            Suggestions
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                            Coming soon...
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
