import {useTranslation} from "react-i18next";
import {useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const TicketsMonitoring = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    let tickets = [];

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/");
        } else {
            axios.get(`${process.env.REACT_APP_HOST_BACK}/tickets`, {
                headers: {
                    "x-access-token": token
                }
            }).then(response => {
                response.data.forEach((element: any) => {
                    tickets.push({
                        title: element.titre,
                        email: element.email,
                        status: element.statut,
                    })
                })
            });
        }
    }, []);
    return (<></>);
};

export default TicketsMonitoring;