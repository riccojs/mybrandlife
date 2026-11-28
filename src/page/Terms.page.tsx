import LegalLayout, { type LegalSection } from "../component/common/Legal.layout";

const sections: LegalSection[] = [
  {
    title: "The service",
    body: [
      "Brand Pulse Social (\"BPS\") is a managed social publishing service. BPS researches your business, industry, and current social trends, then creates, schedules, and publishes organic social content for your brand within the limits of your plan.",
      "BPS is not a full-service marketing agency. Paid advertising, branding projects, SEO, web design, public relations, and lead-generation campaigns are not part of a BPS plan unless agreed in writing.",
    ],
  },
  {
    title: "Your account",
    body: [
      "BPS uses your MyBrandLife account for sign-in and billing. You are responsible for keeping your login details secure and for activity under your account.",
      "You must provide accurate business information during onboarding and keep it up to date.",
    ],
  },
  {
    title: "Plans, billing and activation fees",
    body: [
      "Plans are billed monthly or annually through Stripe, via your MyBrandLife account. Prices, activation fees, and included deliverables are shown on the Pricing page at the time you subscribe.",
      "Plans renew automatically until cancelled. Activation fees cover onboarding and setup and are non-refundable once setup has started.",
    ],
  },
  {
    title: "Your content and brand assets",
    body: [
      "You keep ownership of the logos, images, videos, and other materials you provide. You grant BPS permission to use them to create and publish content for your brand.",
      "You confirm that you have the rights to everything you upload and that it does not infringe anyone else's rights.",
    ],
  },
  {
    title: "Social account access",
    body: [
      "You connect your social accounts through authorization links provided by BPS. BPS never asks for or stores your social network passwords.",
      "You can revoke access at any time from the social platform. Doing so may stop publishing until access is restored.",
    ],
  },
  {
    title: "Approval preference",
    body: [
      "During onboarding you choose No Approval Required or Approval Required. With No Approval Required, you authorize BPS to publish plan-covered content without prior review. With Approval Required, content is published only after it is approved through the review process.",
      "BPS may request approval for a sensitive or special post even when your preference is No Approval Required. Changes to your preference take effect once BPS staff have applied them.",
    ],
  },
  {
    title: "No guaranteed results",
    body: [
      "BPS follows platform best practices and observable trends, but social platforms control their own algorithms. BPS does not guarantee reach, rankings, engagement, followers, leads, or sales.",
    ],
  },
  {
    title: "Cancellation",
    body: [
      "You can cancel through your MyBrandLife account. Cancellation takes effect at the end of the current billing period, and content already scheduled may still publish unless you ask us to remove it.",
    ],
  },
  {
    title: "Changes to these terms",
    body: [
      "We may update these terms from time to time. If we make material changes, we will let you know by email or in your account before they take effect.",
    ],
  },
];

const TermsPage = () => (
  <LegalLayout
    title="Terms of Service"
    updated="November 27, 2026"
    intro="These terms explain how Brand Pulse Social works and what we each agree to when you subscribe to a BPS plan."
    sections={sections}
  />
);

export default TermsPage;
