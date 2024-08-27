import { useAuth } from "@/context/AuthProvider";
import React from "react";

const Identification = () => {
	const { user } = useAuth();
	return <div>Risk Identification {user?.email}</div>;
};

export default Identification;
