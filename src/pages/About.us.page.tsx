import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";

function AboutUsPage() {
  return (
    <React.Fragment>
      <Helmet>
        <title>About - My Brand Life</title>
        <meta name="description" content="About - My Brand Life" />
      </Helmet>

      <section className="py-5 md:py-10">
        <div className="container flex flex-col gap-10 relative">
          <div className="flex flex-col gap-4 bg-linear-to-r from-[#E1FFC1] to-[#D1FFA1] p-5 md:p-10 rounded-2xl">
            <h2 className="text-lg md:text-2xl xl:text-4xl font-medium">
              Your Brand Deserves One Home.
            </h2>
            <p className="text-sm md:text-base font-normal">
              My Brand Life was created to give creators, professionals,
              businesses, entertainers, service providers, and growing brands
              one simple place to connect everything they do.
            </p>
            <p className="text-sm md:text-base font-normal">
              Your socials, contact information, links, requests, bookings,
              merchandise, and other brand tools should not be scattered across
              the internet.
            </p>
            <p className="text-sm md:text-base font-normal">
              My Brand Life brings them together under one connected brand home
              that is easy to find, easy to share, and built to grow with you.
            </p>
            <Link
              className="flex w-fit cursor-pointer active:scale-[0.98] items-center gap-2 px-10 py-3 rounded-full hover:bg-[#589c28] text-white text-sm md:text-md font-medium shadow-lg transition-all bg-[#65B32E] shadow-[#65B32E]/25 mt-2"
              to="/pricing"
            >
              See My Brand Life in Action
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg md:text-2xl font-medium">
              More Than a Landing Page
            </h2>
            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-base font-normal">
                At its core, My Brand Life gives you an industry-specific brand
                lander that brings your digital presence together in one place.
              </p>
              <p className="text-sm md:text-base font-normal">
                But the bigger idea goes beyond links. My Brand Life is being
                built as a connected ecosystem of tools that helps you manage
                your presence, engage your audience, understand activity, and
                grow your brand over time.
              </p>
              <p className="text-[#589c28] text-base font-medium">
                Start with one page. Add what you need. Grow when you're ready.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg md:text-2xl font-medium">
              Why We Built My Brand Life
            </h2>
            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-base font-normal">
                Building a brand today often means managing too many
                disconnected places. Social profiles live on one platform.
                Booking links live somewhere else. Contact forms, payment links,
                merchandise, requests, analytics, and websites may all be spread
                across different services.
              </p>
              <p className="text-sm md:text-base font-normal">
                We wanted to make that simpler. My Brand Life gives your
                audience one clear place to start and gives your brand a home
                that is not dependent on any single social network.
              </p>
              <p className="text-sm md:text-base font-normal">
                You should not need a development team just to create a
                professional digital presence. You should have one place to
                share - and a platform that can grow with you.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg md:text-2xl font-medium">
              Built for Every Kind of Brand Life
            </h2>
            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-base font-normal">
                Not every brand looks the same. Some perform. Some create. Some
                teach. Some serve. Some sell. Some organize. Some are just
                getting started.
              </p>
              <p className="text-sm md:text-base font-normal">
                My Brand Life was built for all of them. Whether you're a
                creator, DJ, musician, entrepreneur, student, service
                professional, restaurant, venue, organization, small business,
                or personal brand, My Brand Life gives you a simple home for
                your presence.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-black text-xl md:text-3xl xl:text-4xl font-medium text-center">
              What Guides My Brand Life
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5 md:mt-10">
              <Link to="/pricing" className="h-full">
                <div className="bg-[#e8ffc4] p-5 md:p-10 rounded-lg flex flex-col gap-3 relative hover-effect">
                  <div className="absolute -top-2.5 left-8 w-10/12 h-5 bg-[#dcffa4] rounded-t-lg"></div>
                  <p className="text-black bg-[#96c94b] text-xl w-10 min-w-10 h-10 rounded-full font-medium flex justify-center items-center">
                    1
                  </p>
                  <h2 className="text-black text-lg md:text-xl font-medium">
                    Unify Your Brand
                  </h2>
                  <p className="text-black text-sm md:text-base font-normal">
                    Bring your socials, contact information, links, content, and
                    brand tools together in one clear place.
                  </p>
                </div>
              </Link>
              <Link to="/pricing" className="h-full">
                <div className="bg-[#e8ffc4] p-5 md:p-10 rounded-lg flex flex-col gap-3 relative hover-effect h-full">
                  <div className="absolute -top-2.5 left-8 w-10/12 h-5 bg-[#dcffa4] rounded-t-lg"></div>
                  <p className="text-black bg-[#96c94b] text-xl w-10 min-w-10 h-10 rounded-full font-medium flex justify-center items-center">
                    2
                  </p>
                  <h2 className="text-black text-lg md:text-xl font-medium">
                    Engage Your Audience
                  </h2>
                  <p className="text-black text-sm md:text-base font-normal">
                    Make it easier for people to follow, contact, request, book,
                    buy, and interact with you.
                  </p>
                </div>
              </Link>
              <Link to="/pricing" className="h-full">
                <div className="bg-[#e8ffc4] p-5 md:p-10 rounded-lg flex flex-col gap-3 relative hover-effect h-full">
                  <div className="absolute -top-2.5 left-8 w-10/12 h-5 bg-[#dcffa4] rounded-t-lg"></div>
                  <p className="text-black bg-[#96c94b] text-xl w-10 min-w-10 h-10 rounded-full font-medium flex justify-center items-center">
                    3
                  </p>
                  <h2 className="text-black text-lg md:text-xl font-medium">
                    Expand Your Presence
                  </h2>
                  <p className="text-black text-sm lg:text-base font-normal">
                    Connect your brand online and offline through QR codes, NFC,
                    engagement features, and a brand home that stays with you
                    even as platforms change.
                  </p>
                </div>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg md:text-2xl font-medium">
              Your Brand Shouldn't Be Trapped
            </h2>
            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-base font-normal">
                Social media is important, but it should not be the only place
                your brand lives. Algorithms change. Platforms evolve. Accounts
                can be restricted. Trends come and go.
              </p>
              <p className="text-sm md:text-base font-normal">
                Your My Brand Life page gives your audience a consistent place
                to find you, connect with you, and discover what matters most.
              </p>
              <p className="text-[#589c28] text-base font-medium">
                Your social platforms help build your audience. My Brand Life
                gives that audience somewhere to come home to.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg md:text-2xl font-medium">
              Built to Grow With You
            </h2>
            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-base font-normal">
                My Brand Life is still growing, and so is the ecosystem around
                it. New tools and services will continue to expand the ways you
                can connect with your audience, manage your presence, understand
                engagement, and build your brand.
              </p>
              <p className="text-sm md:text-base font-normal">
                Some features are available today, while others are planned for
                future releases.
              </p>
              <p className="text-[#589c28] text-base font-medium">
                The goal stays the same: Give your brand one home that can grow
                with you.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 bg-[#171926] p-5 md:p-10 rounded-2xl text-white">
            <h2 className="text-lg md:text-2xl xl:text-4xl font-medium">
              Start With One Page
            </h2>
            <p className="text-sm md:text-base font-normal">
              Your brand does not need to be perfect to get started. It just
              needs a home.
            </p>
            <Link
              className="flex w-fit cursor-pointer active:scale-[0.98] items-center gap-2 px-10 py-3 rounded-full hover:bg-[#589c28] text-white text-sm md:text-md font-medium shadow-lg transition-all bg-[#65B32E] shadow-[#65B32E]/25 mt-2"
              to="/pricing"
            >
              Register Your Brand
            </Link>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

export default AboutUsPage;
