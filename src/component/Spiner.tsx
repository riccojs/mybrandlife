import Logo from "../assets/spiner-logo.png";

function Spiner() {
  return (
    <div className="fixed inset-0 bg-[#F8F8F8] flex items-center justify-center z-50">
      <div className="relative w-16 sm:w-28 h-16 sm:h-28 min-w-16 sm:min-w-28 flex items-center justify-center">
        <div className="absolute w-full h-full border-4 border-gray-200 border-t-[#96c94b] rounded-full animate-spin"></div>
        <img src={Logo} alt="logo" className="w-full h-full object-contain" />
      </div>
    </div>
  );
}

export default Spiner;
