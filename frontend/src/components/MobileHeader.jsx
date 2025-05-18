import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";

export default function MobileHeader() {
  return (
    <header className="bg-[#F9E4CF] px-4 py-6 shadow-md">
      <div className="hidden md:flex justify-center">
        <DesktopMenu />
      </div>
      <div className="flex md:hidden justify-end items-center">
        <MobileMenu />
      </div>
    </header>
  );
}
