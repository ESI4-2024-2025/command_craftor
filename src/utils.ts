import axios from "axios";
import {NavigateFunction} from "react-router-dom";

export function forbidAccessToAdminResource(navigate: NavigateFunction) {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        navigate("/forbidden");
    } else {
        axios.put(`${process.env.REACT_APP_HOST_BACK}/users/current`, {}, {
            headers: {
                "x-access-token": token
            }
        }).then(response => {
            if (response.data.admin == false) {
                navigate("/forbidden");
            }
        }).catch(() => {
            navigate("/forbidden");
        });
    }
}