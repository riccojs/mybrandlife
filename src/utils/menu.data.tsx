import DashboardIcon from "../assets/menu-icons/dashboard.svg";
import SettingIcon from "../assets/menu-icons/settings.svg";
import ProfileIcon from "../assets/menu-icons/profile.svg";
import UserIcon from "../assets/menu-icons/user.svg";
import OnboardIcon from "../assets/menu-icons/onboard.svg";
import BrandbookIcon from "../assets/menu-icons/brandbook.svg";
import EchoIcon from "../assets/menu-icons/echo.svg";
import DomainIcon from "../assets/menu-icons/domainrequests.svg";
import PartnerIcon from "../assets/menu-icons/partners.svg";
import RefaralIcon from "../assets/menu-icons/referralcodes.svg";
import ContactIcon from "../assets/menu-icons/contact.svg";
import ReportIcon from "../assets/menu-icons/reports.svg";
import PulsetrackIcon from "../assets/menu-icons/pulsetrack.svg";
import WistbandIcon from "../assets/menu-icons/ristband.svg";
import SpinIcon from "../assets/menu-icons/spin.svg";
import ActivityIcon from "../assets/app-icons/activity.png";
import NotificationIcon from "../assets/app-icons/notification.png";
import ContactVaultIcon from "../assets/app-icons/contact-vault.png";

const menuData = [
  {
    name: "Dashboard",
    icon: DashboardIcon,
    children: [{ name: "Dashboard", path: "/", icon: DashboardIcon }],
  },
  {
    name: "Management",
    icon: UserIcon,
    children: [
      { name: "User", path: "/user", icon: UserIcon },
      { name: "Onboard", path: "/onboard", icon: OnboardIcon },
      { name: "BrandBook", path: "/brandbook", icon: BrandbookIcon },
      { name: "Echo", path: "/echo", icon: EchoIcon },
      { name: "SPIN", path: "/spin", icon: SpinIcon, restrict: true },
    ],
  },
  {
    name: "Services",
    icon: RefaralIcon,
    children: [
      {
        name: "Domain Requests",
        path: "/domain_request",
        icon: DomainIcon,
      },
      { name: "Partners", path: "/partner", icon: PartnerIcon },
      { name: "BrandShare", path: "/brandshare", icon: RefaralIcon },
      { name: "Contact", path: "/contact", icon: ContactIcon },
    ],
  },
  {
    name: "Analytics",
    icon: ReportIcon,
    children: [
      {
        name: "Report",
        path: "/report",
        icon: ReportIcon,
      },
      { name: "Pulsetrack", path: "/pulsetrack", icon: PulsetrackIcon },
      { name: "Activity Log", path: "/activity", icon: ActivityIcon },
      {
        name: "Contact Vault",
        path: "/vault_contact",
        icon: ContactVaultIcon,
      },
      {
        name: "Notification",
        path: "/notification",
        icon: NotificationIcon,
      },
    ],
  },
  {
    name: "Products",
    icon: WistbandIcon,
    children: [
      {
        name: "Wristband",
        path: "/wristband",
        icon: WistbandIcon,
      },
      {
        name: "Ordered Wristband",
        path: "/ordered-wristband",
        icon: WistbandIcon,
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

export default menuData;
