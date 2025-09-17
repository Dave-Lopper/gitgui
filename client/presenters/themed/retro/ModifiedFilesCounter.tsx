export default function RetroModifiedFilesCounter({
  count,
}: {
  count: number;
}) {
  return <div className="font-retro text-white bg-retro-active py-1 text-left pl-2">{count} Files modified</div>;
}
