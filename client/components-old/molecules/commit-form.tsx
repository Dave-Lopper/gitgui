import { Button } from "../atoms";

export default function CommitForm({
  commit,
}: {
  commit: (name: string, description?: string) => void;
}) {
  return (
    <div className="flex-col border-t-1 border-white p-4">
      <input
        type="text"
        name="commitName"
        className="m-4 mt-2 h-8 w-9/10 rounded-sm border-1 border-white p-2"
        placeholder="Commit name"
      />
      <textarea
        name="commitDescription"
        className="mb-4 w-9/10 rounded-sm border-1 border-white p-2"
        placeholder="Commit description"
      />
      <Button onClick={() => commit("")}>Commit</Button>
    </div>
  );
}
