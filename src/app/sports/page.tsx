import { SportsTable } from "@/components/SportsTable";
import { apiGet } from "@/lib/api";
import { Sport } from "@/types/sport";

export default async function SportsPage() {
  const sports = await apiGet<Sport[]>("/api/v1/sports/");

  return (
    <div className="min-h-screen p-6 bg-background text-foreground transition-colors duration-300">
      <h1 className="text-2xl font-semibold mb-4 tracking-tight">
        Sports
      </h1>
      <SportsTable sports={sports} />
    </div>
  );
}