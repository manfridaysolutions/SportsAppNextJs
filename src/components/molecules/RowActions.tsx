import { SaveButton, CancelButton } from "../atoms/ActionButtons";

interface RowActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
}

export function RowActions({ 
  onSave, 
  onCancel, 
  isSaving, 
  saveLabel = "Save", 
  cancelLabel = "Cancel" 
}: RowActionsProps) {
  return (
    <div className="flex gap-2">
      <SaveButton onClick={onSave} disabled={isSaving}>
        {isSaving ? "Saving..." : saveLabel}
      </SaveButton>
      <CancelButton onClick={onCancel}>
        {cancelLabel}
      </CancelButton>
    </div>
  );
}