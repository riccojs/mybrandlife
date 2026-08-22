import Logo from "../../assets/MBL_Logo_CROP.png";
import {
  helpLinks,
  importantLinks,
  saasLinks,
  socialIcons,
} from "../../utils/footer.menu";
import { Link } from "react-router";
import file from "../../assets/files/Price_Features_ALL.pdf";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import AskForhelp from "../popups/Ask.forhelp";

function Footer() {
  const [showTab, setShowTab] = useState(false);
  return (
    <footer className="border-t border-[#EEEEEE] bg-[#FBFCFA]">
      <div className="container">
        <div className="flex md:flex-row flex-col gap-20 py-10">
          <div className="w-full md:w-4/12">
            <a href="/" className="inline-flex items-center">
              <img
                src={Logo}
                alt="MyBrandLife"
                className="w-16 h-auto object-contain"
              />
            </a>
            <p className="mt-2.5 text-sm font-normal leading-[1.55] text-[#555555]">
              At MyBrandLife, our mission is to empower individuals and
              businesses by providing tailored, industry-specific landing pages
              that enhance their online presence and engagement.
            </p>
            <div className="mt-3.5 flex items-center gap-3.25">
              <h3>Follow Us:</h3>
              {socialIcons.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  className="text-[#111111] transition-all duration-200 hover:-translate-y-px hover:text-[#59A605]"
                >
                  <Icon size={15} strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>
          <div className="w-full md:w-8/12 flex md:flex-nowrap flex-wrap md:gap-0 gap-10 justify-between">
            <div>
              <h3 className="text-lg font-medium leading-none text-[#111111]">
                Important Links
              </h3>

              <ul className="mt-3.75 space-y-2.25">
                {importantLinks.map((item) => (
                  <li key={item?.id}>
                    <Link
                      to={item?.url}
                      className="text-sm font-normal leading-none text-[#555555] transition-colors duration-200 hover:text-[#59A605]"
                    >
                      {item?.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-normal leading-none text-[#555555] transition-colors duration-200 hover:text-[#59A605]"
                  >
                    All Features
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium leading-none text-[#111111]">
                SaaS Links
              </h3>

              <ul className="mt-3.75 space-y-2.25">
                {saasLinks.map((item) => (
                  <li key={item?.id}>
                    <Link
                      to={item?.url}
                      className="text-sm font-normal leading-none text-[#555555] transition-colors duration-200 hover:text-[#59A605]"
                    >
                      {item?.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="/follow-us"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-normal leading-none text-[#555555] transition-colors duration-200 hover:text-[#59A605]"
                  >
                    Follow Us
                  </a>
                </li>
                <li>
                  <a
                    href="https://brandpulsesocial.com"
                    target="_blank"
                    className="text-sm font-normal leading-none text-[#555555] transition-colors duration-200 hover:text-[#59A605]"
                  >
                    BrandPulse Social (BPS)
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium leading-none text-[#111111]">
                Help Links
              </h3>

              <ul className="mt-3.75 space-y-2.25">
                {helpLinks.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item?.url}
                      className="text-sm font-normal leading-none text-[#555555] transition-colors duration-200 hover:text-[#59A605]"
                    >
                      {item?.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="#"
                    className="text-sm font-normal leading-none text-[#555555] transition-colors duration-200 hover:text-[#59A605]"
                  >
                    Forum{" "}
                    <span className="text-red-500 text-xs">(Coming Soon)</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com/playlist?list=PLStyxaue6g99ZqVSm_I1mU7xRJTEZIVUE&si=zIDgY6tEQlFwfwD-"
                    target="_blank"
                    className="text-sm font-normal leading-none text-[#555555] transition-colors duration-200 hover:text-[#59A605]"
                  >
                    Help Videos
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setShowTab(true)}
                    className="text-sm font-normal leading-none text-[#555555] transition-colors duration-200 hover:text-[#59A605] cursor-pointer"
                  >
                    Ask for help
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-[#E5E7EB]" />
        <div className="flex min-h-12 flex-col items-center justify-between gap-2 py-3 sm:flex-row">
          <p className="text-xs font-normal text-[#555555]">
            ©2026 MyBrandLife.me. All rights reserved. Portions of the text and
            imagery may be AI-generated.
          </p>

          <p className="flex items-center gap-1 text-xs font-normal text-[#555555]">
            <ShieldCheck size={16} color="green" /> Secured SaaS Platform
          </p>
        </div>
      </div>
      {showTab && <AskForhelp showTab={showTab} setShowTab={setShowTab} />}
    </footer>
  );
}

export default Footer;
