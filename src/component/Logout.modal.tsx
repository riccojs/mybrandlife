import { useEffect } from "react";

interface DataType {
  onLogout: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const LogoutModal = ({ onLogout, onCancel, isLoading }: DataType) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-0"></div>
      <div className="relative z-10 w-full max-w-[480px] bg-white dark:bg-slate-900 shadow-2xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 zoom-animation">
        <div className="py-10 bg-[#DBEDFB] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
          <div className="w-24 h-24 min-w-24 rounded-full shadow bg-white flex justify-center items-center">
            <i className="fa-solid fa-right-from-bracket text-4xl"></i>
          </div>
        </div>
        <div className="px-8 pt-8 pb-10 text-center">
          <h2 className="text-2xl font-medium text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
            Are you sure you want to log out?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-8">
            You will need to enter your credentials to access your account
            again. Any unsaved changes may be lost.
          </p>
          <div className="flex flex-col sm:flex-row-reverse gap-3">
            <button
              onClick={onLogout}
              className="flex-1 min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-12 bg-primary hover:bg-primary/90 text-black font-medium transition-all bg-[#FFAA00] shadow-md shadow-primary/20"
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch animate-spin"></i>
              ) : (
                <span className="truncate">Yes, Log Out</span>
              )}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-12 bg-[#EEF3F8] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium transition-all"
            >
              <span className="truncate">Cancel</span>
            </button>
          </div>
        </div>
        <div className="h-1 bg-primary/10 w-full">
          <div className="h-full bg-primary w-1/3 mx-auto rounded-full"></div>
        </div>
      </div>
      <div className="hidden">
        <img
          alt="background-placeholder"
          data-alt="Abstract blue geometric pattern background"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDp30agpU6ObeTC_Sot8e8VFh974VsYQzJU5RoMbDR7575WyBcmcpR0-dJVMGCYbY5Nfai4NOG08jEEdoXDoJg4FbKsFLrm-iMs7dGvrMFojwSeoJKEkI2FzjQxuawjLP4IjT-3Jf5MzaaC5kN9XxtQyD59qbT8t0UMw71-25uiQH7K_yISRErNTvLVjzFUfRZ1t8XYXp8TVqR5_AFSdKjbVdzk3zCcUBtQRo0HULQFjVWjb3qSZ6OvD8WAWCwxUreWBAUmsi4QRIA"
        />
      </div>
    </div>
  );
};

export default LogoutModal;
