import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FiCamera, FiPlus } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import DP from "../assets/DP.png";
import { AuthDataContext } from "../context/AuthContext";
import { UserDataContext } from "../context/UserContext";

function EditProfile() {
    let { userData, setUserData, showEdit, setShowEdit, getCurrentUser } =
        useContext(UserDataContext);

    let { serverUrl } = useContext(AuthDataContext);
    let [loading, setLoading] = useState(false);

    // Local form state
    const [formData, setFormData] = useState({
        profileImage: null,
        coverImage: null,
        firstName: "",
        lastName: "",
        userName: "",
        headline: "",
        location: "",
        gender: "",
        skills: [],
        education: [
            {
                college: "",
                degree: "",
                fieldOfStudy: "",
            },
        ],
        experience: [
            {
                title: "",
                company: "",
                description: "",
            },
        ],
    });

    const [newSkill, setNewSkill] = useState(""); // this is the text in the input
    const [newEducation, setNewEducation] = useState({
        college: "",
        degree: "",
        fieldOfStudy: "",
    });

    const [newExperience, setNewExperience] = useState({
        title: "",
        company: "",
        description: "",
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                profileImage: userData.user?.profileImage || null,
                coverImage: userData.user?.coverImage || null,
                firstName: userData.user.firstName || "",
                lastName: userData.user?.lastName || "",
                userName: userData.user?.userName || "",
                headline: userData.user?.headline || "",
                location: userData.user?.location || "",
                gender: userData.user?.gender || "",
                skills: userData.user?.skills || [],
                education: userData.user?.education || [
                    {
                        college: "",
                        degree: "",
                        fieldOfStudy: "",
                    },
                ],
                experience: userData.user?.experience || [
                    {
                        title: "",
                        company: "",
                        description: "",
                    },
                ],
            });
        }
    }, [userData]);

    const handleSaveProfile = async () => {
        try {
            let formDataToSend = new FormData();

            formDataToSend.append("profileImage", formData.profileImage);
            formDataToSend.append("coverImage", formData.coverImage);
            formDataToSend.append("firstName", formData.firstName);
            formDataToSend.append("lastName", formData.lastName);
            formDataToSend.append("userName", formData.userName);
            formDataToSend.append("headline", formData.headline);
            formDataToSend.append("location", formData.location);
            formDataToSend.append("gender", formData.gender);

            // Convert arrays/objects to JSON strings
            formDataToSend.append("skills", JSON.stringify(formData.skills));
            formDataToSend.append(
                "education",
                JSON.stringify(formData.education)
            );
            formDataToSend.append(
                "experience",
                JSON.stringify(formData.experience)
            );
            setLoading(true);
            let result = await axios.put(
                `${serverUrl}/api/user/updateprofile`,
                formDataToSend,
                { withCredentials: true }
            );
            await getCurrentUser();
            setShowEdit(false);
            // console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-full h-[100vh] fixed top-0 z-[100] flex justify-center items-center ">
            <div
                className="w-full h-full opacity-[0.7] bg-black absolute"
                onClick={() => {
                    setShowEdit(false);
                }}
            ></div>

            <div className="w-[90%] max-w-[600px] h-[600px]  bg-white z-[200] shadow-lg rounded overflow-auto relative scrollbar-thin [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent">
                <div className="">
                    <RxCross1
                        onClick={() => {
                            setShowEdit(false);
                        }}
                        className=" absolute top-[1px] text-[#ffffff] right-[2px] h-[20px] w-[15px] font-bold cursor-pointer "
                    />
                </div>
                <div className="w-full h-[160px] bg-gray-400 rounded overflow-hidden  ">
                    {(formData.coverImage instanceof File ||
                        formData.coverImage?.url) && (
                        <img
                            src={
                                formData.coverImage instanceof File
                                    ? URL.createObjectURL(formData.coverImage)
                                    : formData.coverImage?.url
                                    ? formData.coverImage.url
                                    : ""
                            }
                            alt="cover-Img"
                        />
                    )}
                    <label htmlFor="coverUpload">
                        <FiCamera className="w-[20px] h-[20px] top-[25px] absolute right-5 text-white cursor-pointer" />
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        id="coverUpload"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setFormData((prev) => ({
                                    ...prev,
                                    coverImage: file,
                                }));
                            }
                        }}
                    />
                </div>

                <div className="absolute top-[110px] left-[90px] transform -translate-x-1/2 flex flex-col items-center w-full px-4">
                    <div className="h-[90px] w-[90px] rounded-full overflow-visible border-[3px] border-white bg-white shadow-md relative">
                        <label htmlFor="profileUpload">
                            <img
                                src={
                                    formData.profileImage instanceof File
                                        ? URL.createObjectURL(
                                              formData.profileImage
                                          )
                                        : formData.profileImage?.url
                                        ? formData.profileImage.url
                                        : DP
                                }
                                alt="DP"
                                className="h-full w-full rounded-full object-cover cursor-pointer"
                            />
                            <div className="mb-2 absolute bottom-0 right-0 bg-blue-500 text-white rounded-full shadow-md cursor-pointer">
                                <FiPlus className="" />
                            </div>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            id="profileUpload"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setFormData((prev) => ({
                                        ...formData,
                                        profileImage: file,
                                    }));
                                }
                            }}
                        />
                    </div>
                </div>

                <form
                    action=""
                    className="w-full flex flex-col items-center justify-center px-[10px] gap-[30px] mt-[100px] rounded"
                >
                    <input
                        type="text"
                        placeholder="firstname"
                        className="w-full outline-none border-gray-600  px-[10px] py-[9px] text-[16px] border-2 rounded-lg"
                        value={formData?.firstName}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                firstName: e.target.value,
                            })
                        }
                    />
                    <input
                        type="text"
                        placeholder="lastname"
                        className="w-full outline-none border-gray-600 px-[10px] py-[9px] text-[16px] border-2 rounded-lg"
                        value={formData.lastName}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                lastName: e.target.value,
                            })
                        }
                    />
                    <input
                        type="text"
                        placeholder="username"
                        className="w-full outline-none border-gray-600 px-[10px] py-[9px] text-[16px] border-2 rounded-lg"
                        value={formData.userName}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                userName: e.target.value,
                            })
                        }
                    />
                    <input
                        type="text"
                        placeholder="headline"
                        className="w-full outline-none border-gray-600 px-[10px] py-[9px] text-[16px] border-2 rounded-lg"
                        value={formData.headline}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                headline: e.target.value,
                            })
                        }
                    />
                    <input
                        type="text"
                        placeholder="location"
                        className="w-full outline-none border-gray-600 px-[10px] py-[9px] text-[16px] border-2 rounded-lg"
                        value={formData.location}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                location: e.target.value,
                            })
                        }
                    />
                    <select
                        className="w-full outline-none border-gray-600 px-[10px] py-[9px] text-[16px] border-2 rounded-lg"
                        value={formData.gender}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                gender: e.target.value,
                            })
                        }
                    >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <div className="w-full border-gray-600 px-[10px] py-[9px] text-[18px] border-2 rounded-lg  ">
                        <label className="block  font-medium mb-2 text-[17px]">
                            Skills
                        </label>
                        {/* Show Added Skills */}
                        <div className="mt-2 flex flex-wrap gap-2">
                            {formData.skills?.map((skill, index) => (
                                <span
                                    key={index}
                                    className=" bg-cyan-200 px-3 py-1 mb-[10px] rounded-md text-[14px] flex items-center gap-1"
                                >
                                    {skill}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setFormData({
                                                ...formData,
                                                skills: formData.skills.filter(
                                                    (_, i) => i !== index
                                                ),
                                            });
                                        }}
                                        className="text-red-500 font-bold text-[20px] ml-[10px]"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        {/* Adding new skill */}
                        <div className="flex items-center gap-3 pt-[10px] mb-2 flex-wrap">
                            <input
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="add new skill"
                                className="flex-1 border outline-none border-gray-400 px-3 py-2 rounded-md text-sm"
                            />
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    const trimmedSkill = newSkill.trim();

                                    if (
                                        trimmedSkill !== "" &&
                                        !formData.skills.includes(
                                            trimmedSkill.toLowerCase()
                                        )
                                    ) {
                                        setFormData({
                                            ...formData,
                                            skills: [
                                                ...formData.skills,
                                                trimmedSkill.toLowerCase(),
                                            ],
                                        });
                                        setNewSkill("");
                                    } else if (
                                        formData.skills.includes(
                                            trimmedSkill.toLowerCase()
                                        )
                                    ) {
                                        alert("Skill already exists!");
                                    }
                                }}
                                className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 text-sm"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Education */}
                    <div className="w-full py-[10px] outline-none border-2 border-gray-600 rounded-lg ">
                        <label className="px-[10px] py-[10px] text-[17px] rounded font-semibold">
                            Education
                        </label>
                        {/* Show education data */}
                        <div className="">
                            {formData.education?.map((edu, index) => (
                                <div
                                    key={index}
                                    className="w-[90%] bg-gray-100 flex justify-between items-center ml-[25px]  mt-[15px] mb-[15px]"
                                >
                                    <div className="flex flex-col text-[16px] gap-[8px]">
                                        <div className="">
                                            College : {edu.college}
                                        </div>
                                        <div className="">
                                            Degree : {edu.degree}
                                        </div>
                                        <div className="">
                                            Field of study : {edu.fieldOfStudy}
                                        </div>
                                    </div>

                                    <button
                                        className="text-red-500 text-[30px] font-bold mr-[15px]"
                                        onClick={(e) => {
                                            e.preventDefault(),
                                                setFormData({
                                                    ...formData,
                                                    education:
                                                        formData.education.filter(
                                                            (_, i) => i != index
                                                        ),
                                                });
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="">
                            <div className="m-[15px] ">
                                <label>College :</label>
                                <input
                                    value={newEducation.college}
                                    className="outline-none border-2 w-[81%] ml-[10px] px-[10px] py-[4px]"
                                    placeholder="enter college name"
                                    onChange={(e) =>
                                        setNewEducation({
                                            ...newEducation,
                                            college: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="m-[15px] ">
                                <label>Degree : </label>
                                <input
                                    value={newEducation.degree}
                                    className="outline-none border-2 w-[80.5%] ml-[10px] px-[10px] py-[4px]"
                                    placeholder="enter degree"
                                    onChange={(e) =>
                                        setNewEducation({
                                            ...newEducation,
                                            degree: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="m-[15px] ">
                                <label>Field of study :</label>
                                <input
                                    value={newEducation.fieldOfStudy}
                                    className="outline-none border-2 w-[73%] ml-[10px] px-[10px] py-[4px]"
                                    placeholder="enter field of study"
                                    onChange={(e) =>
                                        setNewEducation({
                                            ...newEducation,
                                            fieldOfStudy: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <button
                                type="button"
                                className="w-[80%] text-blue-600 border-2 border-blue-400 px-6 py-2 rounded-full hover:bg-blue-100 text-sm mx-[10%] my-[15px]"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (
                                        newEducation.college &&
                                        newEducation.degree &&
                                        newEducation.fieldOfStudy
                                    ) {
                                        setFormData({
                                            ...formData,
                                            education: [
                                                ...formData.education,
                                                newEducation,
                                            ],
                                        });
                                        setNewEducation({
                                            college: "",
                                            degree: "",
                                            fieldOfStudy: "",
                                        });
                                    }
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                    {/* Experience */}
                    <div className="w-full py-[10px] outline-none border-2 border-gray-600 rounded-lg ">
                        <label className="px-[10px] py-[10px] text-[17px] rounded font-semibold">
                            Experience
                        </label>
                        {/* Show education data */}
                        <div className="">
                            {formData.experience?.map((exp, index) => (
                                <div
                                    key={index}
                                    className="w-[90%] bg-gray-100 flex justify-between items-center ml-[25px] mt-[15px] text-[16px] mb-[15px]"
                                >
                                    <div className="flex flex-col gap-[8px]">
                                        <div className="">
                                            Title : {exp.title}
                                        </div>
                                        <div className="">
                                            Company : {exp.company}
                                        </div>
                                        <div className="">
                                            Description : {exp.description}
                                        </div>
                                    </div>

                                    <button
                                        className="text-red-500 text-[30px] font-bold mr-[15px]"
                                        onClick={(e) => {
                                            e.preventDefault(),
                                                setFormData({
                                                    ...formData,
                                                    experience:
                                                        formData.experience.filter(
                                                            (_, i) => i != index
                                                        ),
                                                });
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Adding new experience */}
                        <div className="">
                            <div className="m-[15px] ">
                                <label>Title :</label>
                                <input
                                    value={newExperience.title}
                                    className="outline-none border-2 w-[84%] ml-[10px] px-[10px] py-[4px]"
                                    placeholder="enter title of experience"
                                    onChange={(e) =>
                                        setNewExperience({
                                            ...newExperience,
                                            title: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="m-[15px] ">
                                <label>Company : </label>
                                <input
                                    value={newExperience.company}
                                    className="outline-none border-2 w-[76%] ml-[10px] px-[10px] py-[4px]"
                                    placeholder="enter company name"
                                    onChange={(e) =>
                                        setNewExperience({
                                            ...newExperience,
                                            company: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="m-[15px] ">
                                <label>Description :</label>
                                <input
                                    value={newExperience.description}
                                    className="outline-none border-2 w-[74.5%] ml-[10px] px-[10px] py-[4px]"
                                    placeholder="enter description"
                                    onChange={(e) =>
                                        setNewExperience({
                                            ...newExperience,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <button
                                type="button"
                                className="w-[80%] text-blue-600 border-2 border-blue-400 px-6 py-2 rounded-full hover:bg-blue-100 text-sm mx-[10%] my-[15px]"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (
                                        newExperience.title &&
                                        newExperience.company &&
                                        newExperience.description
                                    ) {
                                        setFormData({
                                            ...formData,
                                            experience: [
                                                ...formData.experience,
                                                newExperience,
                                            ],
                                        });
                                        setNewExperience({
                                            title: "",
                                            company: "",
                                            description: "",
                                        });
                                    }
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </form>
                <div className="flex gap-[50px] justify-center items-center mt-[20px] mb-[20px] ">
                    <button
                        className="border-2  px-[20px] py-[7px] rounded-md"
                        onClick={() => {
                            setShowEdit(false);
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className="border-2 bg-green-500 px-[20px] py-[7px] rounded-md"
                        onClick={handleSaveProfile}
                    >
                        {loading ? "saving.." : "save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;
