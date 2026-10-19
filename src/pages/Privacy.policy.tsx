import { useEffect } from "react";

function PrivacyPolicy() {
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    document.title = "Privacy Policy — My Brand Life";
  }, []);

  return (
    <section className="py-5 md:py-10 print:py-0">
      <div className="container flex flex-col gap-5 md:gap-10 relative">
        <div className="absolute top-0 right-0 print:hidden">
          <button
            onClick={handlePrint}
            title="Print this page"
            className="w-10 h-10 active:scale-105 cursor-pointer flex justify-center items-center border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            <i className="fa-solid fa-print text-md md:text-lg"></i>
          </button>
        </div>

        <div className="flex flex-col gap-2 border-b border-gray-200 pb-5">
          <h2 className="text-md md:text-lg font-medium">
            My Brand Life — Privacy Policy
          </h2>
          <h3 className="text-sm md:text-base font-normal">
            <strong>Last Updated:</strong> October 28, 2025
          </h3>
          <p className="text-sm md:text-base font-normal">
            Your privacy matters to us. This Privacy Policy explains how My
            Brand Life LLC collects, uses, and protects your information when
            you use mybrandlife.me and its connected applications.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-200 pb-5">
          <h2 className="text-md md:text-lg font-medium">
            1. Information We Collect
          </h2>
          <h3 className="text-normal text-sm md:text-base">We collect:</h3>
          <ul className="list-disc pl-10 flex flex-col gap-2 text-sm md:text-base">
            <li>
              <strong>Account Data:</strong> name, email, phone, business info,
              and login credentials.
            </li>
            <li>
              <strong>Usage Data:</strong> page visits, clicks, IP address,
              browser type, and device info (via Plausible Analytics).
            </li>
            <li>
              <strong>Payment Data:</strong> processed securely through Stripe;
              we do not store credit card numbers.
            </li>
            <li>
              <strong>Visitor Form Data:</strong> name, email, phone, business
              info, and login credentials.
            </li>
          </ul>
          <p className="text-sm md:text-base font-normal">
            Optional integrations (e.g., GPS location sharing or affiliate
            tracking) collect additional data only with visitor consent.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-200 pb-5">
          <h2 className="text-md md:text-lg font-medium">
            2. How We Use Your Information
          </h2>
          <h3 className="text-sm md:text-base">We use your information to:</h3>
          <ul className="list-disc pl-10 flex flex-col gap-2 text-sm md:text-base">
            <li>Provide and personalize your hosted brand page.</li>
            <li>Process subscriptions and billing.</li>
            <li>Improve platform performance and reliability.</li>
            <li>Communicate updates, new features, or offers.</li>
            <li>Prevent fraud, spam, or misuse.</li>
          </ul>
          <p className="text-sm md:text-base font-normal">
            We never sell your data.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-200 pb-5">
          <h2 className="text-md md:text-lg font-medium">
            3. Cookies and Analytics
          </h2>
          <p className="text-sm md:text-base font-normal">
            We use <strong>Plausible Analytics,</strong> a privacy-focused
            analytics service that does not use cookies or track individuals.
          </p>
          <p className="text-sm md:text-base font-normal">
            Limited non-personal usage data (e.g., country, browser type) may be
            collected for performance insights.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-200 pb-5">
          <h2 className="text-md md:text-lg font-medium">4. Data Sharing</h2>
          <h3 className="text-sm md:text-base">We share data only with:</h3>
          <ul className="list-disc pl-10 flex flex-col gap-2 text-sm md:text-base">
            <li>
              <strong>Stripe</strong> for payment processing.
            </li>
            <li>
              <strong>Hostinger</strong> for hosting and email infrastructure.
            </li>
            <li>
              <strong>Google Workspace </strong> for forms and communications.
            </li>
            <li>
              <strong>Affiliate partners </strong> when links are voluntarily
              used.
            </li>
          </ul>
          <p className="text-sm md:text-base font-normal">
            All third parties comply with GDPR and other data protection
            standards.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-200 pb-5">
          <h2 className="text-md md:text-lg font-medium">5. Data Retention</h2>
          <p className="text-sm md:text-base font-normal">
            We retain account and visitor data as long as necessary to provide
            services or comply with legal obligations.
          </p>
          <p className="text-sm md:text-base font-normal">
            Users may request deletion of personal data at any time via{" "}
            <strong>privacy@mybrandlife.me.</strong>
          </p>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-200 pb-5">
          <h2 className="text-md md:text-lg font-medium">6. Security</h2>
          <p className="text-sm md:text-base font-normal">
            We use SSL encryption, secure hosting, and restricted database
            access. No online service is 100% secure, but we continuously
            monitor and improve our systems to protect user data.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-200 pb-5">
          <h2 className="text-md md:text-lg font-medium">7. Your Rights</h2>
          <h3 className="text-sm md:text-base">
            Depending on your location, you may have rights to:
          </h3>
          <ul className="list-disc pl-10 flex flex-col gap-2 text-sm md:text-base">
            <li>Access, correct, or delete your personal data.</li>
            <li>Opt-out of marketing emails.</li>
            <li>
              Withdraw consent for optional features (like location tracking).
            </li>
          </ul>
          <p className="text-sm md:text-base font-normal">
            To exercise these rights, contact{" "}
            <strong>privacy@mybrandlife.me.</strong>
          </p>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-200 pb-5">
          <h2 className="text-md md:text-lg font-medium">
            8. Children’s Privacy
          </h2>
          <p className="text-sm md:text-base font-normal">
            Our services are not directed toward children under 13.
          </p>
          <p className="text-sm md:text-base font-normal">
            We do not knowingly collect data from minors.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-200 pb-5">
          <h2 className="text-md md:text-lg font-medium">9. Policy Updates</h2>
          <p className="text-sm md:text-base font-normal">
            We may revise this Privacy Policy periodically.
          </p>
          <p className="text-sm md:text-base font-normal">
            Updates will be posted with a new “Last Updated” date.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-md md:text-lg font-medium">10. Contact Us</h2>
          <p className="text-sm md:text-base font-normal">
            <strong>privacy@mybrandlife.me</strong>
          </p>
          <p className="text-sm md:text-base font-normal">
            My Brand Life LLC — Stevens Point, Wisconsin, USA
          </p>
        </div>
      </div>
    </section>
  );
}

export default PrivacyPolicy;
