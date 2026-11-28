const footerLinks = [
  {
    label: "Terms",
    href: "/terms",
  },
  {
    label: "Privacy",
    href: "/privacy",
  },
  {
    label: "Support",
    href: "/support",
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#161B2B]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-7 sm:px-8 md:flex-row lg:px-10">
        <p className="text-center text-xs font-normal text-white/80 md:text-left">
          © MyBrandLife & Brand Pulse Social - {currentYear}
        </p>
        <nav className="flex items-center gap-6" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-normal text-white/80 transition-colors duration-200 hover:text-white focus:outline-none focus-visible:text-[#2A65E9]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
