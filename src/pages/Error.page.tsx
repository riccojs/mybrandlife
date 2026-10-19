import { Link, useNavigate } from "react-router";
import Banner from "../assets/404_Transparent.png";

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <section>
      <div className="container min-h-auto md:min-h-screen h-auto py-10 md:py-0 md:h-screen flex flex-col items-center justify-center">
        <img src={Banner} alt="" className="w-full md:w-120" />

        <div className="flex gap-5 items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-slate-200 cursor-pointer px-14 active:scale-105 duration-200 py-2 rounded-md text-black text-md font-normal"
          >
            Back
          </button>
          <Link
            to="/"
            className="bg-[#96c94b] active:scale-105 duration-200 px-14 py-2 rounded-md text-black text-md font-normal"
          >
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ErrorPage;
