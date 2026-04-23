import { Sport } from "@/types/sport";

export function SportsList({ sports }: { sports: Sport[] }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Sports</h2>

      <table className="min-w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border-b text-left">ID</th>
            <th className="p-2 border-b text-left">Name</th>
            <th className="p-2 border-b text-left">Category</th>
            <th className="p-2 border-b text-left">Team Sport</th>
            <th className="p-2 border-b text-left">Governing Body</th>
            <th className="p-2 border-b text-left">Description</th>
          </tr>
        </thead>

        <tbody>
          {sports.map((sport) => (
            <tr key={sport.sport_id} className="hover:bg-gray-50">
              <td className="p-2 border-b">{sport.sport_id}</td>
              <td className="p-2 border-b">{sport.sport_name}</td>
              <td className="p-2 border-b">{sport.category_id}</td>
              <td className="p-2 border-b">
                {sport.is_team_sport ? "Yes" : "No"}
              </td>
              <td className="p-2 border-b">{sport.governing_body}</td>
              <td className="p-2 border-b">{sport.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
