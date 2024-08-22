import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./presentation/pages/auth/sign-in";
// import router from "./infrastructure/routes/routes";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/login",
        element: <SignIn />,
    },
]);
function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
