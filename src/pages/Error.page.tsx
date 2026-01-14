import { Link } from "react-router";
import Banner from "../assets/main.tsx.png";

function ErrorPage() {
  return (
    <section>
      <div className="container min-h-screen h-screen flex flex-col gap-5 items-center justify-center">
        <img src={Banner} alt="" className="w-6/12" />
        <h2 className="text-5xl font-bold text-black">
          That Page Can't Be Found
        </h2>
        <p>
          It looks like nothing was found at this location. Maybe try to search
          for what you are looking for?
        </p>
        <Link to="/jhon" className="primary-btn">
          Back
        </Link>
      </div>
    </section>
  );
}

export default ErrorPage;
