import React from "react";

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const SaveButton = ({ onClick, disabled, children }: ActionButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
  >
    {children}
  </button>
);

export const CancelButton = ({ onClick, children }: ActionButtonProps) => (
  <button
    onClick={onClick}
    className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
  >
    {children}
  </button>
);