import Banner from "../assets/Grow-Your-Reach.png";

const MarketingPage = () => {
  return (
    <section className="min-h-screen bg-[#121216] text-neutral-50 flex flex-col">
      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 md:px-6">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
            <div>
              <span className="inline-flex items-center rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-yellow-300">
                Your brand. Your life. Your way.
              </span>

              <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
                Turn one link into{" "}
                <span className="text-yellow-300">
                  bookings, tips, sales, and most of all — that social
                  connection.
                </span>
              </h1>

              <p className="mt-4 text-sm text-neutral-300 md:text-base">
                My Brand Life gives you a single, branded landing page that
                connects your
                <span className="text-neutral-100">
                  {" "}
                  NFC, QR, bookings, tips, links, merch, and more
                </span>
                — so every tap and scan leads somewhere that actually works for
                you.
                <br />
                <span className="text-yellow-300 font-semibold">
                  Customer Connect
                </span>{" "}
                — connect your brand with your customers where they are.
              </p>

              <div className="mt-5 grid gap-3 text-sm text-neutral-200">
                <div className="flex gap-3">
                  <div className="mt-1 h-5 w-5 flex-none rounded-full bg-yellow-400/15 flex items-center justify-center text-[11px] text-yellow-300">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium text-neutral-50">
                      Stop juggling scattered links.
                    </p>
                    <p className="text-xs text-neutral-400">
                      One page replaces multiple bios, menus, QR codes, and
                      &quot;link in bio&quot; tools.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1 h-5 w-5 flex-none rounded-full bg-yellow-400/15 flex items-center justify-center text-[11px] text-yellow-300">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium text-neutral-50">
                      See what actually converts.
                    </p>
                    <p className="text-xs text-neutral-400">
                      Track taps, scans, and clicks so you know what nights,
                      posts, or promos work.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1 h-5 w-5 flex-none rounded-full bg-yellow-400/15 flex items-center justify-center text-[11px] text-yellow-300">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium text-neutral-50">
                      Built for DJs, bars, creators &amp; more.
                    </p>
                    <p className="text-xs text-neutral-400">
                      My DJ Life, My Bar Life, My Student Life and more — plus
                      apps like BrandTrack and Echo as we grow.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-xs text-neutral-400 md:text-sm">
                If you’re sending people to five different links right now,
                you’re losing them. Give them one branded page that feels
                premium and makes it easy to
                <span className="text-neutral-100">
                  {" "}
                  book you, tip you, and shop you.
                </span>
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-300 px-5 py-2.5 text-xs font-semibold text-black shadow-md transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
                >
                  🚀 Start Your Brand Life
                </a>
                <button
                  type="button"
                  className="text-[11px] font-semibold text-neutral-300 underline underline-offset-4 decoration-neutral-700 hover:text-neutral-100"
                  onClick={() => {
                    window.location.href = "/pricing";
                  }}
                >
                  View plans &amp; features
                </button>
              </div>

              <p className="mt-3 text-[11px] text-neutral-500">
                Secured by Stripe • Cancel anytime • Ready in minutes after
                signup
              </p>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3">
                <div className="relative overflow-hidden rounded-xl">
                  <div
                    className="aspect-video w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${Banner})` }}
                  />
                </div>
                <p className="mt-2 text-xs text-neutral-400">
                  One tap or scan → your branded page with bookings, requests,
                  and links ready to go.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3">
                <div className="relative overflow-hidden rounded-xl">
                  <div
                    className="aspect-video w-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80')",
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-neutral-400">
                  Track how guests and fans interact with your NFC, QR, and
                  profile — no guesswork.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingPage;
