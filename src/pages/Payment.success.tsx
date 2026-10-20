import { Link, useParams } from "react-router";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import {
  Check,
  ArrowRight,
  House,
  FileText,
  Eye,
  CalendarCheck2,
  LifeBuoy,
  Receipt,
} from "lucide-react";
import { useGetOneEchoByIdQuery } from "../redux/features/echo/echoApi";

function PaymentSuccess() {
  const params = useParams();
  const id = params.id;
  const name = params.name;
  const { data } = useGetOneEchoByIdQuery(id);

  useEffect(() => {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { x: 0.6, y: 0.6 },
      colors: ["#ff0a54", "#ff477e", "#ff85a1", "#fbb1bd", "#f9bec7"],
    });
    const interval = setInterval(() => {
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 500);
    setTimeout(() => clearInterval(interval), 1500);
  }, []);

  const { transactionId, create_at, tip } = data?.echo || {};

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#fbfdfb] px-4 py-6 text-slate-800 sm:px-8 sm:py-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-36 -z-10 h-96 w-96 rounded-full bg-[#eef9ef]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-64 -left-36 -z-10 h-136 w-136 rounded-full bg-linear-to-tr from-[#e5f8e9] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 right-[8%] hidden h-36 w-36 rounded-full border border-green-100 sm:block"
      />
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center pb-8 pt-10 sm:pt-16">
        <div className="w-full rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_24px_80px_rgba(31,93,56,0.10)] backdrop-blur sm:p-10 md:p-12">
          <div className="relative mx-auto mb-7 grid h-28 w-28 place-items-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-green-100"
            />
            <div
              aria-hidden="true"
              className="absolute inset-2 rounded-full bg-green-600 shadow-lg shadow-green-200"
            />
            <Check
              className="relative text-white"
              size={48}
              strokeWidth={3.5}
            />
            <span
              aria-hidden="true"
              className="absolute -right-3 top-3 h-3 w-3 rotate-45 rounded-sm bg-lime-300"
            />
            <span
              aria-hidden="true"
              className="absolute -left-4 top-7 h-2.5 w-5 -rotate-12 rounded-full bg-green-300"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-2 h-2.5 w-2.5 rotate-45 rounded-sm bg-emerald-300"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-2 right-4 h-2 w-4 rotate-45 rounded-full bg-lime-300"
            />
          </div>

          <div className="text-center">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Transaction complete
            </p>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Payment <span className="text-green-600">Successful!</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
              Thank you for your payment. Your order has been processed
              successfully.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-[#f2faf4] p-5 sm:p-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-green-100 text-green-700">
                <FileText size={23} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">
                  Transaction ID
                </p>
                <p className="mt-1 break-all text-xs md:text-sm font-bold text-slate-800">
                  {transactionId}
                </p>
              </div>
            </div>
            <div className="hidden h-px w-full bg-green-200 sm:block" />
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-green-100 text-green-700">
                <CalendarCheck2 size={23} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">Order Date</p>
                <p className="mt-1 break-all text-sm font-bold text-slate-800">
                  {formattedDate(create_at)}
                </p>
              </div>
            </div>
            <div className="hidden h-px w-full bg-green-200 sm:block" />
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-green-100 text-green-700">
                <Receipt size={23} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">Tip Amount</p>
                <p className="mt-1 break-all text-sm font-bold text-slate-800">
                  ${tip}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex gap-3 rounded-2xl border border-green-100 bg-linear-to-r from-green-50 to-white p-4 sm:p-5">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-green-600 text-white">
              <Check size={17} strokeWidth={3} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-800 sm:text-base">
                You're all set!
              </h2>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                Your payment is confirmed. You can continue to your account and
                explore your MyBrandLife features.
              </p>
            </div>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <a
              href="https://mybrandlife.me/"
              className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-100 transition hover:bg-green-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-green-700"
            >
              <House size={18} />
              My Brand Life
              <ArrowRight
                className="transition-transform group-hover:translate-x-1"
                size={17}
              />
            </a>
            <Link
              to={`/${name}`}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-5 py-3 text-sm font-bold text-green-800 transition hover:border-green-400 hover:bg-green-50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-green-700"
            >
              <Eye size={18} />
              Back to Lander
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500">
            <LifeBuoy size={17} className="text-green-600" />
            Need help?
            <a
              className="font-semibold text-green-700 underline decoration-green-300 underline-offset-4 hover:text-green-800"
              href=""
            >
              Contact our support team
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PaymentSuccess;
