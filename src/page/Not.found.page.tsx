import { Link } from "react-router";

const NotFoundPage = () => (
  <section className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2A65E9]">404</p>
    <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#161B2B] sm:text-4xl">
      We couldn't find that page
    </h1>
    <p className="mt-3 max-w-md text-sm leading-6 text-[#161B2B]/60">
      The link may be broken or the page may have moved.
    </p>
    <Link
      to="/"
      className="mt-8 inline-flex h-11 items-center rounded-xl bg-[#2A65E9] px-6 text-sm font-semibold text-white hover:bg-[#2058D0]"
    >
      Back to home
    </Link>
  </section>
);

export default NotFoundPage;
