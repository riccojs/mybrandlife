import LegalLayout, { type LegalSection } from "../component/common/Legal.layout";

const sections: LegalSection[] = [
  {
    title: "Information we collect",
    body: [
      "Account information from your MyBrandLife account, such as your name, email address, and phone number.",
      "Business and brand information you provide during onboarding, such as your website, industry, audience, brand voice, goals, and topics to avoid.",
      "Approver names and email addresses, if you choose Approval Required.",
      "Brand assets you share with us, including files in your shared Google Drive folder and the Google email address used to share it.",
    ],
  },
  {
    title: "Information we don't collect",
    body: [
      "We never ask for or store your social network passwords. Social accounts are connected through authorization links, and you can revoke access at any time from the platform.",
      "Card details are handled by Stripe. BPS does not store your full payment card number.",
    ],
  },
  {
    title: "How we use your information",
    body: [
      "To create, schedule, and publish content for your brand.",
      "To send approval requests, calendar links, and reports.",
      "To manage your subscription, provide support, and tell you about changes to the service.",
    ],
  },
  {
    title: "Service providers",
    body: [
      "We use trusted providers to run BPS, including Stripe for payments, Google Drive for shared assets, and a social publishing platform for scheduling, approvals, and reporting. They process your information only to provide their services to us.",
      "We do not sell your personal information.",
    ],
  },
  {
    title: "Data retention",
    body: [
      "We keep your information while your subscription is active and for a limited period afterwards to meet legal, accounting, and support needs. You can ask us to delete your information at any time.",
    ],
  },
  {
    title: "Your choices and rights",
    body: [
      "You can view and update your business information from your account, change your approval preference, and revoke social account access from each platform.",
      "Depending on where you live, you may have the right to access, correct, or delete your personal information. Contact us through the Support page to make a request.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "We may update this policy from time to time. We will post the new version here and update the date at the top of the page.",
    ],
  },
];

const PrivacyPage = () => (
  <LegalLayout
    title="Privacy Policy"
    updated="November 27, 2026"
    intro="This policy explains what information Brand Pulse Social collects, how we use it, and the choices you have."
    sections={sections}
  />
);

export default PrivacyPage;
