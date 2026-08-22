import Logo from "../assets/spiner-logo.png";

function Spiner() {
  return (
    <div className="fixed inset-0 bg-[#F8F8F8] flex items-center justify-center z-50">
      <div className="relative w-32 h-32 min-w-32 flex items-center justify-center">
        <div className="absolute w-full h-full border-4 border-gray-200 border-t-[#5F1D14] rounded-full animate-spin"></div>
        <img src={Logo} alt="logo" className="w-full h-full object-contain" />
      </div>
    </div>
  );
}

export default Spiner;
