import React, { useState } from "react";
import { Link } from "react-router";
import { MapPinHouse, NotebookTabs, SquarePen } from "lucide-react";
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
  role: string | null;
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
    role,
    midName,
    username,
    status,
    lastName,
    firstName,
    domain,
    package: pkg,
    frequency,
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
              <p className="text-normal text-sm md:text-base">Profile</p>
            </li>
          </ul>
        </div>
        <div>
          <div className="jost border border-gray-300 p-5 md:p-10 rounded-lg bg-white">
            <div className="border-b border-gray-300 pb-5">
              <p className="text-2xl text-medium">Profile Infos</p>
              <p className="text-gray-500 text-md font-normal">
                Your detail profile infos
              </p>
            </div>
            <div className="mt-5">
              <div className="border-b border-gray-300 pb-5">
                {profile ? (
                  <img src={profile} alt="" className="w-24 rounded-md mt-2" />
                ) : (
                  <p className="min-w-24 min-h-24 w-24 h-24 rounded-md bg-gray-300 text-6xl uppercase text-normal flex justify-center items-center">
                    {landerName?.slice(0, 1)}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-6">
                <div className="flex flex-col gap-1">
                  <p>First Name</p>
                  <span className="bg-[#F1F1F1] flex gap-2 items-center border border-gray-200 rounded-md">
                    <i className="fa-solid fa-user-gear border-r border-gray-200 py-3 px-4 text-xl"></i>
                    <p className="text-bold text-md p-3">
                      {firstName ? firstName : "Not available"}
                    </p>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p>Mid Name</p>
                  <span className="bg-[#F1F1F1] flex gap-2 items-center border border-gray-200 rounded-md">
                    <i className="fa-regular fa-id-badge border-r border-gray-300 py-3 px-4 text-xl"></i>
                    <p className="text-bold text-md p-3">
                      {midName ? midName : "Not available"}
                    </p>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p>Last Name</p>
                  <span className="bg-[#F1F1F1] flex gap-2 items-center border border-gray-200 rounded-md">
                    <i className="fa-solid fa-user-gear border-r border-gray-200 py-3 px-4 text-xl"></i>
                    <p className="text-bold text-md p-3">
                      {lastName ? lastName : "Not available"}
                    </p>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p>Lander name</p>
                  <span className="bg-[#F1F1F1] flex gap-2 items-center border border-gray-200 rounded-md">
                    <i className="fa-regular fa-user border-r border-gray-300 py-3 px-4 text-xl"></i>
                    <p className="text-bold text-md p-3">{landerName}</p>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p>Username</p>
                  <span className="bg-[#F1F1F1] flex gap-2 items-center border border-gray-200 rounded-md">
                    <i className="fa-regular fa-user border-r border-gray-300 py-3 px-4 text-xl"></i>
                    <p className="text-bold text-md capitalize p-3">
                      {username}
                    </p>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p>Email</p>
                  <span className="bg-[#F1F1F1] flex gap-2 items-center border border-gray-300 rounded-md">
                    <i className="fa-regular fa-envelope border-r border-gray-300 px-4 py-3 text-xl"></i>
                    <p className="text-bold text-md p-3">{email}</p>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p>Your phone number</p>
                  <span className="bg-[#F1F1F1] flex gap-2 items-center border border-gray-200 rounded-md">
                    <i className="fa-solid fa-phone-volume border-r border-gray-300 py-3 px-4 text-lg"></i>
                    <p className="text-bold text-md p-3">
                      {phone ? phone : "Not availavle"}
                    </p>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p>Role</p>
                  <span className="bg-[#F1F1F1] flex gap-2 items-center border border-gray-200 rounded-md">
                    <i className="fa-solid fa-ruler-vertical border-r border-gray-300 py-3 px-4 text-2xl"></i>
                    <p className="text-bold text-md p-3">{role}</p>
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <p>Membership Domain</p>
                  <span className="bg-[#F1F1F1] flex gap-2 items-center border border-gray-200 rounded-md">
                    <i className="fa-solid fa-people-group border-r border-gray-300 py-3 px-4 text-xl"></i>
                    <p className="text-bold text-md p-3 uppercase">
                      {domain ? domain : "Not available"}
                    </p>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p>Membership Package</p>
                  <span className="bg-[#F1F1F1] flex gap-2 items-center border border-gray-200 rounded-md">
                    <i className="fa-solid fa-people-group border-r border-gray-300 py-3 px-4 text-xl"></i>
                    <p className="text-bold text-md p-3 uppercase">
                      {pkg ? pkg : "Not available"}
                    </p>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p>Membership Frequency</p>
                  <span className="bg-[#F1F1F1] flex gap-2 items-center border border-gray-200 rounded-md">
                    <i className="fa-solid fa-people-group border-r border-gray-300 py-3 px-4 text-xl"></i>
                    <p className="text-bold text-md p-3 uppercase">
                      {frequency ? frequency : "Not available"}
                    </p>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p>Profile Status</p>
                  <span className="bg-[#F1F1F1] flex gap-2 items-center border border-gray-200 rounded-md">
                    <div className="border-r border-gray-300 py-3 px-4">
                      <i className="fa-solid fa-circle-check text-xl"></i>
                    </div>
                    <p
                      className={` py-1 px-3 rounded-md text-xs font-bold w-fit ${
                        status === "ACTIVATE"
                          ? "text-green-500 bg-green-100"
                          : "text-red-500 bg-red-100"
                      }`}
                    >
                      {status}
                    </p>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex md:flex-row flex-col gap-5 w-full mt-5">
          <div className="bg-white border w-full border-gray-200 p-5 rounded-xl">
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-3 items-center">
                <span className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex justify-center items-center">
                  <MapPinHouse />
                </span>
                <h2 className="text-xl font-medium">Primary Address</h2>
              </div>
              <button
                onClick={() => setPrimaryOpen(true)}
                className="w-12 cursor-pointer h-12 rounded-lg bg-yellow-100 text-yellow-700 flex justify-center items-center"
              >
                <SquarePen />
              </button>
            </div>
            <div className="mt-5">
              <table className="my-table table-fixed w-full">
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
          <div className="bg-white border w-full border-gray-200 p-5 rounded-xl">
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-3 items-center">
                <span className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex justify-center items-center">
                  <NotebookTabs />
                </span>
                <h2 className="text-xl font-medium">Shipping Address</h2>
              </div>
              <button
                onClick={() => setShippingOpen(true)}
                className="cursor-pointer w-12 h-12 rounded-lg bg-yellow-100 text-yellow-700 flex justify-center items-center"
              >
                <SquarePen />
              </button>
            </div>
            <div className="mt-5">
              <table className="my-table table-fixed w-full">
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
