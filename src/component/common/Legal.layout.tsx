export interface LegalSection {
  title: string;
  body: string[];
}

interface LegalLayoutProps {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

function LegalLayout({ title, updated, intro, sections }: LegalLayoutProps) {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2A65E9]">
          Legal
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-[#161B2B]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[#161B2B]/50">Last updated: {updated}</p>

        <div className="mt-6 rounded-xl border border-[#F59E0B]/30 bg-[#FFF8EB] px-4 py-3 text-xs leading-5 text-[#8A5A00]">
          Draft content — pending legal review before launch.
        </div>

        <p className="mt-8 text-base leading-7 text-[#161B2B]/70">{intro}</p>

        <nav className="mt-8 rounded-2xl border border-[#161B2B]/8 bg-[#F8FAFF] p-5">
          <p className="text-sm font-semibold text-[#161B2B]">On this page</p>
          <ol className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {sections.map((section, index) => (
              <li key={section.title}>
                <a
                  href={`#section-${index + 1}`}
                  className="text-sm text-[#2A65E9] hover:underline"
                >
                  {index + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 space-y-10">
          {sections.map((section, index) => (
            <article
              key={section.title}
              id={`section-${index + 1}`}
              className="scroll-mt-28"
            >
              <h2 className="text-xl font-semibold text-[#161B2B]">
                {index + 1}. {section.title}
              </h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[15px] leading-7 text-[#161B2B]/70"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LegalLayout;
