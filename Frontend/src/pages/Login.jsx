import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { AuthDataContext } from "../context/AuthContext.jsx";
import { UserDataContext } from "../context/UserContext.jsx";
import "../styles/style.css";

function Login() {
    let [show, setshow] = useState(false);
    let navigate = useNavigate();
    const { serverUrl } = useContext(AuthDataContext);
    let [loading, setLoading] = useState(false);
    let [err, setErr] = useState("");
    let { userData, setUserData } = useContext(UserDataContext);

    const [formData, setFormData] = useState({
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

    const handleSignIn = async (e) => {
        e.preventDefault();

        setLoading(true);
        setErr("");
        try {
            let result = await axios.post(
                serverUrl + "/api/auth/login",
                formData,
                { withCredentials: true }
            );
            let currentUserRes = await axios.get(
                `${serverUrl}/api/user/currentuser`,
                {
                    withCredentials: true,
                }
            );
            setUserData(currentUserRes.data);

            navigate("/");

            if (result.status === 201) {
                setFormData({
                    email: "",
                    password: "",
                });
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
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
                    onSubmit={handleSignIn}
                    className="w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col justify-center p-[15px] gap-[10px]"
                >
                    <h1 className="text-gray-800 text-[30px] font-semibold pb-6">
                        Sign In
                    </h1>

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
                        className="w-full md:w-auto bg-[#24b2ff] text-white font-semibold mt-8 py-3 px-4 rounded-full hover:bg-blue-700 flex itmes-center justify-center "
                    >
                        {loading ? "Loading.." : "login"}
                    </button>
                    <p className="text-center">
                        want to create a new account ?{" "}
                        <span
                            className="text-[#24b2ff] cursor-pointer"
                            onClick={() => navigate("/signup")}
                        >
                            SignUp
                        </span>
                    </p>
                </form>
            </div>
        </>
    );
}

export default Login;
