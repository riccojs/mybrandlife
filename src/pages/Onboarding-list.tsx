import React from "react";
import { Link, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import Pagination from "../component/Pagination";
import { useAuth } from "../hook/useAuth";
import SearchComponent from "../component/ui/Search.component";
import SelectComponent from "../component/ui/Select.component";
import OnboardLoader from "../component/loader/Onboard.loadder";
import { useGetAllOnboardQuery } from "../redux/features/onboard/onboardApi";
import { CalendarRange, Globe } from "lucide-react";

interface UserType {
  package?: string;
  id: string;
  userTemplete: [];
  membership: { status: string }[];
  domain: string;
}

interface OnboardUser {
  domain: string;
  landerName: string;
}

function OnboardingList() {
  const { user } = useAuth() as { user: UserType | null };
  const [searchParams, setSearchParams] = useSearchParams();
  const limit = 14;
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const { data, isLoading, isFetching } = useGetAllOnboardQuery({
    page: page,
    limit: limit,
    searchBy: search,
    statusBy: status,
    userId: user?.id,
  });
  const onboardLists = data?.data?.onboard;
  const currentPage = data?.data?.currentPage || [];
  const totalItem = data?.data?.totalOnboard || 0;
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItem);

  const handlePageChange = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
  };

  const handleChange = (value: string) => {
    if (value) {
      searchParams.set("status", value);
      searchParams.set("page", "1");
    } else {
      searchParams.delete("status");
      searchParams.delete("page");
    }
    setSearchParams(searchParams);
  };

  const handleRedirect = (
    domain: string,
    landerName: string,
    verify: boolean,
  ) => {
    if (!verify) {
      toast.error("Onboard is pending!");
      return;
    }
    window.open(`https://${domain}/${landerName}`, "_blank");
  };

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // decide what to render
  let content;
  if (isLoading) {
    content = [...Array(8)].map((_, i) => <OnboardLoader key={i} />);
  }

  if (isFetching) {
    content = [...Array(8)].map((_, i) => <OnboardLoader key={i} />);
  }
  if (!isLoading && !isFetching && onboardLists?.length === 0) {
    content = (
      <tr>
        <td colSpan={6} className="p-0!">
          <p className="bg-[#FEFBED] text-center text-[#643315] text-md font-normal py-5 rounded-md">
            Data not found!
          </p>
        </td>
      </tr>
    );
  }
  if (!isLoading && !isFetching && onboardLists?.length > 0) {
    content = onboardLists?.map(
      (item: {
        id: string;
        domain: string;
        plan: string;
        bio: string;
        create_at: string;
        userId: string;
        verify: boolean;
        user: OnboardUser;
      }) => {
        const { id, bio, create_at, verify, user } = item || {};
        const { domain, landerName } = user;
        return (
          <tr key={id} className="hover:bg-gray-50">
            <td>
              <div className="flex gap-2 items-center">
                <CalendarRange color="#12544F" size={20} />
                {formattedDate(create_at)}
              </div>
            </td>
            <td>
              <div className="flex gap-2 items-center">
                <Globe color="#12544F" size={20} />
                <p className="text-sm">{domain}</p>
              </div>
            </td>
            <td className="text-sm">{landerName}</td>
            <td className="text-sm">{bio?.slice(0, 60)}</td>
            <td>
              <p
                className={`w-fit px-6 py-2 rounded-md text-center font-medium text-xs ${
                  verify
                    ? "bg-green-100 text-green-500"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {verify ? "ACTIVE" : "PENDING"}
              </p>
            </td>
            <td>
              <div className="flex gap-3">
                <button
                  onClick={() => handleRedirect(domain, landerName, verify)}
                  className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                >
                  <i className="fa-regular fa-eye"></i>
                </button>
                <Link
                  to={`/onboard/update/${id}`}
                  className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </Link>
              </div>
            </td>
          </tr>
        );
      },
    );
  }

  return (
    <React.Fragment>
      <div className="p-3 md:p-5 min-h-screen">
        <div className="md:w-6/12 w-full">
          <h2 className="text-normal text-xl md:text-3xl">Onboard</h2>
          <ul className="flex gap-1 md:gap-2 md:flex-nowrap flex-wrap items-center py-2">
            <li>
              <Link
                to="/"
                className="text-normal text-sm md:text-base hover:underline"
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
              <p className="text-normal text-sm md:text-base">Onboard</p>
            </li>
          </ul>
        </div>
        <div className="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm mt-3">
          <div className="flex md:flex-row flex-col gap-3 md:gap-0 items-center w-full justify-between p-6">
            <div className="w-full md:w-96">
              <SearchComponent
                name="search"
                color="white"
                value={search}
                placeholder="Seach by domain"
                required={false}
                autoComplete="text"
                handleChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    searchParams.set("search", value);
                    searchParams.set("page", "1");
                  } else {
                    searchParams.delete("search");
                    searchParams.delete("page");
                  }
                  setSearchParams(searchParams);
                }}
              />
            </div>
            <div className="w-full md:w-52">
              <SelectComponent
                value={status}
                color="white"
                handleChange={handleChange}
                datas={[
                  { key: "Active", value: "ACTIVE" },
                  { key: "Pending", value: "PENDING" },
                ]}
                label="Select Status"
              />
            </div>
          </div>
          <div className="xl:overflow-x-auto overflow-x-scroll custom-scroll bg-white">
            <table className="my-table table-fixed w-full min-w-350">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr className="border-y border-gray-200">
                  <th className="text-left px-6 py-4">Created At</th>
                  <th className="text-left px-6 py-4">Selected Domain</th>
                  <th className="text-left px-6 py-4">Lander Name</th>
                  <th className="text-left px-6 py-4">Template Bio</th>
                  <th className="text-left px-6 py-4">Template Status</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>{content}</tbody>
            </table>
          </div>
          <div className="flex flex-wrap md:gap-0 gap-3 items-center justify-between px-6 py-5 border-t border-gray-200">
            <p className="text-sm text-gray-400">
              Showing <span className="font-medium text-gray-500">{start}</span>{" "}
              to <span className="font-medium text-gray-500">{end}</span> of{" "}
              <span className="font-medium text-gray-700">{totalItem}</span>{" "}
              results
            </p>
            <Pagination
              handlePageChange={handlePageChange}
              page={page}
              totalItems={totalItem}
              itemsPerPage={limit}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default OnboardingList;
