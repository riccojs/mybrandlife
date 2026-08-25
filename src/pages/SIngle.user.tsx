import { RiProfileLine } from "react-icons/ri";
import { Link, NavLink, Outlet, useParams } from "react-router";
import { LuLockKeyhole } from "react-icons/lu";
import { MdAccountBalance } from "react-icons/md";

function SIngleUser() {
  const params = useParams();
  const id = params.id;
  return (
    <section className="p-5">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-light text-xl font-medium uppercase">
          User Setting
        </h2>
        <Link
          to="/admin/user"
          className="bg-[#BDF188] text-black px-6 py-2 rounded-md"
        >
          Back
        </Link>
      </div>
      <div className="bg-white mt-5 flex md:flex-row flex-col gap-20 border border-gray-200 p-5 rounded-lg">
        <nav className="min-w-60 w-full md:w-2/12">
          <ul className="flex flex-col gap-1">
            <li>
              <NavLink
                to={`/user/${id}`}
                className={({ isActive }) =>
                  `text-normal text-md flex gap-2 items-center px-4 py-3 rounded-lg ${
                    isActive ? "bg-[#F3F3F3]" : " bg-white"
                  }`
                }
                end
              >
                <RiProfileLine />
                <p>Profile Setting</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/user/${id}/security`}
                className={({ isActive }) =>
                  `text-normal text-md flex gap-2 items-center px-4 py-3 rounded-lg ${
                    isActive ? "bg-[#F3F3F3]" : " bg-white"
                  }`
                }
              >
                <LuLockKeyhole />
                <p>Security Setting</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/user/${id}/membership`}
                className={({ isActive }) =>
                  `text-normal text-md flex gap-2 items-center px-4 py-3 rounded-lg ${
                    isActive ? "bg-[#F3F3F3]" : " bg-white"
                  }`
                }
              >
                <MdAccountBalance />
                <p>Membership Setting</p>
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="w-full md:w-10/12">
          <Outlet />
        </div>
      </div>
    </section>
  );
}

export default SIngleUser;
