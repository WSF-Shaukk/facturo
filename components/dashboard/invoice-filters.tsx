import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface InvoiceFiltersProps {
  onFilterChange: (filters: {
    search: string;
    startDate: string;
    endDate: string;
    minAmount: string;
    maxAmount: string;
  }) => void;
}

export function InvoiceFilters({ onFilterChange }: InvoiceFiltersProps) {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const handleSearch = () => {
    onFilterChange({ search, startDate, endDate, minAmount, maxAmount });
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    onFilterChange({
      search,
      startDate: start,
      endDate: end,
      minAmount,
      maxAmount,
    });
  };

  const handleAmountChange = (min: string, max: string) => {
    setMinAmount(min);
    setMaxAmount(max);
    onFilterChange({
      search,
      startDate,
      endDate,
      minAmount: min,
      maxAmount: max,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
    onFilterChange({
      search: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    });
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Search with Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by invoice number or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch} className="shrink-0">
          Search
        </Button>
      </div>

      {/* Date Range */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-1">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-1 block">
              From
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => handleDateChange(e.target.value, endDate)}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-1 block">
              To
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => handleDateChange(startDate, e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Amount Range */}
        <div className="flex gap-2 flex-1">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-1 block">
              Min Amount
            </label>
            <Input
              type="number"
              placeholder="0"
              value={minAmount}
              onChange={(e) => handleAmountChange(e.target.value, maxAmount)}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-1 block">
              Max Amount
            </label>
            <Input
              type="number"
              placeholder="0"
              value={maxAmount}
              onChange={(e) => handleAmountChange(minAmount, e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={clearFilters}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
