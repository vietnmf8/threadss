import { lazy } from "react";
import paths from "./configs/path";
import AuthLayout from "./layouts/AuthLayout";
import DefaultLayout from "./layouts/DefaultLayout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";

/* Lazy Load */
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));

const routes = [
    {
        layout: DefaultLayout,
        children: [
            { path: paths.home, component: Home },
            { path: paths.following, component: Home },
            { path: paths.ghost_posts, component: Home },
            { path: paths.search, component: Search },
            { path: paths.activity, component: Activity, private: true },
            { path: paths.profile, component: Profile, private: true },
        ],
    },
    {
        layout: AuthLayout,
        children: [
            { path: paths.register, component: Register },
            { path: paths.login, component: Login },
            { path: paths.forgot_password, component: ForgotPassword },
            { path: paths.reset_password, component: ResetPassword },
        ],
    },
];

export default routes;
