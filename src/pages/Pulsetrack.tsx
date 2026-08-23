import { NavLink, Outlet } from "react-router";

function Pulsetrack() {
  return (
    <section>
      <div className="bg-white p-5 border-b border-gray-200">
        <h1 className="text-[26px] font-semibold text-[#0F172A]">
          PulseTrack Dashboard
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Monitor your pulse analytics and order history in real-time.
        </p>
      </div>
      <div className="flex bg-white p-5 gap-8 border-b border-[#E2E8F0]">
        <nav>
          <ul className="flex flex-wrap gap-10">
            <li>
              <NavLink
                to={"/pulsetrack"}
                end
                className={({ isActive }) =>
                  `border-b-2 w-full pb-2 transition-all duration-300 text-md font-medium text-black ${
                    isActive ? "border-[#95BF4D]" : "border-transparent"
                  }`
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/pulsetrack/projects"}
                className={({ isActive }) =>
                  `border-b-2 w-full pb-2 transition-all duration-300 text-md font-medium text-black ${
                    isActive ? "border-[#95BF4D]" : "border-transparent"
                  }`
                }
              >
                PulseTrack IDs
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/pulsetrack/orders"}
                className={({ isActive }) =>
                  `border-b-2 w-full pb-2 transition-all duration-300 text-md font-medium text-black ${
                    isActive ? "border-[#95BF4D]" : "border-transparent"
                  }`
                }
              >
                PulseTrack Orders
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/pulsetrack/export"}
                className={({ isActive }) =>
                  `border-b-2 w-full pb-2 transition-all duration-300 text-md font-medium text-black ${
                    isActive ? "border-[#95BF4D]" : "border-transparent"
                  }`
                }
              >
                Export Data
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="min-h-screen">
        <Outlet />
      </div>
    </section>
  );
}

export default Pulsetrack;
