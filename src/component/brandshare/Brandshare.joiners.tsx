import React from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { useGetAllReferralUserQuery } from "../../redux/features/referral/referralApi";
import BrandShareJoinersLoader from "../loader/Brandshare.joiners.loader";
import SearchComponent from "../ui/Search.component";
import Pagination from "../Pagination";
import { ArrowLeft } from "lucide-react";

function BrrandshareJoiners() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const params = useParams();
  const code = params.code;
  const limit = 14;
  const { data, isLoading, isFetching } = useGetAllReferralUserQuery({
    page,
    limit,
    searchBy: search,
    code: code,
  });

  const totalItem = data?.data?.totalUser;
  const users = data?.data?.user;
  const currentPage = data?.data?.currentPage || [];
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItem);

  const handlePageChange = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
  };

  // decide what to render
  let content;
  if (isLoading) {
    content = [...Array(10)].map((_, i) => <BrandShareJoinersLoader key={i} />);
  }
  if (isFetching) {
    content = [...Array(10)].map((_, i) => <BrandShareJoinersLoader key={i} />);
  }
  if (!isLoading && !isFetching && users?.length === 0) {
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
  if (!isLoading && !isFetching && users?.length > 0) {
    content = users?.map(
      (item: {
        id: string;
        code: string;
        firstName: string;
        lastName: string;
        email: string;
        create_at: string;
        phone: string;
        status: string;
        profile: string;
        landerName: string;
        domain: string;
        package: string;
      }) => {
        const { id, firstName, email, lastName, phone, landerName, code } =
          item || {};

        return (
          <tr key={id} className="hover:bg-gray-50">
            <td>{code}</td>
            <td>{email}</td>
            <td>{landerName}</td>
            <td>{firstName}</td>
            <td>{lastName}</td>
            <td>{phone}</td>
          </tr>
        );
      },
    );
  }

  return (
    <React.Fragment>
      <div className="p-3 md:p-5 min-h-screen">
        <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
          <div className="md:w-6/12 w-full">
            <h2 className="text-normal text-xl md:text-3xl">Joined Users</h2>
            <ul className="flex gap-2 flex-wrap items-center py-2">
              <li>
                <Link to="/" className="text-normal text-sm md:text-base">
                  Dashboard
                </Link>
              </li>
              <li>
                <i className="fa-solid fa-angles-right text-xs"></i>
              </li>
              <li>
                <p className="text-normal text-sm md:text-base">
                  Joined User List
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm mt-3">
          <div className="flex flex-col md:flex-row gap-3 md:gap-0 items-center w-full justify-between p-6">
            <div className="w-full md:w-96">
              <SearchComponent
                name="search"
                color="white"
                value={search}
                placeholder="Seach by landername"
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
            <Link
              to="/brandshare"
              className="bg-[#96c94b] text-black md:w-fit w-full justify-center flex gap-2 items-center px-6 py-2 md:py-3 rounded-lg text-normal text-md"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </Link>
          </div>
          <div className="xl:overflow-x-auto overflow-x-scroll custom-scroll bg-white">
            <table className="my-table table-fixed w-full min-w-350">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr className="border-y border-gray-200">
                  <th>BrandShare Code</th>
                  <th>Email</th>
                  <th>Lander Name</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone</th>
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

export default BrrandshareJoiners;
