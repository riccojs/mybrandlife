import { Link } from "react-router";
import Logo from "../../assets/MBL_Logo_CROP.png";
import DemoPhoto from "../../assets/my-brand-life-laptop-demo.png";

function FunFacts() {
  return (
    <section className="my-5 md:my-10">
      <div className="w-10/12 lg:w-7/12 m-auto bg-[#FFF3E3] h-5 rounded-t-lg"></div>
      <div className="container m-auto w-11/12 bg-[#FFF9F1] p-5 md:p-14 rounded-xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center md:gap-20">
        <div>
          <h2 className="text-lg xl:text-2xl font-bold text-black text-center">
            Choose your niche → Build your lander → Share it everywhere
          </h2>
          <p className="text-sm md:text-md font-normal text-black my-5 text-center">
            At My Brand Life, our mission is simple: to empower individuals and
            businesses with landing pages and tools that make their online
            presence stronger, simpler, and more connected.
          </p>
          <div className="flex justify-between gap-5 items-center mt-5">
            <p className="w-full h-2 bg-[#96c94b] rounded-full"></p>
            <img src={Logo} alt="" className="w-16 md:w-24" />
            <p className="w-full h-2 bg-[#96c94b] rounded-full"></p>
          </div>
          <Link
            to="/pricing"
            className="flex active:scale-[0.98] w-fit items-center gap-2 px-8 py-3 rounded-full hover:bg-[#589c28] text-white text-xs md:text-sm font-medium shadow-lg transition-all bg-[#65B32E] shadow-[#65B32E]/25 mx-auto mt-5"
          >
            <p>See Our Offerings</p>
          </Link>
        </div>
        <div className="flex flex-col gap-5">
          <img src={DemoPhoto} alt={DemoPhoto} className="w-80" />
        </div>
      </div>
    </section>
  );
}

export default FunFacts;
