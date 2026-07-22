import {
    ActivityFillIcon,
    ActivityIcon,
    CreateIcon,
    HomeFillIcon,
    HomeIcon,
    ProfileFillIcon,
    ProfileIcon,
    SearchFillIcon,
    SearchIcon,
} from "@/assets/icons";
import paths from "./path";

export const NAV_ITEMS = [
    {
        path: paths.home,
        icon: HomeIcon,
        activeIcon: HomeFillIcon,
        title: "Home",
        activePaths: [paths.home, paths.following, paths.ghost_posts],
    },
    {
        path: paths.search,
        icon: SearchIcon,
        activeIcon: SearchFillIcon,
        title: "Search",
    },
    {
        path: null,
        icon: CreateIcon,
        activeIcon: CreateIcon,
        title: "Create",
        isCreate: true,
    },
    {
        /* Icon Activity cần to hơn để đảm bảo "thị giác" */
        path: paths.activity,
        icon: ActivityIcon,
        activeIcon: ActivityFillIcon,
        title: "Activity",
        className: "h-[30px] w-[30px]",
    },
    {
        path: paths.profile,
        icon: ProfileIcon,
        activeIcon: ProfileFillIcon,
        title: "Profile",
    },
];
