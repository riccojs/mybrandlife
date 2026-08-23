import React, { useState } from "react";
import Banner from "../assets/job-feed-logo.webp";
import { Link } from "react-router";
import {
  Globe,
  Calendar,
  ChevronRight,
  NotebookTabs,
  MapPinHouse,
  AudioLines,
} from "lucide-react";
import { FileText, HelpCircle } from "lucide-react";
import UpdateMembership from "../component/Update.membership";
import type { LocationType } from "../utils/user.types";
import { useAuth } from "../hook/useAuth";

interface ActionItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  rowBg: string;
  hoverBg: string;
  url: string;
}

interface authType {
  user: UserType | null;
}

interface UserType {
  phone: string | null;
  domain: string | null;
  package: string | null;
  frequency: string | null;
  planPrice: string | null;
  membership: MembershipType;
  id: string;
  firstName: string;
  lastName: string;
  midName: string;
  email: string;
  landerName: string;
  status: string;
  address: LocationType[];
}

interface MembershipType {
  create_at: string | null;
  activate_at: string | null;
  price: string | null;
  duration: string | null;
  status: string | null;
  expired: string | null;
}

const actions: ActionItem[] = [
  {
    id: "billing",
    label: "Update Address",
    icon: FileText,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    rowBg: "bg-[#edf2fa]",
    hoverBg: "hover:bg-[#e2ebf7]",
    url: "/profile",
  },
  {
    id: "support",
    label: "Contact Support",
    icon: HelpCircle,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    rowBg: "bg-[#eaf5ef]",
    hoverBg: "hover:bg-[#ddede4]",
    url: "https://mybrandlife.me/contact",
  },
  {
    id: "cancel",
    label: "Wristband Tracking",
    icon: AudioLines,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    rowBg: "bg-[#faeded]",
    hoverBg: "hover:bg-[#f5e2e2]",
    url: "https://mybrandlife.me/wistband/tracking",
  },
];

function Subscription() {
  const { user } = useAuth() as authType;
  const [showTab, setShowTab] = useState(false);
  const {
    phone,
    domain,
    package: pkgType,
    frequency,
    firstName,
    lastName,
    midName,
    email,
    landerName,
    status: userStatus,
    address,
  } = user || {};

  const ShippingAddress = address?.find((itme) => itme.type === "SHIPPING");
  const primaryAddress = address?.find((itme) => itme.type === "PRIMARY");

  const { create_at, activate_at, price, status } = user?.membership || {};

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getRemainingDays = (date: string) => {
    const targetDate = new Date(date);
    const currentDate = new Date();

    const diffInMs = targetDate.getTime() - currentDate.getTime();

    return Math.max(0, Math.ceil(diffInMs / (1000 * 60 * 60 * 24)));
  };

  return (
    <React.Fragment>
      <div className="p-3 md:p-5 min-h-screen">
        <div className="md:w-6/12 w-full">
          <h2 className="text-normal text-2xl md:text-3xl">Subsription</h2>
          <ul className="flex gap-2 items-center py-2">
            <li>
              <Link
                to="/dashboard"
                className="text-normal text-sm md:text-base"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <i className="fa-solid fa-angles-right text-xs"></i>
            </li>
            <li>
              <p className="text-normal text-sm md:text-base">{user?.domain}</p>
            </li>
            <li>
              <i className="fa-solid fa-angles-right text-xs"></i>
            </li>
            <li>
              <p className="text-normal text-sm md:text-base">Subsription</p>
            </li>
          </ul>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-5">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-30">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Current Plan
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-2xl font-bold text-emerald-800 uppercase">
                    {pkgType}
                  </h3>
                  <span
                    className={`text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full ${status === "ACTIVATE" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                  >
                    {status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                {frequency === "yearly"
                  ? "Annual Billing Cycle"
                  : "Monthly Billing Cycle"}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-30">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {frequency === "yearly" ? "Annual Price" : "Monthly Price"}
                </p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  ${price}
                </h3>
              </div>
              <p className="text-sm text-slate-500">
                Next invoice on{" "}
                {activate_at ? formattedDate(activate_at) : "not-available"}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-30">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Subscription Start
                </p>
                <div className="flex items-center gap-2 mt-1 text-emerald-700">
                  <Calendar className="w-5 h-5" />
                  <h3 className="text-xl font-bold text-slate-800">
                    {create_at ? formattedDate(create_at) : "not-available"}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                {frequency === "yearly"
                  ? "Annual Activation"
                  : "Monthly Activation"}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-30">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Renewal Date
                </p>
                <div className="flex items-center gap-2 mt-1 text-red-500">
                  <Calendar className="w-5 h-5" />
                  <h3 className="text-xl font-bold text-slate-800">
                    {activate_at ? formattedDate(activate_at) : "not-available"}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                {activate_at ? getRemainingDays(activate_at) : null} days until
                next invoice
              </p>
            </div>
          </div>
          <div className="flex xl:flex-row flex-col gap-5">
            <div className="bg-white md:w-9/12 w-full border border-gray-200 p-5 md:p-10 rounded-3xl flex lg:flex-row flex-col gap-10 md:gap-0 justify-between items-center">
              <div className="flex flex-col gap-2">
                <p className="bg-green-100 text-green-600 px-5 py-2 rounded-full text-sm w-fit uppercase font-medium">
                  {domain}
                </p>

                <h2 className="jost text-medium text-xl md:text-3xl">
                  Build Your Brand with My Brand Life
                </h2>
                <h2 className="jost text-medium text-xl leading-relaxed">
                  From idea to launch, manage everything in one place — create,
                  customize, and scale your business with ease.
                </h2>
                <p className="text-gray-400 font-normal text-lg">
                  Top Template Development Platform
                </p>
                <p className="text-gray-400 font-normal text-lg">
                  Login | Build | Launch | Succeed 🚀
                </p>
              </div>
              <img src={Banner} alt="" />
            </div>
            <div className="w-full md:w-3/12 bg-white border border-gray-200 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              <h2 className="text-2xl font-bold text-[#1a2b49] mb-6 tracking-tight">
                Quick Actions
              </h2>
              <div className="flex flex-col gap-4">
                {actions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <a
                      key={action.id}
                      href={action.url}
                      target="_blank"
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 group text-left ${action.rowBg} ${action.hoverBg}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2.5 rounded-full ${action.iconBg} ${action.iconColor} shadow-sm flex items-center justify-center`}
                        >
                          <IconComponent className="w-5 h-5 stroke-[2.25]" />
                        </div>
                        <span className="font-semibold text-[#1a2b49] text-base tracking-wide">
                          {action.label}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500 opacity-80 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl my-5 border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed text-left border-collapse min-w-200">
                <thead>
                  <tr className="bg-[#edf2f7] text-[10px] font-bold tracking-wider text-slate-500 uppercase border-b border-slate-100">
                    <th className="py-5 px-6">Domain Name</th>
                    <th className="py-5 px-6">Plan Type</th>
                    <th className="py-5 px-6">Price</th>
                    <th className="py-5 px-6 text-center">Status</th>
                    <th className="py-5 px-6 text-right">Activate At</th>
                    <th className="py-5 px-6 text-right">Expired In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="text-sm transition-colors hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-slate-100 rounded text-slate-500">
                          <Globe className="w-4 h-4" />
                        </div>
                        {domain}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{pkgType}</td>
                    <td className="py-4 px-6 font-medium text-slate-700">
                      ${price}
                    </td>
                    <td className="py-4 px-6 text-center">{status}</td>
                    <td className="py-4 px-6 text-right">
                      {create_at ? formattedDate(create_at) : null}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {activate_at ? formattedDate(activate_at) : null}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-fixed text-left border-collapse min-w-200">
                <thead>
                  <tr className="bg-[#edf2f7] text-[10px] font-bold tracking-wider text-slate-500 uppercase border-b border-slate-100">
                    <th className="py-5 px-6">User Name</th>
                    <th className="py-5 px-6">User Email</th>
                    <th className="py-5 px-6">USer Phone</th>
                    <th className="py-5 px-6 text-center">Landername</th>
                    <th className="py-5 px-6 text-right">User Status</th>
                    <th className="py-5 px-6 text-right">User Domain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="text-sm transition-colors hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-semibold text-slate-700">
                      {`${firstName} ${midName} ${lastName}`}
                    </td>
                    <td className="py-4 px-6 text-slate-600 max-w-55 break-all">
                      {email?.slice(0, 20)}...
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">
                      {phone}
                    </td>
                    <td className="py-4 px-6 text-center">{landerName}</td>
                    <td className="py-4 px-6 text-right">{userStatus}</td>
                    <td className="py-4 px-6 text-right">{domain}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex md:flex-row flex-col gap-5 w-full mt-5">
            <div className="bg-white border w-full border-gray-200 p-5 rounded-3xl shadow">
              <div className="flex justify-between items-center w-full">
                <div className="flex gap-3 items-center">
                  <span className="w-16  h-16 rounded-full bg-green-100 text-green-700 flex justify-center items-center">
                    <MapPinHouse />
                  </span>
                  <h2 className="text-lg md:text-xl font-medium">
                    Primary Address
                  </h2>
                </div>
              </div>
              <div className="mt-5">
                <table className="my-table table-fixed w-full">
                  <tbody>
                    <tr>
                      <td className="text-sm md:text-md font-medium p-2">
                        Country:
                      </td>
                      <td className="text-sm md:text-md font-normal p-2">
                        {primaryAddress?.country}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm md:text-md font-medium p-2">
                        State:
                      </td>
                      <td className="text-sm md:text-md font-normal p-2">
                        {primaryAddress?.state}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm md:text-md font-medium p-2">
                        City:
                      </td>
                      <td className="text-sm md:text-md font-normal p-2">
                        {primaryAddress?.city}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm md:text-md font-medium p-2">
                        Postal Code:
                      </td>
                      <td className="text-sm md:text-md font-normal p-2">
                        {primaryAddress?.zip}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm md:text-md font-medium p-2">
                        Adress One:
                      </td>
                      <td className="text-sm md:text-md font-normal p-2">
                        {primaryAddress?.streetOne}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm md:text-md font-medium p-2">
                        Address Tow:
                      </td>
                      <td className="text-sm md:text-md font-normal p-2">
                        {primaryAddress?.streetTow}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white border w-full border-gray-200 p-5 rounded-3xl shadow">
              <div className="flex justify-between items-center w-full">
                <div className="flex gap-3 items-center">
                  <span className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex justify-center items-center">
                    <NotebookTabs />
                  </span>
                  <h2 className="text-lg md:text-xl font-medium">
                    Shipping Address
                  </h2>
                </div>
              </div>
              <div className="mt-5">
                <table className="my-table table-fixed w-full">
                  <tbody>
                    <tr>
                      <td className="text-sm md:text-md font-medium p-2">
                        Country:
                      </td>
                      <td className="text-sm md:text-md font-normal p-2">
                        {ShippingAddress?.country}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm md:text-md font-medium p-2">
                        State:
                      </td>
                      <td className="text-sm md:text-md font-normal p-2">
                        {ShippingAddress?.state}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm md:text-md font-medium p-2">
                        City:
                      </td>
                      <td className="text-sm md:text-md font-normal p-2">
                        {ShippingAddress?.city}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm md:text-md font-medium p-2">
                        Postal Code:
                      </td>
                      <td className="text-sm md:text-md font-normal p-2">
                        {ShippingAddress?.zip}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm md:text-md font-medium p-2">
                        Adress One:
                      </td>
                      <td className="text-sm md:text-md font-normal p-2">
                        {ShippingAddress?.streetOne}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm md:text-md font-medium p-2">
                        Address Tow:
                      </td>
                      <td className="text-sm md:text-md font-normal p-2">
                        {ShippingAddress?.streetTow}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTab && (
        <UpdateMembership
          id={user?.id ?? ""}
          showUpdateTab={showTab}
          setShowUpdateTab={setShowTab}
          domain={user?.domain ?? ""}
        />
      )}
    </React.Fragment>
  );
}

export default Subscription;
