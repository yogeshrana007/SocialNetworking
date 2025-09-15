import { createContext } from "react";
export const AuthDataContext = createContext();
const serverUrl = "http://localhost:8000";

let value = {
    serverUrl,
};

export default function AuthContext({ children }) {
    return (
        <>
            <AuthDataContext.Provider value={value}>
                {children}
            </AuthDataContext.Provider>
        </>
    );
}
