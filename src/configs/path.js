const paths = {
    /* Auth */
    login: "/login",
    register: "/register",
    forgot_password: "/forgot-password",
    reset_password: "/reset-password",

    /* Page */
    home: "/",
    search: "/search",
    activity: "/activity",
    profile: "/profile",

    /* Feed Tab */
    following: "/following",
    ghost_posts: "/ghost_posts",
};

/* Danh sách các route được phép hiển thị Splash Screen */
export const SPLASH_PATHS = [
    paths.home,
    paths.search,
    paths.activity,
    paths.profile,
    paths.following,
    paths.ghost_posts,
];

export default paths;
