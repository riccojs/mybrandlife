import { Link } from "react-router";
import { ArrowRight, Check, CircleCheck, ShieldCheck } from "lucide-react";
import PageIntro from "../component/common/Page.intro";
import SectionHeading from "../component/common/Section.heading";

const steps = [
  {
    title: "Choose a BPS plan",
    description:
      "Pick the plan that fits how many platforms and posts per week you need, then choose monthly or annual billing.",
  },
  {
    title: "Register and pay through MyBrandLife",
    description:
      "Sign in with your existing MyBrandLife account or create one. Payment is handled securely by Stripe — there's no separate BPS password.",
  },
  {
    title: "Complete onboarding and choose your approval preference",
    description:
      "Tell us about your business, brand voice, goals, and topics to avoid. You also choose whether posts need your approval before they go live.",
  },
  {
    title: "Upload brand assets to your shared Google Drive folder",
    description:
      "Add logos, photos, videos, brand guides, menus, and offers to the folder we share with you.",
  },
  {
    title: "Connect your social accounts",
    description:
      "Our team sends you a secure connection link for each platform. You authorize access directly with the platform — you never share your social passwords with us.",
  },
  {
    title: "We research and create your content",
    description:
      "BPS researches your brand, your industry, current trends, and current platform patterns, then creates content for each platform in your plan.",
  },
  {
    title: "Review, or let us publish",
    description:
      "If you require approval, you get a BPS-branded review request to approve, reject, or comment on posts. If you don't, we schedule and publish without an approval step.",
  },
  {
    title: "We publish and send branded reports",
    description:
      "Your content goes live on schedule, and you receive BPS-branded reports on a regular cadence.",
  },
];

const approvalModes = [
  {
    title: "No Approval Required",
    tag: "Hands-off",
    description:
      "You authorize BPS to publish plan-covered content without reviewing it first. You can still see everything on your shared calendar.",
    points: [
      "Fastest path from plan to published",
      "View upcoming content on your shared calendar",
      "We may still ask you to approve a sensitive or special post",
    ],
  },
  {
    title: "Approval Required",
    tag: "Review first",
    description:
      "Every post waits for your review before it's published. You approve, reject, or comment from a BPS-branded review link or email.",
    points: [
      "Add one or more approvers",
      "Choose whether anyone or everyone must approve",
      "Add notes for multi-stage approval chains",
    ],
  },
];

const statuses = [
  {
    title: "Setup Required",
    description: "Your plan is active and onboarding is waiting for you.",
  },
  {
    title: "Setup in Progress",
    description:
      "Onboarding is submitted. Our team is setting up your workspace, Drive folder, connection links, and calendar.",
  },
  {
    title: "Active",
    description: "Content is being created and published for your brand.",
  },
];

const HowItWorksPage = () => {
  return (
    <>
      <PageIntro
        eyebrow="How it works"
        title={
          <>
            From sign-up to <span className="text-[#2A65E9]">published</span>{" "}
            in eight steps.
          </>
        }
        description="You give us direction and access. Our team handles the research, creation, scheduling, publishing, and reporting."
      />

      <section className="py-14">
        <ol className="relative mx-auto max-w-3xl">
          {steps.map((step, index) => (
            <li key={step.title} className="relative flex gap-5 pb-10 last:pb-0">
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-5 top-11 h-[calc(100%-2.75rem)] w-px bg-[#2A65E9]/20"
                />
              )}
              <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-[#2A65E9] text-sm font-bold text-white shadow-md shadow-[#2A65E9]/20">
                {index + 1}
              </span>
              <div className="flex-1 rounded-2xl border border-[#161B2B]/8 bg-white p-5">
                <h3 className="text-base font-semibold text-[#161B2B]">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-[#161B2B]/60">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="py-14">
        <SectionHeading
          eyebrow="Your approval preference"
          title="You decide how content gets published"
          description="Choose one during onboarding. You can change it later from your account — our team applies the change for you."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {approvalModes.map((mode) => (
            <article
              key={mode.title}
              className="rounded-2xl border border-[#161B2B]/8 bg-white p-7"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#2A65E9]/8 text-[#2A65E9]">
                    <ShieldCheck className="size-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-[#161B2B]">
                    {mode.title}
                  </h3>
                </div>
                <span className="rounded-full bg-[#EAF1FF] px-3 py-1 text-xs font-semibold text-[#2A65E9]">
                  {mode.tag}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#161B2B]/60">
                {mode.description}
              </p>
              <ul className="mt-5 space-y-3">
                {mode.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-sm text-[#161B2B]/75"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-[#2A65E9]" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="py-14">
        <SectionHeading
          eyebrow="After you sign up"
          title="Always know where your setup stands"
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {statuses.map((status, index) => (
            <div
              key={status.title}
              className="relative rounded-2xl border border-[#161B2B]/8 bg-white p-6"
            >
              <div className="flex items-center gap-2">
                <CircleCheck
                  className={`size-5 ${index === statuses.length - 1 ? "text-[#177a6d]" : "text-[#2A65E9]"}`}
                />
                <h3 className="text-base font-semibold text-[#161B2B]">
                  {status.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#161B2B]/60">
                {status.description}
              </p>
              {index < statuses.length - 1 && (
                <ArrowRight className="absolute -right-3.5 top-1/2 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-white text-[#2A65E9] md:block" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/pricing"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2A65E9] px-7 text-sm font-semibold text-white shadow-lg shadow-[#2A65E9]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2058D0]"
          >
            Choose a plan
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default HowItWorksPage;
