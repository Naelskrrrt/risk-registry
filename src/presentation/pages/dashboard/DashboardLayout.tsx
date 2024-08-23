import React from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <div>
            <aside>Hello World</aside>
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
