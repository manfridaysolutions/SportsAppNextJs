import { ChevronLeft, ChevronRight } from "lucide-react"; // Or similar icon library

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  initialItemsPerPage: number;
  totalItems: number;
  startIndex: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  pageSizeOptions?: number[];
  showRowsPerPage?: boolean; // New prop
}

export function TablePagination({
  currentPage,
  totalPages,
  itemsPerPage,
  initialItemsPerPage,
  totalItems,
  startIndex, // Ensure this is passed from the hook
  onPageChange,
  onLimitChange,
  showRowsPerPage = true,
}: PaginationProps) {

  if (totalItems <= initialItemsPerPage) return null;

  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
<div className="flex items-center gap-2 text-muted-foreground">
      
      {/* 1. Navigation & Range (Now Primary) */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-0.5 hover:bg-muted hover:text-foreground rounded transition-all disabled:opacity-20"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="text-[11px] font-medium whitespace-nowrap px-1">
          <span className="text-foreground">{startIndex + 1}–{endIndex}</span>
          <span className="mx-1 opacity-50">of</span>
          <span className="text-foreground">{totalItems}</span>
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-0.5 hover:bg-muted hover:text-foreground rounded transition-all disabled:opacity-20"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* 2. Rows Selector (Now Secondary with Left Border) */}
      {showRowsPerPage && (
        <div className="flex items-center gap-1.5 ml-0.5 pl-2 h-4 border-l border-muted-foreground/20">
          <span className="text-[10px] uppercase tracking-tighter font-bold opacity-70">Rows</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-transparent text-[11px] font-semibold focus:outline-none cursor-pointer hover:text-foreground transition-colors appearance-none"
          >
            {[10, 20, 50].map((opt) => (
              <option key={opt} value={opt} className="bg-popover text-foreground">
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}