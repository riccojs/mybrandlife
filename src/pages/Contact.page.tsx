import Shape from "../assets/shape-03.svg";
import Shape2 from "../assets/shape-07.svg";
import React, { useState } from "react";
import { useCreateContactMutation } from "../redux/features/contact/contactApi";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { LoaderCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface UserType {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  niche: string;
  subject: string;
  message: string;
}

function ContactPage() {
  const [createContact, { isLoading }] = useCreateContactMutation();
  const [user, setUser] = useState<UserType>({
    firstname: "",
    lastname: "",
    email: "",
    niche: "",
    message: "",
    phone: "",
    subject: "",
  });
  const { firstname, lastname, niche, email, message, phone, subject } =
    user || {};
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createContact(user)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setUser({
          firstname: "",
          lastname: "",
          email: "",
          niche: "",
          message: "",
          phone: "",
          subject: "",
        });
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Contact My Brand Life</title>
        <meta name="description" content="Contact My Brand Life" />
      </Helmet>
      <section className="bg-[#F3F6F9] w-full h-full py-10 sm:py-20 flex justify-center items-center relative">
        <div className="container">
          <div className="flex flex-col justify-center items-center gap-5">
            <h2 className="text-xl sm:text-2xl md:text-5xl font-medium text-black">
              Let's Stay Connected
            </h2>
            <p className="text-sm sm:text-md font-normal text-black w-full lg:w-6/12 m-auto text-center">
              Reach out for help, ideas, or just to chat — we're always up for a
              good conversation!
            </p>
            <p className="text-sm sm:text-md font-normal text-black w-full lg:w-6/12 m-auto text-center">
              Whether you've got a question, a wild idea, or just want to say
              hi, we'd love to hear from you. At My Brand Life, connections are
              everything — and your message is never “just another email.” So go
              ahead, drop us a line and let's make something awesome happen
              together.
            </p>
          </div>
          <div className="flex gap-5 xl:gap-10 mt-5 sm:mt-10 md:flex-row flex-col">
            <div className="bg-white p-10 md:p-5 xl:p-10 rounded-lg w-full md:w-4/12 relative">
              <div className="flex flex-col gap-5 xl:gap-10">
                <div className="flex gap-1 xl:gap-3 items-center lg:flex-row md:flex-col flex-row lg:justify-start md:justify-center justify-start">
                  <span className="min-w-14 xl:min-w-20 h-14 xl:h-20 rounded-full flex justify-center items-center bg-[#F8DA34]">
                    <i className="fa-regular fa-envelope text-2xl xl:text-4xl"></i>
                  </span>
                  <div>
                    <h3 className="text-md md:text-lg xl:text-2xl font-medium text-black lg:text-left md:text-center text-left">
                      Email Address
                    </h3>
                    <a
                      href=""
                      className="text-sm xl:text-md font-normal text-black text-left md:text-center lg:text-left"
                    >
                      info@mybrandlife.me
                    </a>
                  </div>
                </div>
                <div>
                  <a
                    href="https://maps.app.goo.gl/uJVaGymDqbejxFvt5"
                    target="_blank"
                    className="flex gap-1 xl:gap-3 items-center lg:flex-row md:flex-col flex-row lg:justify-start md:justify-center justify-start"
                  >
                    <span className="min-w-14 xl:min-w-20 h-14 xl:h-20 rounded-full flex justify-center items-center bg-[#4D5FF9]">
                      <i className="fa-solid fa-location-dot text-xl xl:text-4xl text-white"></i>
                    </span>
                    <div>
                      <h3 className="text-md md:text-lg xl:text-2xl font-medium text-black lg:text-left md:text-center text-left">
                        Office Location
                      </h3>
                      <p className="text-sm sm:text-md font-normal text-black text-left md:text-center lg:text-left block">
                        1320 Main Street, Suite 66, Stevens Point, WI 54481
                      </p>
                    </div>
                  </a>
                </div>
                <div className="flex gap-1 xl:gap-3 items-center lg:flex-row md:flex-col flex-row lg:justify-start md:justify-center justify-start">
                  <span className="min-w-14 xl:min-w-20 h-14 xl:h-20 rounded-full flex justify-center items-center bg-[#96c94b]">
                    <i className="fa-solid fa-phone-volume text-xl xl:text-4xl text-white"></i>
                  </span>
                  <div>
                    <h3 className="text-md md:text-lg xl:text-2xl font-medium text-black lg:text-left md:text-center text-left">
                      Phone Number
                    </h3>
                    <a
                      href="tel:+17155746890"
                      className="text-sm xl:text-md font-normal text-black text-left md:text-center lg:text-left"
                    >
                      (888) 520-6120
                    </a>
                  </div>
                </div>
                <div className="flex gap-1 xl:gap-3 items-center lg:flex-row md:flex-col flex-row lg:justify-start md:justify-center justify-start">
                  <span className="min-w-14 xl:min-w-20 h-14 xl:h-20 rounded-full flex justify-center items-center bg-[#25d366]">
                    <i className="fa-brands fa-whatsapp text-white text-2xl xl:text-4xl"></i>
                  </span>
                  <div>
                    <h3 className="text-md md:text-lg xl:text-2xl font-medium text-black lg:text-left md:text-center text-left">
                      WhatsApp
                    </h3>
                    <a
                      href="https://wa.me/+17155746890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm xl:text-md font-normal text-black text-left md:text-center lg:text-left"
                    >
                      +1 (715) 574-6890
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-10 border-t border-[#D4DCEA] pt-3 xl:pt-10">
                <h3 className="text-lg xl:text-2xl font-medium text-[#181A2A]">
                  Social Media
                </h3>
                <div className="flex justify-between items-center mt-2 xl:mt-5">
                  <a
                    href="https://www.facebook.com/MyBrandLife"
                    target="_blank"
                    className="text-gray-400"
                  >
                    <i className="fa-brands fa-facebook text-lg xl:text-2xl"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/mybrandlife.me/"
                    target="_blank"
                    className="text-gray-400"
                  >
                    <i className="fa-brands fa-instagram text-lg xl:text-2xl"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/mybrandlife/"
                    target="_blank"
                    className="text-gray-400"
                  >
                    <i className="fa-brands fa-linkedin text-lg xl:text-2xl"></i>
                  </a>
                  <a
                    href="https://www.youtube.com/@MyBrandLife"
                    target="_blank"
                    className="text-gray-400"
                  >
                    <i className="fa-brands fa-youtube text-lg xl:text-2xl"></i>
                  </a>
                  <a
                    href="https://www.tiktok.com/@mybrandlife.me"
                    target="_blank"
                    className="text-gray-400"
                  >
                    <i className="fa-brands fa-tiktok text-lg xl:text-2xl"></i>
                  </a>
                </div>
              </div>
              <img src={Shape} alt="" className="absolute top-3 right-3 w-10" />
            </div>
            <div className="w-full md:w-8/12 bg-white p-5 md:p-10 rounded-lg z-50">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1 md:gap-2">
                    <label
                      htmlFor=""
                      className="text-black text-sm md:text-md font-normal"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstname}
                      name="firstname"
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="text-black text-md font-normal border border-[#D4DCEA] px-3 py-2 md:px-4 md:py-4 rounded-md bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:gap-2">
                    <label
                      htmlFor=""
                      className="text-black text-sm md:text-md font-normal"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastname}
                      name="lastname"
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="text-black text-md font-normal border border-[#D4DCEA] px-3 py-2 md:px-4 md:py-4 rounded-md bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:gap-2">
                    <label
                      htmlFor=""
                      className="text-black text-sm md:text-md font-normal"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      name="email"
                      onChange={handleChange}
                      required
                      placeholder="example@gmail.com"
                      className="text-black text-md font-normal border border-[#D4DCEA] px-3 py-2 md:px-4 md:py-4 rounded-md"
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:gap-2">
                    <label
                      htmlFor=""
                      className="text-black text-sm md:text-md font-normal"
                    >
                      Niche/Profession
                    </label>
                    <input
                      type="text"
                      value={niche}
                      name="niche"
                      onChange={handleChange}
                      required
                      placeholder="example@gmail.com"
                      className="text-black text-md font-normal border border-[#D4DCEA] px-3 py-2 md:px-4 md:py-4 rounded-md"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1 md:gap-2">
                    <label htmlFor="" className="text-sm md:text-md">
                      Phone Number
                    </label>
                    <input
                      type="phone"
                      value={phone}
                      name="phone"
                      onChange={handleChange}
                      required
                      placeholder="Enter your phone no."
                      id=""
                      className="text-black text-md font-normal border border-[#D4DCEA] px-3 py-2 md:px-4 md:py-4 rounded-md"
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:gap-2">
                    <label htmlFor="" className="text-sm md:text-md">
                      Subject
                    </label>
                    <input
                      type="subject"
                      value={subject}
                      name="subject"
                      onChange={handleChange}
                      required
                      placeholder="Enter your subject"
                      className="text-black text-md font-normal border border-[#D4DCEA] px-3 py-2 md:px-4 md:py-4 rounded-md"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1 md:gap-2">
                  <label htmlFor="" className="text-sm md:text-md">
                    Message
                  </label>
                  <textarea
                    value={message}
                    name="message"
                    onChange={handleChange}
                    required
                    placeholder="Enter your message"
                    rows={5}
                    className="text-black text-md font-normal border border-gray-300 px-2 md:px-4 py-2 md:py-3 rounded-md"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`h-10 md:h-12 w-fit px-6 md:px-10 flex justify-center items-center rounded-full text-sm font-semibold text-black shadow-sm transition duration-200 active:scale-[0.95] ${isLoading ? "bg-[#6fa420] cursor-not-allowed" : "bg-[#96c94b] hover:bg-[#88c133] cursor-pointer"}`}
                >
                  {isLoading ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Submit Now"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        <img src={Shape2} alt="" className="absolute bottom-0 right-5 w-24" />
        <img src={Shape} alt="" className="absolute top-10 left-5 w-24" />
      </section>
    </React.Fragment>
  );
}

export default ContactPage;
