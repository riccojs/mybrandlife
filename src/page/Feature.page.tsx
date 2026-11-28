import { Link } from "react-router";
import {
  BarChart3,
  CalendarCheck,
  Check,
  FolderOpen,
  LayoutGrid,
  PenTool,
  ShieldCheck,
  TrendingUp,
  Crown,
  X,
  type LucideIcon,
} from "lucide-react";
import PageIntro from "../component/common/Page.intro";
import SectionHeading from "../component/common/Section.heading";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

const features: Feature[] = [
  {
    title: "Done-for-you content creation & publishing",
    description:
      "Our team plans, writes, designs, schedules, and publishes organic social content for your brand. You don't need a post composer or a content calendar of your own.",
    icon: PenTool,
  },
  {
    title: "Trend-informed content",
    description:
      "We research your business, your industry's current conversations, and current social content formats so posts stay timely and relevant to your audience.",
    icon: TrendingUp,
  },
  {
    title: "Platform-specific formatting",
    description:
      "Each post is adapted to the platform it runs on — sizes, formats, and copy length — across the number of platforms included in your plan.",
    icon: LayoutGrid,
  },
  {
    title: "You choose the approval preference",
    description:
      "Pick No Approval Required and we publish plan-covered content for you, or pick Approval Required and review every post before it goes live. You can change it later.",
    icon: ShieldCheck,
  },
  {
    title: "Shared Google Drive asset folder",
    description:
      "Drop logos, photos, videos, brand guides, menus, and offers into one shared folder. We pull from it when creating your content.",
    icon: FolderOpen,
  },
  {
    title: "Branded calendar & approval experience",
    description:
      "See planned content on a BPS-branded calendar and, if you require approval, approve, reject, or comment on posts from a review link.",
    icon: CalendarCheck,
  },
  {
    title: "Branded reporting in every plan",
    description:
      "Every plan includes BPS-branded analytics reports delivered on a regular schedule. Reporting depth increases with your plan tier.",
    icon: BarChart3,
  },
  {
    title: "MyBrandLife Gold included",
    description:
      "Every BPS plan includes a MyBrandLife Gold account and page. Set it up now, finish it later, or keep it private.",
    icon: Crown,
  },
];

const customerRole = [
  "Share business direction and brand assets",
  "Connect your social accounts through a secure link (no passwords shared)",
  "Send in promotions, events, and timely requests",
  "Choose your approval preference",
  "Review content when approval is required",
  "Read your reports",
];

const bpsRole = [
  "Research your brand, industry, and current social trends",
  "Plan your content around your goals and calendar",
  "Create and adapt posts for each platform",
  "Schedule and publish content",
  "Monitor publishing and fix connection issues with you",
  "Send branded reports",
];

const notIncluded = [
  "Paid advertising management",
  "Branding or logo design projects",
  "SEO or website design",
  "Public relations",
  "Lead-generation campaigns",
];

const FeaturePage = () => {
  return (
    <>
      <PageIntro
        eyebrow="Managed Social Publishing"
        title={
          <>
            Done-for-you social media{" "}
            <span className="text-[#2A65E9]">content and posting.</span>
          </>
        }
        description="Brand Pulse Social researches your business and what's happening on social right now, then creates and publishes ongoing organic content that matches your brand and your plan."
      >
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/pricing"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#2A65E9] px-7 text-sm font-semibold text-white shadow-lg shadow-[#2A65E9]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2058D0] sm:w-auto"
          >
            See plans & pricing
          </Link>
          <Link
            to="/how-it-works"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-[#161B2B]/10 bg-white px-7 text-sm font-semibold text-[#161B2B] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2A65E9]/30 hover:bg-[#F5F5F5] sm:w-auto"
          >
            How it works
          </Link>
        </div>
      </PageIntro>

      <section className="py-16">
        <SectionHeading
          eyebrow="What's included"
          title="Everything you need to stay active on social"
          description="Your plan sets how many platforms and posts per week we cover. The service itself works the same way on every plan."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-[#161B2B]/8 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2A65E9]/25 hover:shadow-[0_12px_30px_rgba(22,27,43,0.06)]"
            >
              <div className="grid size-11 place-items-center rounded-xl bg-[#2A65E9]/8 text-[#2A65E9]">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-[#161B2B]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#161B2B]/60">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16">
        <SectionHeading
          eyebrow="Who does what"
          title="You give direction. We do the work."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <RoleCard title="Your part" items={customerRole} tone="light" />
          <RoleCard title="Our part" items={bpsRole} tone="dark" />
        </div>
      </section>

      <section className="py-16">
        <div className="grid gap-8 rounded-3xl border border-[#161B2B]/8 bg-[#F8FAFF] p-8 md:grid-cols-[1.1fr_1fr] md:p-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2A65E9]">
              What BPS is — and isn't
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#161B2B]">
              A focused social publishing service, not a full marketing agency.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#161B2B]/60">
              We concentrate on one job: keeping your organic social presence
              active, on-brand, and current. We follow platform best practices
              and the trends we can observe, but no one can guarantee reach,
              rankings, engagement, or leads — and we won't promise them.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6">
            <p className="text-sm font-semibold text-[#161B2B]">
              Not part of a BPS plan
            </p>
            <ul className="mt-4 space-y-3">
              {notIncluded.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-[#161B2B]/70"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#E53F41]/10 text-[#E53F41]">
                    <X className="size-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

function RoleCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`rounded-2xl p-8 ${dark ? "bg-[#161B2B] text-white" : "border border-[#161B2B]/8 bg-white text-[#161B2B]"}`}
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6">
            <span
              className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${dark ? "bg-[#2A65E9] text-white" : "bg-[#2A65E9]/10 text-[#2A65E9]"}`}
            >
              <Check className="size-3" />
            </span>
            <span className={dark ? "text-white/80" : "text-[#161B2B]/70"}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FeaturePage;
