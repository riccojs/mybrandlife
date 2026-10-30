type ParagraphBlock = {
  type: "paragraph";
  text: string;
  bold?: boolean;
};

type ListBlock = {
  type: "list";
  items: string[];
};

type SubheadingBlock = {
  type: "subheading";
  text: string;
};

type ContentBlock = ParagraphBlock | ListBlock | SubheadingBlock;

type Section = {
  title: string;
  content: ContentBlock[];
};

const privacyContent: Section[] = [
  {
    title: "1. Information We Collect",
    content: [
      {
        type: "paragraph",
        text: "The information we collect depends on how you interact with My Brand Life and which features you use.",
      },

      {
        type: "subheading",
        text: "Account Information",
      },
      {
        type: "paragraph",
        text: "When you create or manage a My Brand Life account, we may collect information such as:",
      },
      {
        type: "list",
        items: [
          "Name",
          "Email address",
          "Phone number",
          "Business or brand information",
          "Mailing or billing address",
          "Account preferences",
          "Subscription and package information",
          "Authentication and account-security information",
        ],
      },
      {
        type: "paragraph",
        text: "We use this information to create, maintain, secure, and support your account.",
      },

      {
        type: "subheading",
        text: "Profile, Lander, and User-Provided Content",
      },
      {
        type: "paragraph",
        text: "Subscribers may provide information to create and customize public-facing lander pages and related services.",
      },
      {
        type: "paragraph",
        text: "This may include:",
      },
      {
        type: "list",
        items: [
          "Name or brand name",
          "Profile information",
          "Business information",
          "Photos, logos, graphics, or other media",
          "Contact information",
          "Social media links",
          "Website links",
          "Custom links",
          "Booking information",
          "Merchandise information",
          "Files or documents",
          "Other content voluntarily submitted by the subscriber",
        ],
      },
      {
        type: "paragraph",
        text: "Information that a subscriber chooses to publish on a public lander may be visible to anyone who visits that page.",
      },
      {
        type: "paragraph",
        text: "Subscribers are responsible for determining what information they choose to make publicly available.",
      },

      {
        type: "subheading",
        text: "Visitor and Lead Form Information",
      },
      {
        type: "paragraph",
        text: "When a visitor submits information through a public lander, BrandForm, ECHO, BrandBook, contact form, request form, or similar My Brand Life feature, we may collect information voluntarily provided by that visitor.",
      },
      {
        type: "paragraph",
        text: "Depending on the feature, this may include:",
      },
      {
        type: "list",
        items: [
          "Name",
          "Email address",
          "Phone number",
          "Business or organization information",
          "Message or request information",
          "Booking or appointment information",
          "Request details",
          "Other information entered into the form",
        ],
      },
      {
        type: "paragraph",
        text: "Visitor form submissions may be made available to the My Brand Life subscriber associated with the lander, form, booking, or request.",
      },
      {
        type: "paragraph",
        text: "Visitors are not required to provide My Brand Life account login credentials when submitting a standard public visitor form.",
      },

      {
        type: "subheading",
        text: "Optional Location Information",
      },
      {
        type: "paragraph",
        text: "Certain My Brand Life features may allow a visitor to voluntarily share location information.",
      },
      {
        type: "paragraph",
        text: "Location information is collected only when the visitor affirmatively chooses to share it or otherwise grants the required device or browser permission.",
      },
      {
        type: "paragraph",
        text: "Depending on the feature and permission granted, location information may include approximate or device-provided geographic location information.",
      },
      {
        type: "paragraph",
        text: "When location sharing is associated with a subscriber's lander, request, or other feature, the location information may be made available to that subscriber as described at the time consent is requested.",
      },
      {
        type: "paragraph",
        text: "Declining location access should not prevent a visitor from using unrelated features of the platform unless location is required for a specific feature.",
      },

      {
        type: "subheading",
        text: "Payment and Transaction Information",
      },
      {
        type: "paragraph",
        text: "Payments and subscriptions may be processed through third-party payment processors such as Stripe.",
      },
      {
        type: "paragraph",
        text: "My Brand Life does not need to store full payment card numbers to process standard transactions through these providers.",
      },
      {
        type: "paragraph",
        text: "We may receive and retain information related to a transaction, including:",
      },
      {
        type: "list",
        items: [
          "Customer or transaction identifiers",
          "Payment status",
          "Subscription status",
          "Plan or package purchased",
          "Billing period",
          "Amount paid",
          "Discounts or promotional codes applied",
          "Refund or dispute status",
          "Related transaction records",
        ],
      },
      {
        type: "paragraph",
        text: "Payment providers process payment information according to their own terms and privacy policies.",
      },

      {
        type: "subheading",
        text: "Usage, Device, and Analytics Information",
      },
      {
        type: "paragraph",
        text: "When you interact with My Brand Life, we may automatically collect technical and usage information.",
      },
      {
        type: "paragraph",
        text: "Depending on the services and analytics technologies currently enabled, this may include:",
      },
      {
        type: "list",
        items: [
          "Pages viewed",
          "Links or buttons clicked",
          "Referral source",
          "Browser type",
          "Device type",
          "Operating system",
          "IP address",
          "Approximate geographic region derived from technical information",
          "Date and time of access",
          "Session or interaction information",
          "Errors and performance information",
          "Feature usage",
          "QR, NFC, link, or campaign interactions",
          "Other technical activity required to operate, secure, analyze, or improve the service",
        ],
      },
      {
        type: "paragraph",
        text: "My Brand Life may use internal analytics tools, including features such as BrandTrack, as well as third-party analytics or infrastructure providers.",
      },
      {
        type: "paragraph",
        text: "The specific providers used by My Brand Life may change over time as our platform evolves.",
      },

      {
        type: "subheading",
        text: "Connected Services and Integrations",
      },
      {
        type: "paragraph",
        text: "If you choose to connect My Brand Life with a third-party account or service, we may receive information necessary to establish and operate that connection.",
      },
      {
        type: "paragraph",
        text: "The information received depends on:",
      },
      {
        type: "list",
        items: [
          "The service being connected",
          "The permissions you authorize",
          "The functionality you choose to use",
        ],
      },
      {
        type: "paragraph",
        text: "We do not receive information from a connected service beyond what the service provides under the permissions granted by the user.",
      },

      {
        type: "subheading",
        text: "Communications and Support",
      },
      {
        type: "paragraph",
        text: "If you contact My Brand Life for customer service, technical support, billing assistance, feedback, or another inquiry, we may retain:",
      },
      {
        type: "list",
        items: [
          "Your contact information",
          "Your message",
          "Support history",
          "Files or screenshots you provide",
          "Technical information needed to investigate the issue",
        ],
      },
    ],
  },

  {
    title: "2. How We Use Information",
    content: [
      {
        type: "paragraph",
        text: "We may use information collected through My Brand Life to:",
      },
      {
        type: "list",
        items: [
          "Create and maintain accounts",
          "Provide public lander pages and related services",
          "Process subscriptions and payments",
          "Deliver purchased or requested features",
          "Process visitor forms, requests, bookings, and other submissions",
          "Provide analytics and engagement information",
          "Operate QR, NFC, link, tracking, and related services",
          "Authenticate users and protect accounts",
          "Provide customer support",
          "Send service-related communications",
          "Send optional marketing or promotional communications",
          "Improve features, design, performance, and reliability",
          "Diagnose technical problems",
          "Monitor platform usage",
          "Prevent fraud, abuse, spam, and unauthorized activity",
          "Enforce our Terms and other policies",
          "Comply with legal and regulatory obligations",
          "Protect My Brand Life, our subscribers, visitors, and others",
        ],
      },
      {
        type: "paragraph",
        text: "Where required by applicable law, we rely on an appropriate legal basis such as consent, performance of a contract, legitimate business interests, or compliance with legal obligations.",
      },
    ],
  },

  {
    title: "3. Cookies, Local Storage, and Analytics",
    content: [
      {
        type: "paragraph",
        text: "My Brand Life and the service providers that support our platform may use cookies, local storage, session technologies, analytics tools, or similar technologies where necessary or appropriate.",
      },
      {
        type: "paragraph",
        text: "These technologies may be used to:",
      },
      {
        type: "list",
        items: [
          "Keep users signed in",
          "Maintain sessions",
          "Remember preferences",
          "Secure accounts",
          "Process transactions",
          "Measure platform performance",
          "Understand feature usage",
          "Diagnose errors",
          "Prevent abuse",
          "Generate analytics",
        ],
      },
      {
        type: "paragraph",
        text: "The technologies and service providers used by My Brand Life may change as the platform develops.",
      },
      {
        type: "paragraph",
        text: "Where consent is legally required for a particular type of cookie, analytics technology, or tracking activity, we will seek consent or provide appropriate controls.",
      },
      {
        type: "paragraph",
        text: "Users may also be able to manage certain cookie or browser-storage settings through their browser or device.",
      },
    ],
  },

  {
    title: "4. Analytics and BrandTrack",
    content: [
      {
        type: "paragraph",
        text: "My Brand Life may provide analytics and engagement information to subscribers through services such as BrandTrack or other analytics features.",
      },
      {
        type: "paragraph",
        text: "Depending on the feature and subscription level, analytics may include information about interactions with:",
      },
      {
        type: "list",
        items: [
          "Public landers",
          "Links",
          "Buttons",
          "QR codes",
          "NFC interactions",
          "Campaigns",
          "Forms",
          "Requests",
          "Other supported engagement features",
        ],
      },
      {
        type: "paragraph",
        text: "Analytics are intended to help subscribers understand engagement with their My Brand Life presence.",
      },
      {
        type: "paragraph",
        text: "The exact data collected and displayed may vary depending on the feature, account package, configuration, technology used, and applicable privacy requirements.",
      },
    ],
  },

  {
    title: "5. How Information Is Shared",
    content: [
      {
        type: "paragraph",
        text: "We do not disclose personal information indiscriminately.",
      },
      {
        type: "paragraph",
        text: "Information may be shared in the following circumstances.",
      },

      {
        type: "subheading",
        text: "With the Subscriber You Intentionally Contact",
      },
      {
        type: "paragraph",
        text: "When you submit information through a subscriber's lander, form, booking feature, ECHO request, BrandBook request, or similar feature, the information you provide may be shared with that subscriber so they can respond to or fulfill your request.",
      },

      {
        type: "subheading",
        text: "With Service Providers",
      },
      {
        type: "paragraph",
        text: "We may use third-party providers to help operate My Brand Life.",
      },
      {
        type: "paragraph",
        text: "These providers may perform services such as:",
      },
      {
        type: "list",
        items: [
          "Payment processing",
          "Website and application hosting",
          "Cloud infrastructure",
          "Email delivery",
          "File storage",
          "Communications",
          "Authentication",
          "Analytics",
          "Error monitoring",
          "Customer support",
          "Security",
          "Software infrastructure",
        ],
      },
      {
        type: "paragraph",
        text: "These providers may access information only to the extent reasonably necessary to perform services for us and are subject to their own contractual obligations, privacy practices, and applicable laws.",
      },

      {
        type: "subheading",
        text: "With Connected Services",
      },
      {
        type: "paragraph",
        text: "If you choose to connect a third-party application or service to My Brand Life, information may be exchanged with that provider as necessary to perform the requested connection.",
      },

      {
        type: "subheading",
        text: "For Legal or Safety Reasons",
      },
      {
        type: "paragraph",
        text: "We may disclose information when we reasonably believe disclosure is necessary to:",
      },
      {
        type: "list",
        items: [
          "Comply with applicable law",
          "Respond to a lawful legal request",
          "Protect the rights or property of My Brand Life",
          "Protect subscribers, visitors, or the public",
          "Investigate suspected fraud or abuse",
          "Enforce our agreements or policies",
          "Protect the security or integrity of our platform",
        ],
      },

      {
        type: "subheading",
        text: "Business Transfers",
      },
      {
        type: "paragraph",
        text: "If My Brand Life is involved in a merger, acquisition, financing, restructuring, sale of assets, or similar business transaction, information may be transferred as part of that transaction subject to applicable law.",
      },
    ],
  },

  {
    title: "6. Sale and Sharing of Personal Information",
    content: [
      {
        type: "paragraph",
        text: "My Brand Life does not sell personal information for monetary consideration.",
      },
      {
        type: "paragraph",
        text: "Certain privacy laws may define terms such as “sale,” “sharing,” or “targeted advertising” more broadly than their ordinary meaning.",
      },
      {
        type: "paragraph",
        text: "If My Brand Life engages in activity that creates additional opt-out rights under applicable law, we will provide the notices or controls required for affected users.",
      },
    ],
  },

  {
    title: "7. Third-Party Websites and Services",
    content: [
      {
        type: "paragraph",
        text: "My Brand Life pages may contain links to social networks, websites, stores, payment services, affiliate partners, or other third-party services.",
      },
      {
        type: "paragraph",
        text: "My Brand Life does not control the privacy practices of independent third parties.",
      },
      {
        type: "paragraph",
        text: "When you leave My Brand Life or interact directly with a third-party service, that provider's terms and privacy policy apply.",
      },
      {
        type: "paragraph",
        text: "We encourage users to review the privacy practices of third-party services before providing personal information to them.",
      },
    ],
  },

  {
    title: "8. Affiliate and Referral Information",
    content: [
      {
        type: "paragraph",
        text: "My Brand Life may offer referral, affiliate, promotional, partner, or discount programs.",
      },
      {
        type: "paragraph",
        text: "When an eligible referral link, promotional code, or similar feature is used, we may collect information necessary to:",
      },
      {
        type: "list",
        items: [
          "Apply the appropriate discount",
          "Attribute the referral",
          "Determine eligibility",
          "Prevent duplicate or fraudulent use",
          "Calculate referral or partner benefits",
          "Maintain required transaction records",
        ],
      },
      {
        type: "paragraph",
        text: "We do not require unrelated personal information solely to attribute a referral.",
      },
    ],
  },

  {
    title: "9. Data Retention",
    content: [
      {
        type: "paragraph",
        text: "We retain information for as long as reasonably necessary to:",
      },
      {
        type: "list",
        items: [
          "Provide our services",
          "Maintain accounts",
          "Complete transactions",
          "Resolve disputes",
          "Maintain business and accounting records",
          "Prevent fraud or abuse",
          "Enforce agreements",
          "Comply with legal obligations",
        ],
      },
      {
        type: "paragraph",
        text: "Retention periods may vary depending on the type of information and the reason it was collected.",
      },
      {
        type: "paragraph",
        text: "Information may remain temporarily in backups or system archives after deletion from active systems.",
      },
      {
        type: "paragraph",
        text: "When information is no longer reasonably required, we may delete, anonymize, or otherwise dispose of it in accordance with our operational and legal requirements.",
      },
    ],
  },

  {
    title: "10. Data Security",
    content: [
      {
        type: "paragraph",
        text: "We use reasonable administrative, technical, and organizational safeguards designed to protect information against unauthorized access, misuse, alteration, loss, or disclosure.",
      },
      {
        type: "paragraph",
        text: "These safeguards may include measures such as:",
      },
      {
        type: "list",
        items: [
          "Encrypted network connections",
          "Authentication controls",
          "Restricted system access",
          "Access logging",
          "Infrastructure security",
          "Monitoring",
          "Backups",
          "Security updates",
          "Internal access controls",
        ],
      },
      {
        type: "paragraph",
        text: "No website, application, network, or storage system can guarantee absolute security.",
      },
      {
        type: "paragraph",
        text: "Users are responsible for maintaining the confidentiality of their account credentials and should notify My Brand Life if they believe their account has been compromised.",
      },
    ],
  },

  {
    title: "11. Your Privacy Choices and Rights",
    content: [
      {
        type: "paragraph",
        text: "Depending on where you live, applicable law may provide you with certain privacy rights.",
      },
      {
        type: "paragraph",
        text: "These may include the right to:",
      },
      {
        type: "list",
        items: [
          "Request access to personal information",
          "Request correction of inaccurate information",
          "Request deletion of certain information",
          "Request a copy of certain information",
          "Withdraw consent where processing is based on consent",
          "Object to or restrict certain processing",
          "Opt out of certain marketing communications",
          "Opt out of certain types of sale, sharing, or targeted advertising where applicable",
          "Appeal certain privacy-request decisions where required by law",
        ],
      },
      {
        type: "paragraph",
        text: "These rights are subject to applicable exceptions and verification requirements.",
      },
      {
        type: "paragraph",
        text: "To submit a privacy request, contact:",
      },
      {
        type: "paragraph",
        text: "privacy@mybrandlife.me",
        bold: true,
      },
      {
        type: "paragraph",
        text: "We may need to verify your identity before completing certain requests.",
      },
      {
        type: "paragraph",
        text: "Authorized agents may submit requests where permitted by applicable law and where appropriate authorization can be verified.",
      },
    ],
  },

  {
    title: "12. Marketing Communications",
    content: [
      {
        type: "paragraph",
        text: "Users may opt out of promotional email communications by using the unsubscribe option contained in the message or by contacting us.",
      },
      {
        type: "paragraph",
        text: "Opting out of marketing communications does not prevent My Brand Life from sending important service-related communications such as:",
      },
      {
        type: "list",
        items: [
          "Account notices",
          "Payment information",
          "Security alerts",
          "Subscription information",
          "Transaction confirmations",
          "Policy or service updates",
        ],
      },
    ],
  },

  {
    title: "13. Location Privacy",
    content: [
      {
        type: "paragraph",
        text: "My Brand Life does not require visitors to provide precise location information for ordinary browsing.",
      },
      {
        type: "paragraph",
        text: "When a feature offers optional location sharing, the visitor will be asked to provide permission before location information is collected.",
      },
      {
        type: "paragraph",
        text: "Users may deny or revoke device or browser location permission through their device or browser settings.",
      },
      {
        type: "paragraph",
        text: "Revoking permission prevents future location access but may not automatically delete information previously submitted.",
      },
      {
        type: "paragraph",
        text: "Requests regarding previously collected information may be submitted to:",
      },
      {
        type: "paragraph",
        text: "privacy@mybrandlife.me",
        bold: true,
      },
    ],
  },

  {
    title: "14. Children's Privacy",
    content: [
      {
        type: "paragraph",
        text: "My Brand Life services are not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13.",
      },
      {
        type: "paragraph",
        text: "If we learn that personal information from a child under 13 has been collected without appropriate authorization, we will take reasonable steps to delete it.",
      },
      {
        type: "paragraph",
        text: "Parents or guardians who believe a child has provided personal information to My Brand Life may contact:",
      },
      {
        type: "paragraph",
        text: "privacy@mybrandlife.me",
        bold: true,
      },
      {
        type: "paragraph",
        text: "Additional age restrictions may apply to specific services, transactions, or features.",
      },
    ],
  },

  {
    title: "15. International Users",
    content: [
      {
        type: "paragraph",
        text: "My Brand Life is based in the United States.",
      },
      {
        type: "paragraph",
        text: "If you access our services from another country, information may be processed or stored in the United States or other locations where our service providers operate.",
      },
      {
        type: "paragraph",
        text: "Privacy laws in those locations may differ from those in your country.",
      },
      {
        type: "paragraph",
        text: "Where required, we take reasonable measures intended to comply with applicable data-transfer and privacy requirements.",
      },
    ],
  },

  {
    title: "16. Changes to This Privacy Policy",
    content: [
      {
        type: "paragraph",
        text: "My Brand Life may update this Privacy Policy from time to time to reflect:",
      },
      {
        type: "list",
        items: [
          "Changes to our services",
          "New features",
          "New technologies",
          "Changes to our business practices",
          "Changes in legal or regulatory requirements",
        ],
      },
      {
        type: "paragraph",
        text: "When the policy changes, we will update the Last Updated date at the top of this page.",
      },
      {
        type: "paragraph",
        text: "If a change materially affects how we handle personal information, we may provide additional notice where appropriate or required by law.",
      },
    ],
  },

  {
    title: "17. Contact Us",
    content: [
      {
        type: "paragraph",
        text: "Questions, concerns, or privacy requests may be sent to:",
      },
      {
        type: "paragraph",
        text: "My Brand Life LLC",
        bold: true,
      },
      {
        type: "paragraph",
        text: "N4488 Powers Ave #3000\nMauston, WI 53948",
      },
      {
        type: "paragraph",
        text: "Email: ",
        bold: true,
      },
      {
        type: "paragraph",
        text: "privacy@mybrandlife.me",
      },
      {
        type: "paragraph",
        text: "For general support questions, please use the applicable My Brand Life support or contact channel.",
      },
    ],
  },
];

export default privacyContent;
