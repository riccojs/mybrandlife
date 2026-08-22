import { Link } from "react-router";
import { useAuth } from "../hook/useAuth";
import { LayoutDashboard } from "lucide-react";

function AboutUsPage() {
  const { user } = useAuth() as { user: { role: string } | null };
  const redirectUrl = import.meta.env.VITE_APP_REDIRECT_ROUTE;

  return (
    <section className="py-10">
      <div className="container flex flex-col gap-10 relative">
        <div className="flex flex-col gap-4 bg-linear-to-r from-[#E1FFC1] to-[#D1FFA1] p-10 rounded-lg">
          <h2 className="text-4xl font-medium">
            Your brand deserves one home.
          </h2>
          <p className="text-base font-normal">
            My Brand Life was built to give creators, entertainers, businesses,
            service providers, and everyday brands one simple place to connect
            everything they do. Your links, content, bookings, requests,
            merchandise, stats, and future growth tools can all live under one
            connected brand hub.
          </p>
          <p className="text-base font-normal">
            Whether you are just getting started or already building an
            audience, My Brand Life helps make your presence easier to find,
            easier to share, and easier to grow.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-medium">What My Brand Life Is?</h2>
          <ul className="list-disc pl-10 flex flex-col gap-2">
            <li>
              More than a landing page. A growing brand platform. iii. At its
              core, My Brand Life gives you a personal branded page that brings
              your online presence together. But the bigger vision is much more
              than links.
            </li>
            <li>
              My Brand Life is being built as a connected ecosystem of tools
              that help you manage your brand, promote your work, connect with
              your audience, and grow over time.
            </li>
            <li>
              From simple landing pages to requests, bookings, affiliate links,
              merchandise, stats, content tools, signage, and future AI-powered
              support, MBL is designed to grow with you.
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-medium">Why We Built MyBrandLife!</h2>
          <ul className="list-disc pl-10 flex flex-col gap-2">
            <li>
              Most people are trying to build a brand across too many
              disconnected platforms. Social media profiles, booking links,
              payment links, websites, request forms, merchandise stores, and
              contact pages are often scattered everywhere.
            </li>
            <li>My Brand Life was created to bring those pieces together.</li>
            <li>
              The goal is simple: give every person, performer, creator,
              business, and brand a clean home base that can grow into something
              bigger over time.
            </li>
            <li>
              You should not need a full development team to start building your
              brand. You should have one place to start, one page to share, and
              one platform that grows with you.
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-medium">Who its built for?</h2>
          <h3>Built For Every Kind of Brand Life </h3>
          <ul className="list-disc pl-10 flex flex-col gap-2">
            <li>
              Not every brand looks the same. Some brands perform. Some sell.
              Some teach. Some serve. Some create. Some organize. Some are just
              getting started.
            </li>
            <li>My Brand Life was built for all of them.</li>
            <li>
              Whether you are a creator, DJ, musician, service professional,
              agent, student, venue, restaurant, small business, community
              group, organization, or personal brand, MBL gives you one simple
              home for your presence.
            </li>
            <li>
              Your page can bring together your links, social platforms, contact
              info, booking options, requests, merchandise, referrals, stats,
              and future growth tools.
            </li>
            <li>Start with one page. Grow into a connected brand system.</li>
            <li>“Register Your Brand” button link</li>
          </ul>
        </div>
        <div>
          <h2 className="text-black text-4xl md:text-5xl font-bold text-center">
            What Powers My Brand Life?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
            <Link to="/pricing" className="h-full">
              <div className="bg-[#e8ffc4] p-10 rounded-lg flex flex-col gap-3 relative hover-effect">
                <div className="absolute -top-2.5 left-8 w-10/12 h-5 bg-[#dcffa4] rounded-t-lg"></div>
                <p className="text-black bg-[#96c94b] text-sm px-4 py-1 rounded-md font-medium w-fit">
                  1 - Unify Your Brand
                </p>
                <h2 className="text-black text-xl font-medium">
                  Bring everything together
                </h2>
                <p className="text-black text-md font-normal">
                  Your links, pages, tools, content, and connections should all
                  point back to one clear brand home. My Brand Life helps make
                  your presence consistent, professional, and easy to share.
                </p>
              </div>
            </Link>
            <Link to="/pricing" className="h-full">
              <div className="bg-[#e8ffc4] p-10 rounded-lg flex flex-col gap-3 relative hover-effect h-full">
                <div className="absolute -top-2.5 left-8 w-10/12 h-5 bg-[#dcffa4] rounded-t-lg"></div>
                <p className="text-black bg-[#96c94b] text-sm px-4 py-1 rounded-md font-medium w-fit">
                  2 - Engage Your People
                </p>
                <h2 className="text-black text-xl font-medium">
                  Turn visitors into connections.
                </h2>
                <p className="text-black text-md font-normal">
                  Your audience should be able to follow, contact, book,
                  request, buy, and interact with you from one simple place.
                </p>
              </div>
            </Link>
            <Link to="/pricing" className="h-full">
              <div className="bg-[#e8ffc4] p-10 rounded-lg flex flex-col gap-3 relative hover-effect h-full">
                <div className="absolute -top-2.5 left-8 w-10/12 h-5 bg-[#dcffa4] rounded-t-lg"></div>
                <p className="text-black bg-[#96c94b] text-sm px-4 py-1 rounded-md font-medium w-fit">
                  3 - Expand Your Presence
                </p>
                <h2 className="text-black text-xl font-medium">
                  Grow beyond one platform.
                </h2>
                <p className="text-black text-md font-normal">
                  Social platforms change. Algorithms shift. Your brand hub
                  stays yours. My Brand Life helps you stay visible and
                  connected wherever your audience finds you.
                </p>
              </div>
            </Link>
          </div>
          <div className="flex justify-center items-center mt-3">
            {user ? (
              <a
                href={redirectUrl}
                target="_blank"
                className="flex active:scale-[0.98] w-fit items-center gap-2 px-10 py-4 rounded-full hover:bg-[#589c28] text-white text-md font-medium shadow-lg transition-all bg-[#65B32E] shadow-[#65B32E]/25 mt-5"
              >
                <LayoutDashboard className="w-4 h-4 fill-current" />
                Dashboard
              </a>
            ) : (
              <Link
                className="flex cursor-pointer w-fit active:scale-[0.98] items-center gap-2 px-10 py-4 rounded-full hover:bg-[#589c28] text-white text-md font-medium shadow-lg transition-all bg-[#65B32E] shadow-[#65B32E]/25"
                to="/pricing"
              >
                Register Your Brand
              </Link>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-medium">More About My Brand Life </h2>
          <ul className="list-disc pl-10 flex flex-col gap-2">
            <li>
              My Brand Life is built to grow with you. New tools, features, and
              partner services are being developed to make building your brand
              easier, more connected, and more valuable over time.
            </li>
            <li>
              <strong>Social Hub</strong>
              Your My Brand Life page brings your links, social platforms,
              contact points, and brand connections into one simple home. It
              also helps you understand which links and actions are getting the
              most attention.
            </li>
            <li>
              <strong>BrandDesk Support</strong>
              Live support email is available, with BrandDesk AI Help Desk
              planned to help guide users, answer questions, and support the
              brand-building process.
            </li>
            <li>
              <strong>Growth Apps</strong>
              Gold customers and select plans may include access to connected
              tools such as BrandShare, BrandGear, Echo, BrandBook, and
              BrandTrack at no extra cost. x. Live Page Editing
            </li>
            <li>
              Lander Live Edit is planned to make it easier for users to update
              and manage their pages without needing technical help.
            </li>
            <li>
              More Value Apps Additional tools are planned across the My Brand
              Life ecosystem, including apps such as EPIK, BrandMail,
              PulseDrive, BrandBalance, BrandGuard, BrandQueue, BrandWall,
              PulsePass, PulseTrack, and more.
            </li>
            <li>
              Done-for-You Posting Through BrandPulse Social, users will be able
              to access managed social posting services designed to keep their
              brand active, consistent, and visible. xiii. SignPulse Digital
              Signage SignPulse will connect digital signage options into the
              wider My Brand Life ecosystem, helping businesses, venues, and
              brands display content in real-world spaces.
            </li>
            <li>
              AgentPulse AI Agents Future AI-powered assistants are planned to
              help with brand tasks, requests, support, and user interactions
              while still being guided by human strategy and oversight.
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-medium">
            Your Brand Should Not Be Trapped
          </h2>
          <ul className="list-decimal pl-10 flex flex-col gap-2">
            <li>
              Social platforms are powerful, but they should not be the only
              place your brand lives. Algorithms change. Accounts get
              restricted. Trends move fast.
            </li>
            <li>
              Your My Brand Life page gives you a brand home that connects your
              online world together. It helps people find you, follow you,
              contact you, and connect with what matters most.
            </li>
            <li>Your social media matters. Your brand home matters more.</li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-medium">
            Built Today. Growing Every Quarter.
          </h2>
          <ul className="list-decimal pl-10 flex flex-col gap-2">
            <li>
              Some My Brand Life tools are live now, while others are planned
              for future releases. Our roadmap is designed to add more value
              over time through connected apps, partner services, automation
              tools, reporting, support, and future AI-powered features.
            </li>
            <li>
              Feature availability may vary by plan, release schedule, and
              platform readiness.
            </li>
            <li>
              This wording is important because you mention Q4 2026, Q2 2026, Q3
              2026, and 2027. I would avoid too many hard dates on the public
              page unless you are 100% sure. Use “planned,” “coming soon,” or
              “future release” instead.{" "}
            </li>
          </ul>
          {user ? (
            <a
              href={redirectUrl}
              target="_blank"
              className="flex active:scale-[0.98] w-fit items-center gap-2 px-10 py-4 rounded-full hover:bg-[#589c28] text-white text-md font-medium shadow-lg transition-all bg-[#65B32E] shadow-[#65B32E]/25 mt-5"
            >
              <LayoutDashboard className="w-4 h-4 fill-current" />
              Dashboard
            </a>
          ) : (
            <Link
              className="flex w-fit cursor-pointer active:scale-[0.98] items-center gap-2 px-10 py-4 rounded-full hover:bg-[#589c28] text-white text-md font-medium shadow-lg transition-all bg-[#65B32E] shadow-[#65B32E]/25"
              to="/pricing"
            >
              Register Your Brand
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-medium">Start With One Page</h2>
          <ul className="list-decimal pl-10 flex flex-col gap-2">
            <li>
              Your brand does not need to be perfect to get started. It just
              needs a home.
            </li>
            <li>
              Create your My Brand Life page, connect your links, share your
              story, and start building a stronger presence today.
            </li>
          </ul>
          {user ? (
            <a
              href={redirectUrl}
              target="_blank"
              className="flex active:scale-[0.98] w-fit items-center gap-2 px-10 py-4 rounded-full hover:bg-[#589c28] text-white text-md font-medium shadow-lg transition-all bg-[#65B32E] shadow-[#65B32E]/25 mt-5"
            >
              <LayoutDashboard className="w-4 h-4 fill-current" />
              Dashboard
            </a>
          ) : (
            <Link
              className="flex cursor-pointer w-fit active:scale-[0.98] items-center gap-2 px-10 py-4 rounded-full hover:bg-[#589c28] text-white text-md font-medium shadow-lg transition-all bg-[#65B32E] shadow-[#65B32E]/25"
              to="/pricing"
            >
              Register Your Brand
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default AboutUsPage;
