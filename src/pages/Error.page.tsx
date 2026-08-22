import { Link, useNavigate } from "react-router";
import Banner from "../assets/404_Transparent.png";

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <section>
      <div className="container min-h-screen h-screen flex flex-col items-center justify-center">
        <img src={Banner} alt="" className="w-6/12" />

        <div className="flex gap-5 items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#cbf38b] cursor-pointer px-14 active:scale-105 duration-200 py-2 rounded-md text-black text-md font-normal"
          >
            Back
          </button>
          <Link
            to="/"
            className="bg-[#cf3832] active:scale-105 duration-200 px-14 py-2 rounded-md text-white text-md font-normal"
          >
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ErrorPage;
