import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { AuthDataContext } from "../context/AuthContext.jsx";
import { UserDataContext } from "../context/UserContext.jsx";

import "../styles/style.css";

function SignUp() {
    let [show, setshow] = useState(false);
    let navigate = useNavigate();
    const { serverUrl } = useContext(AuthDataContext);
    let [loading, setLoading] = useState(false);
    let [err, setErr] = useState("");
    let { userData, setUserData, getCurrentUser } = useContext(UserDataContext);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSignUp = async (e) => {
        setLoading(true);
        setErr("");
        e.preventDefault();
        try {
            let result = await axios.post(
                serverUrl + "/api/auth/signup",
                formData,
                { withCredentials: true }
            );
            setUserData(result.data);
            {
                if (result.status === 201) {
                    await getCurrentUser();
                    setFormData({
                        firstName: "",
                        lastName: "",
                        userName: "",
                        email: "",
                        password: "",
                    });
                    navigate("/");
                }
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);

            // console.log("Signup error response:", error.response?.data);
            setErr(error?.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <>
            <div className="w-full h-screen bg-white flex flex-col items-center justify-start gap-[10px]">
                <div className="w-full flex">
                    <img
                        src={logo}
                        alt="linkedIn logo"
                        className="w-32 h-full px-[15px] lg:px-[20px] object-contain"
                    />
                </div>
                <form
                    onSubmit={handleSignUp}
                    className="w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col justify-center p-[15px] gap-[10px]"
                >
                    <h1 className="text-gray-800 text-[30px] font-semibold pb-6">
                        Sign Up
                    </h1>
                    <input
                        type="text"
                        placeholder="firstname"
                        required
                        className="form-input"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        placeholder="lastname"
                        required
                        name="lastName"
                        className="form-input"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        placeholder="username"
                        required
                        name="userName"
                        className="form-input"
                        value={formData.userName}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        placeholder="email"
                        required
                        name="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <div className="form-input flex items-center relative ">
                        <input
                            type={show ? "text" : "password"}
                            placeholder="password"
                            required
                            name="password"
                            className="w-full bg-transparent outline-none "
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <span
                            onClick={() => setshow((prev) => !prev)}
                            className="absolute right-[20px] cursor-pointer text-[#24b2ff]"
                        >
                            {show ? "hide" : "show"}
                        </span>
                    </div>
                    {err && <p className="text-red-600">{err}</p>}
                    <button
                        disabled={loading}
                        className="w-full md:w-auto bg-[#24b2ff] text-white font-semibold mt-8 py-3 px-4 rounded-full hover:bg-blue-700 flex items-center justify-center "
                    >
                        {loading ? "Loading.." : "Sign Up"}
                    </button>
                    <p className="text-center">
                        Already have an account ?{" "}
                        <span
                            className="text-[#24b2ff] cursor-pointer"
                            onClick={() => navigate("/login")}
                        >
                            Sign In
                        </span>
                    </p>
                </form>
            </div>
        </>
    );
}

export default SignUp;
