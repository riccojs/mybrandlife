import EnglishFlag from "../assets/english-flag.svg";

interface Types {
  isLang: boolean;
}

function HeaderLanguage({ isLang }: Types) {
  const currentLang = {
    en: "en",
    es: "es",
  };

  return (
    <div
      className={`absolute bg-white p-5 rounded-md shadow-sm border border-gray-100 md:w-60 w-[260px] top-10 right-[-80px] md:right-0 transition-all duration-200 ease-in-out transform ${
        isLang
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-90 -translate-y-4 pointer-events-none"
      }`}
    >
      <h2 className="text-[#2B7F75] text-md font-medium">Select Language</h2>
      <ul className="flex flex-col mt-2 gap-1">
        <li
          className={`flex gap-2 items-center cursor-pointer hover:bg-gray-100 p-2 rounded-md ${
            currentLang.es === "en" ? "bg-gray-100" : "bg-white"
          }`}
        >
          <img src={EnglishFlag} alt="English" className="w-4" />
          <p>English</p>
        </li>
      </ul>
    </div>
  );
}

export default HeaderLanguage;
