"use client";

import React from "react";

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  label?: string
  className?: string;
}

export const EditButton = ({ onClick, children = "Edit" }: ActionButtonProps) => (
  <button
    onClick={onClick}
    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
  >
    {children}
  </button>
);

export const AddButton = ({ onClick, disabled, children, label, className }: ActionButtonProps & { label?: string }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium shadow-sm ${className || "mb-4 px-4 py-2"}`}
  >
    <span className="text-lg leading-none font-bold">+</span>
    {/* Use children if provided, otherwise fallback to label, otherwise fallback to 'Add New' */}
    {children || label || "Add New"}
  </button>
);

export const SaveButton = ({ onClick, disabled, children = "Save" }: ActionButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors font-medium shadow-sm"
  >
    {children}
  </button>
);

export const CancelButton = ({ onClick, children = "Cancel" }: ActionButtonProps) => (
  <button
    onClick={onClick}
    className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors font-medium shadow-sm"
  >
    {children}
  </button>
);