"use client";

import { useState, type SetStateAction } from "react";
import { useGetAllPartnerQuery } from "../redux/features/partner/partnerApi";
import SendPartneremail from "../component/Send.partneremail";
import Pagination from "../component/Pagination";
import { useSearchParams } from "react-router";
import type { PartnerType } from "../utils/partner.types";
import PartnerlistLoader from "../component/loader/Partnerlist.loader";

export default function PartnersPage() {
  const [openFormPartner, setOpenFormPartner] = useState(false);
  const [recipentMail, setRecipentMail] = useState<string[]>([]);
  const [partnerTitle, setPartnerTitle] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;

  const limit = 10;
  const { data, isLoading, isFetching } = useGetAllPartnerQuery({
    page: page,
    limit: limit,
    searchBy: search,
  });
  const totalItems = data?.data?.totalPartner || 0;
  const handlePageChange = (newPage: number) => {
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
  };

  let content;
  if (isLoading || isFetching) {
    content = (
      <>
        <PartnerlistLoader />
        <PartnerlistLoader />
        <PartnerlistLoader />
        <PartnerlistLoader />
        <PartnerlistLoader />
        <PartnerlistLoader />
      </>
    );
  }
  if (!isLoading && !isFetching && data?.data?.totalPartner === 0) {
    content = <p>Partner not found!</p>;
  }
  if (!isLoading && !isFetching && data?.data?.totalPartner > 0) {
    content = data?.data?.partner?.map((partner: PartnerType) => (
      <PartnerCard
        key={partner.id}
        partner={partner}
        setOpenFormPartner={setOpenFormPartner}
        setRecipentMail={setRecipentMail}
        setPartnerTitle={setPartnerTitle}
      />
    ));
  }

  return (
    <section className="bg-[#ffffff] flex flex-col">
      <div className="container min-h-screen">
        <div className="pt-5 md:pt-14">
          <header className="mb-5 md:mb-8">
            <h1 className="text-lg text-black font-medium tracking-tight md:text-3xl">
              Our awesome partners and affiliates!
            </h1>
            <p className="mt-2 text-sm md:text-base text-neutral-500 max-w-2xl">
              From our apps and domains to POS and more, let our partners become
              your partners. Click below.
            </p>
          </header>
          <div className="mb-5 flex gap-2 md:gap-5">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                searchParams.set("search", value);
                searchParams.set("page", "1");
                setSearchParams(searchParams);
              }}
              className="text-sm md:text-md font-normal text-black border border-gray-300 outline-none ring-0 rounded-lg w-full py-2 md:py-3 px-2 md:px-5 focus:border-[#96c94b] focus:ring focus:ring-[#96c94b]"
              placeholder="Searches the title, description, and keywords"
            />
            <button
              onClick={() => {
                searchParams.delete("search");
                searchParams.delete("page");
                setSearchParams(searchParams);
              }}
              className="flex cursor-pointer active:scale-[0.98] items-center gap-2 px-5 md:px-10 py-2 md:py-3 rounded-lg hover:bg-[#589c28] text-white text-sm md:text-md font-medium shadow-lg transition-all bg-[#65B32E] shadow-[#65B32E]/25"
            >
              Reset
            </button>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{content}</div>
        </div>
        <div className="flex justify-center w-full my-5">
          {totalItems > limit && (
            <Pagination
              handlePageChange={handlePageChange}
              page={page}
              totalItems={totalItems}
              itemsPerPage={limit}
            />
          )}
        </div>
      </div>

      {openFormPartner && (
        <PartnerFormModal
          onClose={() => setOpenFormPartner(false)}
          recipentMail={recipentMail}
          title={partnerTitle}
        />
      )}
    </section>
  );
}

function PartnerCard({
  partner,
  setOpenFormPartner,
  setRecipentMail,
  setPartnerTitle,
}: {
  partner: PartnerType;
  setOpenFormPartner: React.Dispatch<SetStateAction<boolean>>;
  setRecipentMail: React.Dispatch<SetStateAction<string[]>>;
  setPartnerTitle: React.Dispatch<SetStateAction<string>>;
}) {
  const {
    title,
    description,
    linkText,
    type,
    link,
    logo,
    recipent,
    recipentLabel,
  } = partner;

  const handleClick = () => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="flex md:flex-row flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm items-center">
      <div className="flex w-24 flex-none items-center justify-center">
        <div className="h-18 w-18 rounded-full flex items-center justify-center overflow-hidden">
          {logo ? (
            <img
              src={logo}
              alt={logo}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-xs text-neutral-400">Logo</span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center md:items-start gap-2 md:gap-1">
        <h2 className="text-center md:text-left text-md font-medium text-black md:text-lg">
          {title}
        </h2>
        <p className="text-sm text-neutral-500 md:text-base text-center md:text-left">
          {description}
        </p>
        {type === "LINKTYPE" ? (
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex ease-in-out duration-150 active:scale-105 items-center rounded-full border border-[#cf3832] py-2 md:py-3 px-6 text-xs font-semibold text-[#cf3832] hover:bg-[#cf37324a] cursor-pointer w-fit mt-2"
          >
            {linkText}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setOpenFormPartner(true);
              setRecipentMail(recipent);
              setPartnerTitle(title);
            }}
            className="inline-flex items-center ease-in-out duration-150 active:scale-105 rounded-full border border-[#cf3832] py-2 md:py-3 px-6 text-xs font-semibold text-[#cf3832] hover:bg-[#cf37324a] cursor-pointer w-fit mt-2"
          >
            {recipentLabel}
          </button>
        )}
      </div>
    </article>
  );
}

function PartnerFormModal({
  onClose,
  recipentMail,
  title,
}: {
  onClose: () => void;
  recipentMail: string[];
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-black">
              Become a Partner
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Tell us a bit about your business and how you'd like to partner
              with My Brand Life.
            </p>
          </div>
        </div>

        <SendPartneremail
          title={title}
          onClose={onClose}
          recipentMail={recipentMail}
        />
      </div>
    </div>
  );
}
