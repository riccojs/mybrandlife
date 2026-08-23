import DashboardIcon from "../assets/menu-icons/dashboard.svg";
import SettingIcon from "../assets/menu-icons/settings.svg";
import ProfileIcon from "../assets/menu-icons/profile.svg";
import UserIcon from "../assets/menu-icons/user.svg";
import OnboardIcon from "../assets/menu-icons/onboard.svg";
import BrandbookIcon from "../assets/menu-icons/brandbook.svg";
import EchoIcon from "../assets/menu-icons/echo.svg";
import RefaralIcon from "../assets/menu-icons/referralcodes.svg";
import ReportIcon from "../assets/menu-icons/reports.svg";
import PulsetrackIcon from "../assets/menu-icons/pulsetrack.svg";
import WistbandIcon from "../assets/menu-icons/ristband.svg";
import SubscribeIcon from "../assets/app-icons/subscription.svg";
import SpinIcon from "../assets/menu-icons/spin.svg";

export type PackageType = "bronze" | "silver" | "gold";

export interface MenuChild {
  name: string;
  path: string;
  icon: string;
  requiredPackage?: PackageType;
}

export interface UserMenu {
  name: string;
  icon: string;
  children: MenuChild[];
}

export const userMenu: UserMenu[] = [
  {
    name: "Dashboard",
    icon: DashboardIcon,
    children: [
      {
        name: "Dashboard",
        path: "/",
        icon: DashboardIcon,
      },
    ],
  },

  {
    name: "Management",
    icon: UserIcon,
    children: [
      { name: "Onboard", path: "/onboard", icon: OnboardIcon },
      {
        name: "Build Your Lander",
        path: "/build-your-lander",
        icon: OnboardIcon,
      },
      {
        name: "BrandBook",
        path: "/brandbook",
        icon: BrandbookIcon,
        requiredPackage: "silver",
      },
      {
        name: "Echo",
        path: "/echo",
        icon: EchoIcon,
        requiredPackage: "gold",
      },
      {
        name: "SPIN",
        path: "/spin",
        icon: SpinIcon,
        requiredPackage: "silver",
      },
      {
        name: "Ordered Wristband",
        path: "/ordered-wristband",
        icon: WistbandIcon,
        requiredPackage: "silver",
      },
    ],
  },

  {
    name: "Analytics",
    icon: ReportIcon,
    children: [
      {
        name: "BrandTrack",
        path: "/brandtrack",
        icon: ReportIcon,
        requiredPackage: "gold",
      },
      {
        name: "Pulsetrack",
        path: "/pulsetrack",
        icon: PulsetrackIcon,
        requiredPackage: "gold",
      },
      {
        name: "BrandShare",
        path: "/brandshare",
        icon: RefaralIcon,
        requiredPackage: "gold",
      },
    ],
  },

  {
    name: "Subscription",
    icon: SubscribeIcon,
    children: [
      {
        name: "Subscription",
        path: "/subscription",
        icon: SubscribeIcon,
      },
    ],
  },

  {
    name: "Account",
    icon: SettingIcon,
    children: [
      {
        name: "Profile",
        path: "/profile",
        icon: ProfileIcon,
      },
      {
        name: "Setting",
        path: "/setting",
        icon: SettingIcon,
      },
    ],
  },
];
