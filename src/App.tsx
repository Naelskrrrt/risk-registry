import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./core/secure/ProtectedRoute";
import AdminUser from "./presentation/pages/dashboard/Admin/AdminUser";

const SignIn = lazy(() => import("./presentation/pages/auth/sign-in"));
const DashboardLayout = lazy(
    () => import("./presentation/pages/dashboard/DashboardLayout")
);
const AssessementEvalutation = lazy(
    () => import("./presentation/pages/dashboard/RiskAssessement/Evaluation")
);
const AssessementIdentification = lazy(
    () =>
        import("./presentation/pages/dashboard/RiskAssessement/Identification")
);
const ItEvaluation = lazy(
    () => import("./presentation/pages/dashboard/RiskIt/Evaluation")
);
const ItIdentification = lazy(
    () => import("./presentation/pages/dashboard/RiskIt/Identification")
);
const HomePage = lazy(() => import("./presentation/pages/home/home"));
const NotFound = lazy(
    () => import("./presentation/pages/redirect/error/NotFound")
);
const Unauthorized = lazy(
    () => import("./presentation/pages/redirect/error/Unauthorized")
);

const roles: string[] = ["ADMIN", "RRA", "RIT", "VISITEUR"];

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
        errorElement: <NotFound />,
    },
    {
        path: "/unauthorized",
        element: <Unauthorized />,
        errorElement: <NotFound />,
    },
    {
        path: "/login",
        element: <SignIn />,
        errorElement: <NotFound />,
    },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            {
                path: "",
                element: (
                    <ProtectedRoute allowedRoles={[roles[0]]}>
                        <Outlet />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        path: "admin",
                        element: <AdminUser />,
                    },
                ],
            },
            {
                path: "risk-assessment",
                element: (
                    <ProtectedRoute allowedRoles={[roles[1]]}>
                        <Outlet />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        path: "identification",
                        element: <AssessementIdentification />,
                        errorElement: <NotFound />,
                    },
                    {
                        path: "evaluation",
                        element: <AssessementEvalutation />,
                        errorElement: <NotFound />,
                    },
                ],
            },
            {
                path: "risk-it",
                element: (
                    <ProtectedRoute allowedRoles={[roles[2]]}>
                        <Outlet />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        path: "identification",
                        element: <ItIdentification />,
                        errorElement: <NotFound />,
                    },
                    {
                        path: "evaluation",
                        element: <ItEvaluation />,
                        errorElement: <NotFound />,
                    },
                ],
            },
        ],
    },
]);

function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RouterProvider router={router} />
        </Suspense>
    );
}

export default App;
