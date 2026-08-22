function DashActivity() {
  return (
    <div className="w-full lg:w-6/12 p-6 bg-white border border-gray-200 rounded-lg">
      <div>
        <p className="text-bold text-3xl">All info brief on your site</p>
        <div className="flex gap-3 items-center mt-3">
          <h2 className="text-bold text-2xl">100</h2>
          <span className="flex gap-2 items-center">
            <i className="fa-solid fa-chart-line text-[#1F3B73] text-2xl"></i>
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-7 mt-10">
        <div className="flex gap-2 items-center justify-start">
          <p className="whitespace-nowrap text-medium text-base w-fit">
            Total Jobs
          </p>
          <span className="bg-[#1F3B73] w-full rounded-full flex justify-end items-center px-1 py-1">
            <p className="text-bold bg-white py-[2px] px-3 rounded-full text-xs">
              100
            </p>
          </span>
        </div>
        <div className="flex gap-2 items-center justify-start">
          <p className="whitespace-nowrap text-medium text-base w-fit">
            Total Applications
          </p>
          <span className="bg-[#00C897] w-full rounded-full flex justify-end items-center px-1 py-1">
            <p className="text-bold bg-white py-[2px] px-3 rounded-full text-xs">
              100
            </p>
          </span>
        </div>
        <div className="flex gap-2 items-center justify-start">
          <p className="whitespace-nowrap text-medium text-base w-fit">
            Total Job Seekers
          </p>
          <span className="bg-[#212529] w-full rounded-full flex justify-end items-center px-1 py-1">
            <p className="text-bold bg-white py-[2px] px-3 rounded-full text-xs">
              100
            </p>
          </span>
        </div>
        <div className="flex gap-2 items-center justify-start">
          <p className="whitespace-nowrap text-medium text-base w-fit">
            Total Employers
          </p>
          <span className="bg-[#176B87] w-full rounded-full flex justify-end items-center px-1 py-1">
            <p className="text-bold bg-white py-[2px] px-3 rounded-full text-xs">
              100
            </p>
          </span>
        </div>
        <div className="flex gap-2 items-center justify-start">
          <p className="whitespace-nowrap text-medium text-base w-fit">
            Verify Jobs
          </p>
          <span className="bg-[#64CCC5] w-full rounded-full flex justify-end items-center px-1 py-1">
            <p className="text-bold bg-white py-[2px] px-3 rounded-full text-xs">
              100
            </p>
          </span>
        </div>
        <div className="flex gap-2 items-center justify-start">
          <p className="whitespace-nowrap text-medium text-base w-fit">
            Expired Jobs
          </p>
          <span className="bg-[#F7B787] w-full rounded-full flex justify-end items-center px-1 py-1">
            <p className="text-bold bg-white py-[2px] px-3 rounded-full text-xs">
              100
            </p>
          </span>
        </div>
      </div>
    </div>
  );
}

export default DashActivity;
