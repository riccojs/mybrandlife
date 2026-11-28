import { useState } from "react";
import { Link } from "react-router";
import { BookOpen, ChevronDown, CreditCard, LogIn } from "lucide-react";
import PageIntro from "../component/common/Page.intro";
import ContactForm from "../component/support/Contact.form";


const faqs = [
  {
    question: "Do I need to share my social media passwords?",
    answer:
      "No. Our team sends you a secure connection link for each platform, and you authorize access directly with the platform. BPS never asks for or stores your social passwords.",
  },
  {
    question: "Can I change my approval preference later?",
    answer:
      "Yes. You can switch between No Approval Required and Approval Required at any time. The change shows as pending until our team applies it, usually within a few business days.",
  },
  {
    question: "How do I send you a promotion or event?",
    answer:
      "Submit a content request from your account with the details, dates, and any asset links. Add files to your shared Google Drive folder.",
  },
  {
    question: "How long does setup take?",
    answer:
      "After you submit onboarding, your account moves to Setup in Progress while we create your workspace, share your Drive folder, and send connection links. The time to your first post depends on your plan.",
  },
  {
    question: "Where do I manage billing?",
    answer:
      "Billing runs through your MyBrandLife account and Stripe. Sign in to update your payment method, view invoices, or change plans.",
  },
  {
    question: "Do you guarantee followers, reach, or leads?",
    answer:
      "No. We follow platform best practices and current trends, but platforms control their own algorithms, so no one can guarantee specific results.",
  },
];

const quickLinks = [
  { title: "How it works", description: "The eight steps from sign-up to published.", to: "/how-it-works", icon: BookOpen },
  { title: "Plans & pricing", description: "Compare plans and what's included.", to: "/pricing", icon: CreditCard },
  { title: "Sign in", description: "Manage your setup, requests, and billing.", to: "/auth/sign-in", icon: LogIn },
];

const SupportPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <>
      <PageIntro
        eyebrow="Support"
        title="How can we help?"
        description="Find quick answers below, or send our team a message and we'll get back to you."
      />

      <section className="py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map(({ title, description, to, icon: Icon }) => (
            <Link
              key={title}
              to={to}
              className="flex gap-4 rounded-2xl border border-[#161B2B]/8 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#2A65E9]/25"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#2A65E9]/8 text-[#2A65E9]">
                <Icon className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-[#161B2B]">{title}</span>
                <span className="mt-1 block text-sm text-[#161B2B]/60">{description}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-8 py-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#161B2B]">
            Frequently asked questions
          </h2>
          <div className="mt-6 divide-y divide-[#161B2B]/8 rounded-2xl border border-[#161B2B]/8 bg-white">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-[#161B2B]"
                  >
                    {faq.question}
                    <ChevronDown
                      className={`size-4 shrink-0 text-[#161B2B]/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-5 text-sm leading-6 text-[#161B2B]/60">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <ContactForm />
      </section>
    </>
  );
};

export default SupportPage;
