import { ComponentType, useState } from "react";

import { useEventSubscription } from "../../infra/react-bus-helper";

export default function RetroModifiedFilesCounter({
  counter: Counter,
}: {
  counter: ComponentType<{ count: number }>;
}) {
  const [fileCount, setFileCount] = useState(0);

  useEventSubscription(
    "RepositorySelected",
    (event) => setFileCount(event.payload.diff.length || 0),
    [],
  );

  return <Counter count={fileCount} />;
}
