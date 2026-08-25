import React from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { useGetAllReferralUserQuery } from "../../redux/features/referral/referralApi";
import BrandShareJoinersLoader from "../loader/Brandshare.joiners.loader";
import SearchComponent from "../ui/Search.component";
import Pagination from "../Pagination";

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

  const totalItems = data?.data?.totalUser;
  const users = data?.data?.user;

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
        <td colSpan={7}>
          <p className="bg-amber-100 text-md font-normal p-3 rounded-md">
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
          <tr key={id}>
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
            <h2 className="text-normal text-2xl md:text-3xl">Joined Users</h2>
            <ul className="flex gap-2 items-center py-2">
              <li>
                <Link
                  to="/admin/dashboard"
                  className="text-normal text-sm md:text-base"
                >
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
        <div className="flex flex-col gap-5 mt-5">
          <div className="flex md:w-auto w-full sm:flex-row flex-col justify-between items-start gap-3 md:items-center">
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
              className="bg-[#96c94b] text-black px-6 py-2 rounded-lg"
            >
              Back to BrandShare
            </Link>
          </div>
          <div className="overflow-x-auto bg-white">
            <table className="my-table table-fixed w-full min-w-300">
              <thead>
                <tr className="border-y border-gray-300">
                  <th>BrandShare Code</th>
                  <th className="w-96">Email</th>
                  <th>Lander Name</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone</th>
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

export default BrrandshareJoiners;
