export default function ModernModifiedFilesCounter({
  count,
}: {
  count: number;
}) {
  return (
    <div className="font-modern bg-linear-to-b from-modern-dark-sec to-modern-dark-ter py-2 pl-2 text-left text-white border-b border-b-modern-dark-border">
      {count} Files modified
    </div>
  );
}
