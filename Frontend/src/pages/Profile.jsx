import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DP from "../assets/DP.png";
import ConnectionButton from "../components/ConnectionButton.jsx";
import EditProfile from "../components/EditProfile.jsx";
import Navbar from "../components/Navbar";
import { AuthDataContext } from "../context/AuthContext.jsx";
import { UserDataContext } from "../context/UserContext.jsx";

function Profile() {
    const { id } = useParams(); // profile id from URL (if viewing someone else)
    const { userData, showEdit, setShowEdit } = useContext(UserDataContext);
    const { serverUrl } = useContext(AuthDataContext);

    let navigate = useNavigate();
    const [profileUser, setProfileUser] = useState(null);

    // Load profile data
    useEffect(() => {
        if (!id) {
            // No id → show logged-in user's profile
            setProfileUser(userData.user);
        } else {
            // Fetch other user's profile
            axios
                .get(`${serverUrl}/api/user/${id}`, { withCredentials: true })
                .then((res) => setProfileUser(res.data.user))
                .catch((err) => console.error("Error fetching profile:", err));
        }
    }, [id, userData, serverUrl]);

    if (!profileUser) {
        return (
            <>
                <div className="pt-[100px] text-center">
                    User doesn't exists
                    <div
                        className="text-blue-600 cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        back to main{" "}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="pt-[80px] bg-[#f4f2ee] min-h-screen flex flex-col items-center">
                <div className="w-full lg:w-[60%] bg-white shadow rounded-lg">
                    <div className="h-[180px] bg-gray-300 rounded-t-lg relative">
                        {profileUser.coverImage?.url && (
                            <img
                                src={profileUser.coverImage.url}
                                alt="cover"
                                className="w-full h-full object-cover rounded-t-lg"
                            />
                        )}
                        <img
                            src={profileUser.profileImage?.url || DP}
                            alt="profile"
                            className="absolute left-8 -bottom-12 w-28 h-28 rounded-full border-4 border-white object-cover"
                        />
                    </div>

                    <div className="pt-16 px-8 pb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {profileUser.firstName}{" "}
                                    {profileUser.lastName}
                                </h1>
                                <p className="text-gray-600">
                                    {profileUser.headline}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {profileUser.location || "Unknown location"}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    @{profileUser.userName}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                {/* Show Edit if it's your profile */}
                                {!id && (
                                    <button
                                        onClick={() => setShowEdit(true)}
                                        className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                                    >
                                        Edit Profile
                                    </button>
                                )}

                                {/* Show ConnectionButton only if it's someone else's profile */}
                                {profileUser._id !== userData.user._id && (
                                    <ConnectionButton
                                        userId={profileUser._id}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="w-full lg:w-[60%] bg-white shadow rounded-lg mt-4 p-6">
                    <h2 className="text-xl font-semibold mb-2">Skills</h2>
                    {profileUser.skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {profileUser.skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 bg-cyan-200 rounded-full text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No skills added.</p>
                    )}
                </div>

                {/* Education */}
                <div className="w-full lg:w-[60%] bg-white shadow rounded-lg mt-4 p-6">
                    <h2 className="text-xl font-semibold mb-2">Education</h2>
                    {profileUser.education?.length > 0 ? (
                        profileUser.education.map((edu, i) => (
                            <div key={i} className="mb-3">
                                <p className="font-semibold">{edu.college}</p>
                                <p className="text-gray-600">
                                    {edu.degree} – {edu.fieldOfStudy}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No education added.</p>
                    )}
                </div>

                {/* Experience */}
                <div className="w-full lg:w-[60%] bg-white shadow rounded-lg mt-4 p-6">
                    <h2 className="text-xl font-semibold mb-2">Experience</h2>
                    {profileUser.experience?.length > 0 ? (
                        profileUser.experience.map((exp, i) => (
                            <div key={i} className="mb-3">
                                <p className="font-semibold">{exp.title}</p>
                                <p className="text-gray-600">{exp.company}</p>
                                <p className="text-sm text-gray-500">
                                    {exp.description}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No experience added.</p>
                    )}
                </div>
            </div>

            {/* Edit modal only for own profile */}
            {!id && showEdit && <EditProfile />}
        </>
    );
}

export default Profile;
