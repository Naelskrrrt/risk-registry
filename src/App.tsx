import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./presentation/pages/auth/sign-in";

const router = createBrowserRouter([
    {
        path: "/",
        element: <p>Hello Home</p>,
        children: [
            {
                path: "about",
                element: <p>Hello About</p>,
            },
        ],
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
