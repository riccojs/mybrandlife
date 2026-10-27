import React, { useState } from "react";
import { Link } from "react-router";
import {
  CardSim,
  CircleCheckBig,
  Earth,
  FileUser,
  MailSearch,
  MapPinHouse,
  NotebookPen,
  NotebookTabs,
  PencilSparkles,
  SquareChartGantt,
  SquarePen,
  UserCheck,
  UserRoundPen,
  UserShield,
} from "lucide-react";
import { useAuth } from "../hook/useAuth";
import type { LocationType } from "../utils/user.types";
import UpdateAddress from "../component/profile/Update.address";

interface authType {
  user: UserType | null;
}

interface UserType {
  profile: string | null;
  landerName: string | null;
  domain: string | null;
  email: string | null;
  phone: string | null;
  status: string | null;
  midName: string | null;
  username: string | null;
  package: string | null;
  frequency: string | null;
  lastName: string | null;
  firstName: string | null;
  privateDomain: string | null;
  address: LocationType[];
  planKey: string | null;
}
function Profile() {
  const { user } = useAuth() as authType;
  const [primaryOpen, setPrimaryOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);

  const {
    landerName,
    email,
    phone,
    profile,
    midName,
    status,
    lastName,
    firstName,
    domain,
    package: pkg,
    frequency,
    planKey,
  } = user || {};

  const primaryAddress = user?.address?.find(
    (item: { type: string }) => item.type === "PRIMARY",
  ) as LocationType;
  const ShippingAddress = user?.address?.find(
    (item: { type: string }) => item.type === "SHIPPING",
  ) as LocationType;

  return (
    <React.Fragment>
      <div className="p-3 md:p-5">
        <div className="md:w-6/12 w-full">
          <h2 className="text-normal text-2xl md:text-3xl">Profile</h2>
          <ul className="flex flex-wrap gap-2 items-center py-2">
            <li>
              <Link to="/" className="text-normal text-sm md:text-base">
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
              <p className="text-normal text-sm md:text-base">Profile</p>
            </li>
          </ul>
        </div>
        <div>
          <div className="jost p-5 md:p-10 rounded-2xl shadow bg-white">
            <div className="relative rounded-2xl h-44 md:h-54 bg-linear-to-r from-[#08251e] via-[#064333] to-[#087354]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_82%_20%,rgba(17,185,129,0.19),transparent_40%),radial-gradient(ellipse_at_40%_100%,rgba(4,120,87,0.12),transparent_45%)]" />

              <div className="absolute left-2 md:left-7 top-4.5 rounded-full border border-white/15 bg-white/15 px-7 py-1.5 text-[10px] font-medium tracking-wide text-emerald-100">
                Profile Infos
              </div>

              <div className="absolute right-2 md:right-7 top-4.5 flex items-center gap-2 rounded-full border border-white/15 bg-[#052e25]/75 px-5 py-1.5 text-[10px] text-emerald-100">
                <CircleCheckBig size={12} />
                {status}
              </div>
              <div className="absolute -bottom-8 md:-bottom-14 left-8">
                {profile ? (
                  <img
                    src={profile}
                    alt=""
                    className="w-18 md:w-32 rounded-full min-h-18 object-cover md:min-h-32 h-18 md:h-32"
                  />
                ) : (
                  <p className="min-w-18 md:min-w-32 min-h-18 md:min-h-32 w-18 md:w-24 h-18 md:h-32 rounded-full bg-gray-300 text-6xl uppercase text-normal flex justify-center items-center">
                    {landerName?.slice(0, 1)}
                  </p>
                )}
              </div>
              <Link
                to="/setting"
                className="absolute -bottom-14 left-28 md:left-44 gap-2 border font-medium uppercase text-xs md:text-sm border-gray-200 bg-[#96c94b] text-black w-40 md:w-48 min-w-40 md:min-w-48 h-12 rounded-xl flex justify-center items-center"
              >
                <PencilSparkles size={20} />
                <p>Update Setting</p>
              </Link>
            </div>
            <div className="mt-20">
              <div className="grid grid-cols-1 md:grid-cols-2 mt-2 md:mt-5 gap-3 md:gap-6">
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <MailSearch size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      EMAIL ADDRESS
                    </p>
                    <p className="text-[#2E3442] text-md">{email}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <UserRoundPen size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      FIRST NAME
                    </p>
                    <p className="text-[#2E3442] text-md">{firstName}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <UserShield size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      FIRST NAME
                    </p>
                    <p className="text-[#2E3442] text-md">{midName}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <UserCheck size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      LAST NAME
                    </p>
                    <p className="text-[#2E3442] text-md">{lastName}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <FileUser size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      LANDER NAME
                    </p>
                    <p className="text-[#2E3442] text-md">{landerName}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <CardSim size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      PHONE NUMBER
                    </p>
                    <p className="text-[#2E3442] text-md">{phone}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <Earth size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      USER DOMAIN
                    </p>
                    <p className="text-[#2E3442] text-md">{domain}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <SquareChartGantt size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      MEMBERSHIP PACKAGE
                    </p>
                    <p className="text-[#2E3442] text-md">{pkg}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <NotebookPen size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      PLAN FREQUENCY
                    </p>
                    <p className="text-[#2E3442] text-md">{frequency}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <NotebookTabs size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">PLAN KEY</p>
                    <p className="text-[#2E3442] text-md">{planKey}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex md:flex-row flex-col gap-5 w-full mt-5">
          <div className="bg-white border w-full border-gray-200 p-5 rounded-2xl shadow">
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-3 items-center">
                <span className="w-12 md:w-16 h-12 md:h-16 text-xs md:text-base rounded-full bg-green-100 text-green-700 flex justify-center items-center">
                  <MapPinHouse />
                </span>
                <h2 className="text-md md:text-xl font-medium">
                  Primary Address
                </h2>
              </div>
              <button
                onClick={() => setPrimaryOpen(true)}
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
              >
                <SquarePen size={20} />
              </button>
            </div>
            <div className="mt-5 overflow-x-auto custom-scroll">
              <table className="my-table table-fixed w-full min-w-96">
                <tbody>
                  <tr>
                    <td className="text-md font-medium p-2">Country:</td>
                    <td className="text-md font-normal p-2">
                      {primaryAddress?.country}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-md font-medium p-2">State:</td>
                    <td className="text-md font-normal p-2">
                      {primaryAddress?.state}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-md font-medium p-2">City:</td>
                    <td className="text-md font-normal p-2">
                      {primaryAddress?.city}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-md font-medium p-2">Postal Code:</td>
                    <td className="text-md font-normal p-2">
                      {primaryAddress?.zip}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-md font-medium p-2">Adress One:</td>
                    <td className="text-md font-normal p-2">
                      {primaryAddress?.streetOne}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-md font-medium p-2">Address Tow:</td>
                    <td className="text-md font-normal p-2">
                      {primaryAddress?.streetTow}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white border w-full border-gray-200 p-5 rounded-2xl shadow">
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-3 items-center">
                <span className="w-12 md:w-16 h-12 md:h-16 text-xs md:text-base rounded-full bg-red-100 text-red-700 flex justify-center items-center">
                  <NotebookTabs />
                </span>
                <h2 className="text-md md:text-xl font-medium">
                  Shipping Address
                </h2>
              </div>
              <button
                onClick={() => setShippingOpen(true)}
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
              >
                <SquarePen size={20} />
              </button>
            </div>
            <div className="mt-5 overflow-x-auto custom-scroll">
              <table className="my-table table-fixed w-full min-w-96">
                <tbody>
                  <tr>
                    <td className="text-md font-medium p-2">Country:</td>
                    <td className="text-md font-normal p-2">
                      {ShippingAddress?.country}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-md font-medium p-2">State:</td>
                    <td className="text-md font-normal p-2">
                      {ShippingAddress?.state}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-md font-medium p-2">City:</td>
                    <td className="text-md font-normal p-2">
                      {ShippingAddress?.city}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-md font-medium p-2">Postal Code:</td>
                    <td className="text-md font-normal p-2">
                      {ShippingAddress?.zip}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-md font-medium p-2">Adress One:</td>
                    <td className="text-md font-normal p-2">
                      {ShippingAddress?.streetOne}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-md font-medium p-2">Address Tow:</td>
                    <td className="text-md font-normal p-2">
                      {ShippingAddress?.streetTow}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <UpdateAddress
        type="PRIMARY"
        setOpen={setPrimaryOpen}
        open={primaryOpen}
      />
      <UpdateAddress
        type="SHIPPING"
        setOpen={setShippingOpen}
        open={shippingOpen}
      />
    </React.Fragment>
  );
}

export default Profile;
