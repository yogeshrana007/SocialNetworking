import { createContext } from "react";
export const AuthDataContext = createContext();
const serverUrl = import.meta.env.VITE_SERVER_URL;

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
