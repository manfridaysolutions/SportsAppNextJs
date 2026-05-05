import { TableHead } from "../ui/table";

interface TableSortHeaderProps {
  label: string;
  sortKey: string;
  sortConfigs: { key: string; order: "asc" | "desc" }[];
  onSort: (key: string, multi: boolean) => void;
  className?: string;
}

export function TableSortHeader({
  label,
  sortKey,
  sortConfigs,
  onSort,
  className = "",
}: TableSortHeaderProps) {
  const sortIndex = sortConfigs.findIndex((s) => s.key === sortKey);
  const currentSort = sortConfigs[sortIndex];

  return (
    <TableHead
      onClick={(e) => onSort(sortKey, e.shiftKey)}
      className={`cursor-pointer select-none hover:bg-muted/50 transition-colors group ${className}`}
    >
      <div className="flex items-center gap-1.5">
        {/* Removed uppercase and tracking-wider */}
        <span className="font-semibold text-xs text-foreground/80 group-hover:text-foreground">
          {label}
        </span>
        
        {currentSort && (
          <div className="flex items-center text-[10px] font-mono text-primary animate-in fade-in zoom-in duration-200">
            <span>{currentSort.order === "asc" ? "↑" : "↓"}</span>
            {sortConfigs.length > 1 && (
              <span className="ml-0.5 bg-primary text-primary-foreground px-1 rounded-[2px] leading-tight scale-90">
                {sortIndex + 1}
              </span>
            )}
          </div>
        )}
      </div>
    </TableHead>
  );
}