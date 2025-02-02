import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("token"));
    const [current_user, setCurrentUser] = useState(null);

    // LOGIN
    const login = (email, password) => {
        toast.loading("Logging you in...");
        fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        })
        .then((resp) => resp.json())
        .then((response) => {
            if (response.access_token) {
                toast.dismiss();
                sessionStorage.setItem("token", response.access_token);
                setAuthToken(response.access_token);

                fetch('http://127.0.0.1:5000/current_user', {
                    method: "GET",
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Bearer ${response.access_token}`
                    }
                })
                .then((response) => response.json())
                .then((response) => {
                    if (response.email) {
                        setCurrentUser(response);
                    }
                });

                toast.success("Successfully Logged in");
                navigate("/");
            } else if (response.error) {
                toast.dismiss();
                toast.error(response.error);
            } else {
                toast.dismiss();
                toast.error("Failed to login");
            }
        })
        .catch((error) => {
            toast.dismiss();
            toast.error("Network error. Please try again.");
        });
    };

    const logout = async () => {
        toast.loading("Logging out...");
        fetch("http://127.0.0.1:5000/logout", {
            method: "DELETE",
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${authToken}`
            }
        })
        .then((response) => response.json())
        .then((response) => {
            toast.dismiss();
            if (response.success) {
                toast.success(response.success);
            } else {
                toast.error(response.error || "Logout failed");
            }
            sessionStorage.removeItem("token");
            setAuthToken(null);
            setCurrentUser(null);
            navigate("/login");
        })
        .catch((error) => {
            toast.dismiss();
            toast.error("Network error. Please try again.");
        });
    };

    // Fetch current user
    useEffect(() => {
        if (authToken) {
            fetchCurrentUser();
        }
    }, [authToken]);

    const fetchCurrentUser = () => {
        fetch('http://127.0.0.1:5000/current_user', {
            method: "GET",
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${authToken}`
            }
        })
        .then((response) => response.json())
        .then((response) => {
            if (response.email) {
                setCurrentUser(response);
            }
        })
        .catch((error) => {
            console.error("Failed to fetch current user", error);
            logout();
        });
    };

    // ADD user
    const addUser = (full_name, email, role, password) => {
        console.log("Registering user with:", { full_name, email, role }); 
        toast.loading("Registering...");
        fetch("http://127.0.0.1:5000/users", {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                full_name, 
                email, 
                role,
                password
            })
        })
        .then((resp) => resp.json())
        .then((response) => {
            if (response.success) {  
                toast.dismiss();
                toast.success(response.success);  
                navigate("/login");
            } else if (response.error) {
                toast.dismiss();
                toast.error(response.error);
            } else {
                toast.dismiss();
                toast.error("Failed to register");
            }
        })
        .catch((error) => {
            console.error("Registration error:", error);  
            toast.dismiss();
            toast.error("Network error. Please try again.");
        });
    };

    const data = {
        authToken,
        login,
        current_user,
        logout,
        addUser,
        fetchCurrentUser
    };

    return (
        <UserContext.Provider value={data}>
            {children}
        </UserContext.Provider>
    );
};
