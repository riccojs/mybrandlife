import Image from "../../assets/YBYLYP.png";

function BusinessInfo() {
  return (
    <section className="py-10 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <img src={Image} alt="" />
          </div>
          <div>
            <h2 className="text-black text-2xl font-medium">
              What's on MyBrandLife Radar?
            </h2>
            <p className="text-black text-md font-normal mt-3">
              MyBrandLife is built to grow with you. New tools, features, and
              partner services are being developed to make building your brand
              easier, more connected, and more valuable over time.
            </p>
            <div className="flex flex-col gap-3 my-5">
              <span className="flex gap-2 items-start">
                <i className="fa-solid fa-check text-[#96c94b] mt-1"></i>
                <p>
                  <strong>Social Hub:</strong> Your MyBrandLife page brings your
                  links, social platforms, contact points, and brand connections
                  into one simple home. It also helps you understand which links
                  and actions are getting the most attention.
                </p>
              </span>
              <span className="flex gap-2 items-start">
                <i className="fa-solid fa-check text-[#96c94b] mt-1"></i>
                <p>
                  <strong>BrandDesk Support:</strong> Live support email is
                  available, with BrandDesk AI Help Desk planned to help guide
                  users, answer questions, and support the brand-building
                  process.
                </p>
              </span>
              <span className="flex gap-2 items-start">
                <i className="fa-solid fa-check text-[#96c94b] mt-1"></i>
                <p>
                  <strong>Growth Apps:</strong> Gold customers and select plans
                  may include access to connected tools such as BrandShare,
                  BrandGear, ECHO, BrandBook, and BrandTrack at no extra cost.
                </p>
              </span>
              <span className="flex gap-2 items-start">
                <i className="fa-solid fa-check text-[#96c94b] mt-1"></i>
                <p>
                  <strong>More Value Apps:</strong> Additional tools are planned
                  across the MyBrandLife ecosystem, including apps such as EPIK,
                  BrandMail, PulseDrive, BrandBalance, BrandGuard, BrandQueue,
                  BrandWall, PulsePass, PulseTrack, BrandLink, and more.
                </p>
              </span>
              <span className="flex gap-2 items-start">
                <i className="fa-solid fa-check text-[#96c94b] mt-1"></i>
                <p>
                  <strong>Done-for-You Posting:</strong> Through BrandPulse
                  Social, users will be able to access managed social posting
                  services designed to keep their brand active, consistent, and
                  visible.
                </p>
              </span>
              <span className="flex gap-2 items-start">
                <i className="fa-solid fa-check text-[#96c94b] mt-1"></i>
                <p>
                  <strong>SignPulse Digital Signage:</strong> SignPulse will
                  connect digital signage options into the wider My Brand Life
                  ecosystem, helping businesses, venues, and brands display
                  content in real-world spaces.
                </p>
              </span>
              <span className="flex gap-2 items-start">
                <i className="fa-solid fa-check text-[#96c94b] mt-1"></i>
                <p>
                  <strong>AgentPulse AI Agents:</strong> Future AI-powered
                  assistants are planned to help with brand tasks, requests,
                  support, and user interactions while still being guided by
                  human strategy and oversight.
                </p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BusinessInfo;
