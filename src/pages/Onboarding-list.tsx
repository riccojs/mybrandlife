import React from "react";
import { Link, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import Pagination from "../component/Pagination";
import { useAuth } from "../hook/useAuth";
import SearchComponent from "../component/ui/Search.component";
import SelectComponent from "../component/ui/Select.component";
import OnboardLoader from "../component/loader/Onboard.loadder";
import { useGetAllOnboardQuery } from "../redux/features/onboard/onboardApi";

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
  const totalItems = data?.data?.totalOnboard;

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
        <td colSpan={6}>
          <p className="bg-amber-100 text-md font-normal p-3 rounded-md">
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
          <tr key={id}>
            <td>{formattedDate(create_at)}</td>
            <td>{domain}</td>
            <td>{landerName}</td>
            <td>{bio?.slice(0, 60)}</td>
            <td>
              <p
                className={`w-fit px-3 py-1 rounded-md text-center font-medium text-sm capitalize ${
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
                  className="border border-gray-300 w-8 h-8 flex justify-center items-center rounded-md cursor-pointer"
                >
                  <i className="fa-regular fa-eye"></i>
                </button>
                <Link
                  to={`/onboard/update/${id}`}
                  className="border border-gray-300 w-8 h-8 flex justify-center items-center rounded-md"
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
          <h2 className="text-normal text-2xl md:text-3xl">Onboard</h2>
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
              <p className="text-normal text-sm md:text-base">Onboard</p>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-5 mt-5">
          <div className="flex md:flex-row flex-col justify-between items-start gap-3 md:items-center">
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
          <div className="xl:overflow-x-auto overflow-x-scroll bg-white">
            <table className="my-table table-fixed w-full min-w-300">
              <thead>
                <tr className="border-y border-gray-300">
                  <th>Created At</th>
                  <th>Selected Domain</th>
                  <th>Lander Name</th>
                  <th>Template Bio</th>
                  <th>Template Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{content}</tbody>
            </table>
          </div>
        </div>
        {totalItems > limit && (
          <Pagination
            handlePageChange={handlePageChange}
            page={page}
            totalItems={totalItems}
            itemsPerPage={limit}
          />
        )}
      </div>
    </React.Fragment>
  );
}

export default OnboardingList;
