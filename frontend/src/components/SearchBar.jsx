import { Input } from "../components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch }) {
  return (
    <div className="relative w-full max-w-xl mx-auto px-4">
      <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <Input
        placeholder="Buscar productos..."
        className="pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-white text-sm w-full"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
