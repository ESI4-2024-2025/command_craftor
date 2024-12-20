import React, {ReactNode, useEffect, useState} from "react";
import "../../styles/Admin.css";
import {Navigate, useNavigate} from "react-router-dom";
import axios from "axios";

interface ProtectedRouteProps {
    children: ReactNode;
    role: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children, role}) => {
    const navigate = useNavigate();
    const [isAllowed, setIsAllowed] = useState<boolean|null>(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setIsAllowed(false);
        } else {
            axios.put(`${process.env.REACT_APP_HOST_BACK}/users/current`, {}, {
                headers: {
                    "x-access-token": token
                }
            }).then(response => {
                setIsAllowed(response.data[role] === true);
            }).catch(() => {
                setIsAllowed(false);
            });
        }
    }, [navigate, role]);

    if (isAllowed === null) {
        return <div>Chargement...</div>;
    }
    return isAllowed ? <>{children}</> : <Navigate to="/forbidden"/>;
}

export default ProtectedRoute;