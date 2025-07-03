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
	const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

	/**
	 * useEffect hook to check if the user has the required role.
	 * If the user does not have the required role, they are redirected to the forbidden page.
	 */
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

	/**
	 * If the isAllowed state is null, it means the check is still in progress.
	 * In this case, we return a loading message.
	 * If the user is allowed, we render the children components.
	 * If the user is not allowed, we redirect them to the forbidden page.
	 */
	if (isAllowed === null) {
		return <div>Chargement...</div>;
	}
	return isAllowed ? <>{children}</> : <Navigate to="/forbidden"/>;
};

export default ProtectedRoute;