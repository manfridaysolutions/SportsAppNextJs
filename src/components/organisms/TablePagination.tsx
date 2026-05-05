import { ChevronLeft, ChevronRight } from "lucide-react"; // Or similar icon library

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
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
  totalItems,
  startIndex, // Ensure this is passed from the hook
  onPageChange,
  onLimitChange,
  showRowsPerPage = true,
}: PaginationProps) {
  
  if (totalItems <= itemsPerPage) return null;

  // Calculate the end of the current range
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="flex items-center gap-4 text-muted-foreground">
      {/* 1. Condensed Info Range: "1-10 of 13" */}
      <div className="text-[11px] font-medium whitespace-nowrap">
        <span className="text-foreground">{startIndex + 1}-{endIndex}</span>
        <span className="mx-1">of</span>
        <span className="text-foreground">{totalItems}</span>
      </div>

      {/* 2. Rows Selector (Optional) */}
      {showRowsPerPage && (
        <div className="flex items-center gap-1 border-l pl-4 h-4 border-muted-foreground/30">
          <span className="text-[10px] uppercase tracking-tighter font-bold">Rows</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer hover:text-foreground transition-colors"
          >
            {[10, 20, 50].map((opt) => (
              <option key={opt} value={opt} className="bg-background">{opt}</option>
            ))}
          </select>
        </div>
      )}

      {/* 3. Navigation Icons */}
      <div className="flex items-center gap-0.5 border-l pl-3 h-4 border-muted-foreground/30">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 hover:bg-muted rounded-md disabled:opacity-20 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 hover:bg-muted rounded-md disabled:opacity-20 transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}