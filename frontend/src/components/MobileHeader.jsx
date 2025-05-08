// src/components/MobileHeader.tsx
import MobileMenu from "./MobileMenu";

export default function MobileHeader() {
  return (
    <header className="flex items-center justify-end px-4 py-4 bg-[#F9E4CF]">
      <MobileMenu />
    </header>
  );
}
