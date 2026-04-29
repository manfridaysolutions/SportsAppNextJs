import { SaveButton, CancelButton } from "../atoms/ActionButtons";

interface EditableRowActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
}

export function EditableRowActions({ 
  onSave, 
  onCancel, 
  isSaving, 
  saveLabel = "Save", 
  cancelLabel = "Cancel" 
}: EditableRowActionsProps) {
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