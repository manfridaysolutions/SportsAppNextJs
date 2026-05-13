"use client";

import React from "react";
import Link from "next/link";
import { FieldDef } from "./FieldDef";

interface HyperlinkCellProps<T> {
  item: T;
  field: FieldDef;
  className?: string;
}

export function HyperlinkCell<T extends Record<string, any>>({
  item,
  field,
  className = "text-blue-600 hover:underline font-medium",
}: HyperlinkCellProps<T>) {
  const value = item[field.key];
  const options = field.linkOptions;

  if (!options) {
    return <span>{value}</span>;
  }

  const { baseUrl, params, target = "_self", displayText } = options;

  // 1. Build the query string dynamically
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([urlKey, dataKey]) => {
      // 1. Try to get value from the item (e.g., item["team_id"])
      let dataValue = item[dataKey];

      // 2. If no value found on item, treat dataKey as the literal value (e.g., "2")
      if (dataValue === undefined || dataValue === null) {
        dataValue = dataKey;
      }

      if (dataValue !== undefined && dataValue !== null) {
        queryParams.append(urlKey, dataValue.toString());
      }
    });
  }

  const queryString = queryParams.toString();
  const finalHref = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  // 2. Determine display text: Static Override > Database Value > Fallback
  const content = displayText || value || "View";

  return (
    <Link
      href={finalHref}
      target={target}
      className={className}
      onClick={(e) => e.stopPropagation()}
    >
      {content}
    </Link>
  );
}