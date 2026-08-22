const SummaryCard = ({
  icon,
  label,
  value,
  valueClassName = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) => {
  return (
    <div className="flex min-h-17 flex-1 items-center gap-4 rounded-xl border border-[#e5e8ed] bg-white px-5 shadow-[0_5px_18px_rgba(20,30,50,0.05)]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1f9e9] text-[#57a914]">
        {icon}
      </div>

      <div>
        <p className="text-[12px] font-semibold text-[#687083]">{label}</p>
        <p className={`mt-0.5 text-[14px] font-bold ${valueClassName}`}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default SummaryCard;
