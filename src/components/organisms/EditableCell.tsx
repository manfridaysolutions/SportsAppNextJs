interface EditableCellProps {
  isEditing: boolean;
  value: any;
  renderInput: () => React.ReactNode;
  renderDisplay?: (val: any) => React.ReactNode;
}

export function EditableCell({ 
  isEditing, 
  value, 
  renderInput, 
  renderDisplay 
}: EditableCellProps) {
  return (
    <div className="flex items-center h-9 min-w-[100px]">
      {isEditing ? (
        renderInput()
      ) : (
        /* If renderDisplay exists (like for our Link), we let it handle its own layout */
        <div className="text-sm truncate w-full">
          {renderDisplay ? (
            renderDisplay(value)
          ) : (
            value ?? <span className="text-muted-foreground italic">None</span>
          )}
        </div>
      )}
    </div>
  );
}