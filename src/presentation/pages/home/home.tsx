import useAuthRedirect from "@/hooks/useAuthRedirect";
import React from "react";

const HomePage = () => {
	useAuthRedirect();
	return <div>Hello Home page</div>;
};

export default HomePage;
