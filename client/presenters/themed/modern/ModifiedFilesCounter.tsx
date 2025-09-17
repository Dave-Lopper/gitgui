export default function ModernModifiedFilesCounter({
  count,
}: {
  count: number;
}) {
  return (
    <div className="font-modern bg-linear-to-b from-modern-dark-ter to-modern-dark-qua py-2 pl-2 text-left text-white">
      {count} Files modified
    </div>
  );
}
