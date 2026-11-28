import type { ReactNode } from "react";

interface Props {
  title: string;
  description: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

function AuthShell({ title, description, children, footer }: Props) {
  return (
    <section className="relative isolate w-full overflow-hidden bg-linear-to-b from-[#F4F3FF] via-[#F8F8FF] to-white px-4 py-12 sm:px-6 md:py-20 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-10 size-120 rounded-full bg-[#ddd9ff]/60 blur-[100px]" />
        <div className="absolute -right-32 -top-20 size-120 rounded-full bg-[#e3e1ff]/70 blur-[110px]" />
        <div className="absolute bottom-0 left-1/2 h-100 w-full max-w-5xl -translate-x-1/2 rounded-full bg-[#f0efff] blur-[120px]" />
      </div>
      <div className="mx-auto w-full max-w-115">
        <div className="rounded-[22px] bg-white px-6 py-7 shadow-[0_15px_50px_rgba(0,0,0,0.08)] sm:px-10 sm:py-8">
          <div className="text-center">
            <h1 className="text-2xl font-medium leading-tight tracking-[-0.035em] text-[#171926] sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-5 text-[#171926]/55">{description}</p>
          </div>
          {children}
        </div>
        {footer && <div className="mt-8 text-center text-[13px]">{footer}</div>}
      </div>
    </section>
  );
}

export default AuthShell;
