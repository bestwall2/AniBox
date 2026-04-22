// components/ui/SearchInput.tsx

import { Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNums = e.target.value.replace(/\D/g, "");
    onChange(onlyNums); // 🔁 Call parent handler
  };

  const clearInput = () => {
    onChange(""); // 🔁 Clear in parent too
  };

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="flex items-center px-4 py-2">
        <Search className="text-muted-foreground mr-2" size={20} />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Type a number..."
          value={value}
          onChange={handleChange}
          className="w-full bg-transparent outline-none text-sm text-card-foreground placeholder-muted-foreground"
        />
        {value && (
          <button
            onClick={clearInput}
            className="ml-2 text-muted-foreground hover:text-red-500"
          >
            <X size={18} />
          </button>
        )}
      </CardContent>
    </Card>
  );
}