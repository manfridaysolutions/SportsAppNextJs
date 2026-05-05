interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative group ${className}`}>
      {/* MODIFIED ICON LOGIC: 
         Only render/show the icon if value is empty.
      */}
      {!value && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none transition-opacity duration-200">
          🔍
        </span>
      )}
      
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full h-8 text-xs border rounded-md bg-background outline-none transition-all
          ${value ? 'pl-3' : 'pl-8'} // Shift text left when icon disappears
        `}
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}