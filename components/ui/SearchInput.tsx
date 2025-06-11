import { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchInput() {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const onlyNums = e.target.value.replace(/\D/g, "");
    setValue(onlyNums);
  };

  const clearInput = () => {
    setValue("");
  };

  return (
    <div className="flex items-center w-full max-w-sm px-4 py-2 bg-white border rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
      <Search className="text-gray-400 mr-2" size={20} />
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Search by number..."
        value={value}
        onChange={handleChange}
        className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
      />
      {value && (
        <button onClick={clearInput} className="ml-2 text-gray-400 hover:text-red-500">
          <X size={18} />
        </button>
      )}
    </div>
  );
}