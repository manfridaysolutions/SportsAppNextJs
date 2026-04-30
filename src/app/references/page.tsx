"use client";

import { apiGet } from "@/lib/api";
import { ReferenceValue } from "@/types/referencevalue";
import { ReferenceCategory } from "@/types/referencecategory";
import { useState, useEffect, useCallback } from "react";

export default function ReferencesPage() {
    const [referenccategories_get, setReferenceCategory] = useState<ReferenceCategory[]>([]);
    const [referencevalues_get, setReferenceValue] = useState<ReferenceValue[]>([]);

      // --- REFRESH LOGIC FOR REFERENCE CATEGORIES ---
      const fetchReferenceCategories = async () => {
        try {
          const referenceCategoriesData = await apiGet<ReferenceCategory[]>("/api/v1/reference-category/");
          setReferenceCategory(referenceCategoriesData);
        } catch (error) {
          console.error("Failed to refresh sports:", error);
        }
      };
    

}
