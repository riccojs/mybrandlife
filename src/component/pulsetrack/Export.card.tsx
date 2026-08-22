import { Download, FileText } from "lucide-react";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa6";

export default function ExportCard({
  title,
  subtitle,
  handleDownload,
  duration,
  isLoading,
  disable,
}: {
  title: string;
  subtitle: string;
  handleDownload: (type: string, days: number) => void;
  duration: number;
  isLoading: boolean;
  disable: boolean;
}) {
  const [select, setSelect] = useState("");

  return (
    <div className="bg-white border border-[#E6E9EF] rounded-xl p-6 flex flex-col justify-between">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-[#EEF7E7] p-3 rounded-lg">
          <FileText className="w-4.5 h-4.5 text-[#8BC34A]" />
        </div>

        <div>
          <h3 className="text-[16px] font-semibold text-[#1F2937]">{title}</h3>
          <p className="text-[14px] text-[#6B7280]">{subtitle}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => {
            handleDownload("csv", duration);
            setSelect("CSV");
          }}
          disabled={disable}
          className="flex h-10.5 cursor-pointer bg-[#8BC34A] hover:bg-[#7CB342] text-white rounded-lg w-full items-center justify-center gap-2 text-[14px] font-medium"
        >
          {isLoading && select === "CSV" ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          Download CSV
        </button>

        <button
          onClick={() => {
            handleDownload("pdf", duration);
            setSelect("PDF");
          }}
          disabled={disable}
          className="h-10.5 cursor-pointer bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] rounded-lg flex w-full items-center justify-center gap-2 text-[14px] font-medium"
        >
          {isLoading && select === "PDF" ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FileText size={16} />
          )}
          Download PDF
        </button>
      </div>
    </div>
  );
}
