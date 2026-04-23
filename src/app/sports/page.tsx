import { SportsTable } from "@/components/SportsTable";
import { apiGet } from "@/lib/api";
import { Sport } from "@/types/sport";

export default async function SportsPage() {
  const sports = await apiGet<Sport[]>("/api/v1/sports/");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Sports</h1>
      <SportsTable sports={sports} />
    </div>
  );
}