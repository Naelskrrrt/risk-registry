import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./presentation/pages/auth/sign-in";
import HomePage from "./presentation/pages/home/home";
import NotFound from "./presentation/pages/redirect/error/NotFound";
import DashboardLayout from "./presentation/pages/dashboard/DashboardLayout";
import AssessementIdentification from "./presentation/pages/dashboard/RiskAssessement/Identification";
import AssessementEvalutation from "./presentation/pages/dashboard/RiskAssessement/Evaluation";
import ItIdentification from "./presentation/pages/dashboard/RiskIt/Identification";
import ItEvaluation from "./presentation/pages/dashboard/RiskIt/Evaluation";
import ProtectedRoute from "./core/secure/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
        errorElement: <NotFound />,
    },
    {
        path: "/login",
        element: <SignIn />,
        errorElement: <NotFound />,
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "risk-assessment",
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
    return <RouterProvider router={router} />;
}

export default App;
