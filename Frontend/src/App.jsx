import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { UserDataContext } from "./context/UserContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Network from "./pages/Network";
import Notification from "./pages/Notification.jsx";
import Profile from "./pages/Profile.jsx";
import SignUp from "./pages/SignUp";

function App() {
    let { userData, loading } = useContext(UserDataContext);

    if (loading) return <p className="text-center p-10">Loading...</p>;

    return (
        <Routes>
            <Route
                path="/"
                element={userData ? <Home /> : <Navigate to="/login" />}
            />
            <Route
                path="/signup"
                element={!userData ? <SignUp /> : <Navigate to="/" />}
            />
            <Route
                path="/login"
                element={!userData ? <Login /> : <Navigate to="/" />}
            />
            <Route
                path="/network"
                element={userData ? <Network /> : <Navigate to="/login" />}
            />
            <Route
                path="/profile"
                element={userData ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
                path="/notification"
                element={userData ? <Notification /> : <Navigate to="login" />}
            />
        </Routes>
    );
}

export default App;
