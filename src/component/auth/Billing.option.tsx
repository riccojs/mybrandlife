const BillingOption = ({
  selected,
  title,
  price,
  badge,
  onClick,
}: {
  selected: boolean;
  title: string;
  price: number;
  badge?: string;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative cursor-pointer flex h-12 w-full items-center rounded-xl border px-4 text-left transition ${
        selected
          ? "border-[#61b51a] bg-[#fbfff7] shadow-[0_0_0_1px_rgba(97,181,26,0.08)]"
          : "border-[#dce0e8] bg-white hover:border-[#b9c1cf]"
      }`}
    >
      <span
        className={`mr-4 flex h-4 w-4 items-center justify-center rounded-full border ${
          selected ? "border-[#61b51a]" : "border-[#8c94a4]"
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-[#61b51a]" />}
      </span>
      <span className="text-[14px] font-normal text-[#202941]">{title}</span>
      <span className="ml-1 text-[14px] font-bold text-[#202941]">
        (${price})
      </span>
      {badge && (
        <span className="ml-auto rounded-full bg-[#61b51a] px-2.5 py-1 text-[8px] font-bold uppercase tracking-wide text-white">
          {badge}
        </span>
      )}
    </button>
  );
};

export default BillingOption;
