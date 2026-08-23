import { Link } from "react-router";
import Logo from "../../assets/logo.png";

function FunFacts() {
  return (
    <section className="my-10">
      <div className="w-10/12 lg:w-7/12 m-auto bg-[#FFF3E3] h-5 rounded-t-lg"></div>
      <div className="lg:container m-auto w-11/12 bg-[#FFF9F1] p-14 rounded-xl grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h2 className="text-4xl md:text-6xl font-bold text-black">
            Brand & Social Media Fun Facts
          </h2>
          <p className="text-md font-normal text-black my-5">
            At My Brand Life, our mission is simple: to empower individuals and
            businesses with landing pages and tools that make their online
            presence stronger, simpler, and more connected.
          </p>
          <div className="flex justify-between gap-5 items-center mt-5">
            <p className="w-full h-2 bg-[#96c94b] rounded-full"></p>
            <img src={Logo} alt="" className="w-24" />
            <p className="w-full h-2 bg-[#96c94b] rounded-full"></p>
          </div>
          <Link
            to="/pricing"
            className="flex active:scale-[0.98] w-fit items-center gap-2 px-10 py-4 rounded-full hover:bg-[#589c28] text-white text-md font-medium shadow-lg transition-all bg-[#65B32E] shadow-[#65B32E]/25 mx-auto mt-5"
          >
            <p>See Our Offerings</p>
          </Link>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-md font-bold text-black">
              💡 Digital First Impressions
            </h2>
            <p className="text-sm font-normal text-black">
              It takes just 50 milliseconds for someone to judge your website —
              faster than a blink. Your domain is often the first thing they
              see.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-md font-bold text-black">
              📈 The Power of Consistency
            </h2>
            <p className="text-sm font-normal text-black">
              Brands that look and feel the same everywhere can see revenue grow
              by 33%. A domain that matches your socials makes your brand
              unforgettable.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-md font-bold text-black">
              ⏱ The Social Media Clock
            </h2>
            <p className="text-sm font-normal text-black">
              The average person spends 2 hours and 27 minutes a day on social
              platforms. A custom domain helps your followers find you off
              social, no matter how algorithms change.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-md font-bold text-black">
              📬 Email Still Wins
            </h2>
            <p className="text-sm font-normal text-black">
              Every $1 spent on email marketing returns $42. A branded domain
              makes your email addresses look professional and instantly more
              trustworthy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FunFacts;
