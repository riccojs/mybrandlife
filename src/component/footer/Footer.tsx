function Footer() {
  return (
    <footer className="w-full h-16 px-10 flex justify-center items-center bg-white">
      <p className="text-gray-500 text-xs md:text-sm font-normal text-center">
        ©{new Date().getFullYear()} MyBrandLife.me. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
