import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { AuthLayout } from "./components/index.js"
import { Write, Home, Users, Profile, Signin, Signup, OtherDetails, Blog, Bookmarks, History } from "./pages/index.js";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthLayout><App /></AuthLayout>,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/write",
                element: <Write />
            },
            {
                path: "/users",
                element: <Users />
            },
            {
                path: "/profile",
                element: <Profile />
            },
            {
                path: "/profile/:username",
                element: <Profile />
            },
            {
                path: "/signup",
                element: <Signup />
            },
            {
                path: "/login",
                element: <Signin />
            },
            {
                path: '/edit',
                element: <OtherDetails />
            },
            {
                path: "/blog/:blogId",
                element: <Blog />
            },
            {
                path:'/bookmarks',
                element: <Bookmarks />
            },
            {
                path: '/history',
                element: <History />
            }
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <RouterProvider router={router}>
        </RouterProvider>
    </Provider>,
)
