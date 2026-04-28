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
  // Using a fixed height (h-9 is standard shadcn input height) 
  // ensures the row height remains constant between modes.
  return (
    <div className="flex items-center h-9 min-w-[100px]">
      {isEditing ? (
        renderInput()
      ) : (
        <span className="text-sm truncate">
          {renderDisplay ? renderDisplay(value) : (value ?? <span className="text-muted-foreground italic">None</span>)}
        </span>
      )}
    </div>
  );
}