import axios from "axios";

export const apiUser = axios.create({
    baseURL: "http://localhost:4000/users",
    headers: {
        "Content-Type": "application/json",
    },
});
