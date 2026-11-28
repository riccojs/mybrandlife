import type { ReactNode } from "react";

interface PageIntroProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
}

function PageIntro({ eyebrow, title, description, children }: PageIntroProps) {
  return (
    <section className="pt-14 pb-4">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2A65E9]/15 bg-[#2A65E9]/5 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-[#2A65E9]" />
          <span className="text-sm font-semibold text-[#2A65E9]">
            {eyebrow}
          </span>
        </div>
        <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-[#161B2B] sm:text-5xl md:text-[56px]">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#161B2B]/60 sm:text-lg sm:leading-8">
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}

export default PageIntro;
