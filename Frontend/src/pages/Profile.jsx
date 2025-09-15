import { useContext } from "react";
import DP from "../assets/DP.png";
import EditProfile from "../components/EditProfile.jsx";
import Navbar from "../components/Navbar";
import { UserDataContext } from "../context/UserContext.jsx";

function Profile() {
    const { userData, showEdit, setShowEdit } = useContext(UserDataContext);

    if (!userData?.user) {
        return (
            <>
                <Navbar />
                <div className="pt-[100px] text-center">Loading profile...</div>
            </>
        );
    }

    const user = userData.user;

    return (
        <>
            <Navbar />
            <div className="pt-[80px] bg-[#f4f2ee] min-h-screen flex flex-col items-center">
                {/* Profile Card */}
                <div className="w-full lg:w-[60%] bg-white shadow rounded-lg">
                    {/* Cover Image */}
                    <div className="h-[180px] bg-gray-300 rounded-t-lg relative">
                        {user.coverImage?.url && (
                            <img
                                src={user.coverImage.url}
                                alt="cover"
                                className="w-full h-full object-cover rounded-t-lg"
                            />
                        )}
                        <img
                            src={user.profileImage?.url || DP}
                            alt="profile"
                            className="absolute left-8 -bottom-12 w-28 h-28 rounded-full border-4 border-white object-cover"
                        />
                    </div>

                    {/* User Info */}
                    <div className="pt-16 px-8 pb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <p className="text-gray-600">{user.headline}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {user.location || "Unknown location"}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    @{user.userName}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                {/* Only show Edit for logged-in user */}
                                <button
                                    onClick={() => setShowEdit(true)}
                                    className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                                >
                                    Edit Profile
                                </button>

                                {/* Connection button if you view someone else */}
                                {/* <ConnectionButton userId={someOtherUserId} /> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* About */}
                {/* <div className="w-full lg:w-[60%] bg-white shadow rounded-lg mt-4 p-6">
                    <h2 className="text-xl font-semibold mb-2">About</h2>
                    <p className="text-gray-600">
                        {user.about ||
                            "This user hasn’t added an about section yet."}
                    </p>
                </div> */}

                {/* Skills */}
                <div className="w-full lg:w-[60%] bg-white shadow rounded-lg mt-4 p-6">
                    <h2 className="text-xl font-semibold mb-2">Skills</h2>
                    {user.skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill, i) => (
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
                    {user.education?.length > 0 ? (
                        user.education.map((edu, i) => (
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
                    {user.experience?.length > 0 ? (
                        user.experience.map((exp, i) => (
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

            {/* EditProfile modal */}
            {showEdit && <EditProfile />}
        </>
    );
}

export default Profile;
