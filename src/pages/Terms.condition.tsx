import { useEffect } from "react";

function TermsCondition() {
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    document.title = "Terms & Condition — My Brand Life";
  }, []);

  return (
    <section className="py-10 print:py-0">
      <div className="container flex flex-col gap-10 relative">
        <div className="absolute top-0 right-0 print:hidden">
          <button
            onClick={handlePrint}
            title="Print this page"
            className="w-10 h-10 active:scale-105 cursor-pointer flex justify-center items-center border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            <i className="fa-solid fa-print text-xl"></i>
          </button>
        </div>

        <div className="flex flex-col gap-2 border-b border-gray-400 pb-5">
          <h2 className="text-xl font-medium">
            🧾 My Brand Life — Terms and Conditions
          </h2>
          <h3 className="text-base font-normal">
            <strong>Last Updated:</strong> October 28, 2025
          </h3>
          <p className="text-base font-normal">
            Welcome to <strong>My Brand Life</strong>, operated by{" "}
            <strong>My Brand Life LLC</strong> (“Company,” “we,” “our,” or
            “us”). By accessing or using any part of our platform — including
            mybrandlife.me and its connected sub-domains (e.g., mydjlife.me,
            mybartendinglife.me, mydevlife.me) — you agree to these Terms and
            Conditions.
          </p>
          <p className="text-base font-normal">
            If you do not agree, you may not use the platform.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-400 pb-5">
          <h2 className="text-xl font-medium">1. Service Overview</h2>
          <h3 className="text-normal text-lg">
            My Brand Life provides users with tools and templates to build
            personal and business landing pages, manage brand assets, and access
            related applications, including but not limited to:
          </h3>
          <ul className="list-disc pl-10 flex flex-col gap-2">
            <li>
              <strong>BrandBook</strong> (calendar and booking engine)
            </li>
            <li>
              <strong>Echo</strong> (request and tipping engine)
            </li>
            <li>
              <strong>BrandTrack</strong> (link tracking and analytics)
            </li>
            <li>
              <strong>BrandTap</strong> (affiliate and merch tracking system)
            </li>
            <li>
              <strong>BrandPulse Social</strong> (social automation platform)
            </li>
          </ul>
          <p className="text-base font-normal">
            Each subscription tier grants access to specific apps and features
            as described on the Pricing or Sales page.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-400 pb-5">
          <h2 className="text-xl font-medium">2. Account Registration</h2>
          <h3>
            You must create an account to access most features. You agree to:
          </h3>
          <ul className="list-disc pl-10 flex flex-col gap-2">
            <li>Provide accurate and complete registration information.</li>
            <li>Keep your login credentials secure and confidential.</li>
            <li>Be responsible for all activity under your account.</li>
          </ul>
          <p className="text-base font-normal">
            Accounts found engaging in abuse, impersonation, or unauthorized
            resale will be suspended or terminated without notice.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-400 pb-5">
          <h2 className="text-xl font-medium">3. Subscription and Payments</h2>
          <ul className="list-disc pl-10 flex flex-col gap-2">
            <li>
              All plans are billed via <strong>Stripe</strong> on a monthly or
              annual basis.
            </li>
            <li>
              Some promotional codes may extend subscription length (e.g., 14
              months for the price of 12).
            </li>
            <li>Fees are non-refundable except where required by law.</li>
            <li>
              Failure to renew will result in limited access or removal of
              hosted content after a grace period.
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-400 pb-5">
          <h2 className="text-xl font-medium">4. Intellectual Property</h2>
          <h3>
            All code, content, design elements, and branding on My Brand Life
            are owned or licensed by My Brand Life LLC.
          </h3>

          <p className="text-base font-normal">
            You retain ownership of your uploaded content but grant us a
            non-exclusive license to host and display it within your page or
            sub-domain.
          </p>
          <p className="text-base font-normal">
            You may not reverse engineer, resell, or redistribute our templates,
            systems, or applications.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-400 pb-5">
          <h2 className="text-xl font-medium">5. Acceptable Use</h2>
          <p className="text-base font-normal">Users agree not to:</p>
          <ul className="list-disc pl-10 flex flex-col gap-2">
            <li>Upload or post illegal, defamatory, or harmful content.</li>
            <li>
              Use the platform for spam, fraud, or unauthorized marketing.
            </li>
            <li>Attempt to breach, test, or overload platform security.</li>
          </ul>
          <p className="text-base font-normal">
            Violations may result in immediate suspension or permanent ban.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-400 pb-5">
          <h2 className="text-xl font-medium">6. Third-Party Integrations.</h2>
          <h3>We integrate with third-party services such as:</h3>
          <ul className="list-disc pl-10 flex flex-col gap-2">
            <li>
              <strong>Hostinger </strong> (hosting infrastructure)
            </li>
            <li>
              <strong>Stripe </strong> (billing)
            </li>
            <li>
              <strong>Plausible Analytics </strong> (usage metrics)
            </li>
            <li>
              <strong>Google Workspace </strong> (email and forms)
            </li>
          </ul>
          <p className="text-base font-normal">
            Your use of these services is subject to their respective policies.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-400 pb-5">
          <h2 className="text-xl font-medium">7. Limitation of Liability</h2>
          <h3>
            To the maximum extent permitted by law, My Brand Life LLC is not
            liable for any indirect, incidental, or consequential damages
            resulting from:
          </h3>
          <ul className="list-disc pl-10 flex flex-col gap-2">
            <li>• Platform downtime or data loss,</li>
            <li>• Third-party integrations or service interruptions,</li>
            <li>• Misuse of the system or user content.</li>
          </ul>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-400 pb-5">
          <h2 className="text-xl font-medium">8. Termination</h2>
          <p className="text-base font-normal">
            We may suspend or terminate your account at any time for violations
            of these Terms. Upon termination, all associated data may be deleted
            after a reasonable retention period.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-400 pb-5">
          <h2 className="text-xl font-medium">9. Changes to Terms</h2>
          <p className="text-base font-normal">
            We may update these Terms periodically. Continued use of the
            platform after updates constitutes acceptance of the revised Terms.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-medium">10. Contact</h2>
          <p className="text-base font-normal">Questions or concerns?</p>
          <p>
            <strong>📧 support@mybrandlife.me</strong>
          </p>
          <p className="text-base font-normal">
            📍 My Brand Life LLC — Stevens Point, Wisconsin, USA
          </p>
        </div>
      </div>
    </section>
  );
}

export default TermsCondition;
