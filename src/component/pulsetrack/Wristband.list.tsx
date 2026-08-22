import {
  Search,
  SlidersHorizontal,
  Download,
  Pencil,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Status = "Active" | "Draft" | "On Hold" | "Closed";

interface Project {
  id: number;
  shortName: string;
  name: string;
  date: string;
  status: Status;
  scans: number;
}

const projects: Project[] = [
  {
    id: 1,
    shortName: "SUM",
    name: "Summer Music Festival 2024",
    date: "Oct 12, 2023",
    status: "Active",
    scans: 12450,
  },
  {
    id: 2,
    shortName: "COR",
    name: "Corporate Gala Night",
    date: "Nov 05, 2023",
    status: "Draft",
    scans: 0,
  },
  {
    id: 3,
    shortName: "TEC",
    name: "TechSummit Expo 2024",
    date: "Dec 01, 2023",
    status: "Active",
    scans: 4821,
  },
  {
    id: 4,
    shortName: "VTP",
    name: "VIP Touring Pass",
    date: "Jan 15, 2024",
    status: "On Hold",
    scans: 152,
  },
  {
    id: 5,
    shortName: "CHA",
    name: "Charity Run 5K",
    date: "Feb 20, 2024",
    status: "Closed",
    scans: 3109,
  },
];

const statusStyles: Record<Status, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Draft: "bg-gray-200 text-gray-600",
  "On Hold": "bg-amber-100 text-amber-700",
  Closed: "bg-gray-300 text-gray-700",
};

const avatarColors: string[] = [
  "bg-lime-100 text-lime-600",
  "bg-gray-200 text-gray-600",
  "bg-green-100 text-green-600",
  "bg-yellow-100 text-yellow-700",
  "bg-red-100 text-red-600",
];

const formatNumber = (num: number) => num.toLocaleString("en-US");

const WristbandList = () => {
  return (
    <section className="bg-gray-50 min-h-screen p-5">
      <div className="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Top Bar */}
        <div className="flex flex-wrap md:gap-0 gap-3 items-center justify-between p-6 border-b border-gray-200">
          <div className="relative w-96">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm">
              <SlidersHorizontal size={16} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-7xl">
            <thead className="text-xs uppercase text-gray-500 bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4">Order ID</th>
                <th className="text-left px-6 py-4">Project Name</th>
                <th className="text-left px-6 py-4">Total Wristband</th>
                <th className="text-left px-6 py-4">Quantity</th>
                <th className="text-left px-6 py-4">Price</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project, index) => (
                <tr
                  key={project.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-semibold text-sm ${avatarColors[index]}`}
                      >
                        {project.shortName}
                      </div>
                      <span className="font-medium text-gray-800">
                        {project.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-gray-600 text-sm">
                    {project.date}
                  </td>
                  <td className="px-6 py-5 text-gray-600 text-sm">
                    {project.date}
                  </td>
                  <td className="px-6 py-5 text-gray-600 text-sm">
                    {project.date}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[project.status]}`}
                    >
                      {project.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 font-medium">
                    {formatNumber(project.scans)}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex gap-4 text-gray-500">
                      <Pencil
                        size={18}
                        className="cursor-pointer hover:text-gray-700"
                      />
                      <Eye
                        size={18}
                        className="cursor-pointer hover:text-gray-700"
                      />
                      <Trash2
                        size={18}
                        className="cursor-pointer hover:text-red-500"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap md:gap-0 gap-3 items-center justify-between px-6 py-5 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">1</span> to{" "}
            <span className="font-medium text-gray-700">5</span> of{" "}
            <span className="font-medium text-gray-700">24</span> results
          </p>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200">
              <ChevronLeft size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl bg-lime-500 text-white font-medium">
              1
            </button>
            <button className="w-10 h-10 rounded-xl border border-gray-200">
              2
            </button>
            <button className="w-10 h-10 rounded-xl border border-gray-200">
              3
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WristbandList;
