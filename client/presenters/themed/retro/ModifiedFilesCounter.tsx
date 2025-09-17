export default function RetroModifiedFilesCounter({
  count,
}: {
  count: number;
}) {
  return (
    <div className="font-retro bg-retro border-b-2 border-b-[#404040] py-1 pl-2 text-left text-black">
      {count} Files modified
    </div>
  );
}
