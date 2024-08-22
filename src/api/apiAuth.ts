import axios from "axios";

export const apiAuth = axios.create({
    baseURL: "http://192.168.56.26:8001/api/v1/",
    headers: {
        "Content-Type": "application/json",
    },
});
