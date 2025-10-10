import {
  ArrowDownRetroIcon,
  ArrowUpRetroIcon,
  HourglassRetroIcon,
  RefreshRetroIcon,
} from "../../../icons/retro";
import { useContextualMenu } from "../../headless/hooks/contextual-menu";
import { ThemedContextualMenuProps } from "../../headless/types";
import Button from "./Button";
import "./styles/Rotating.css";

export default function ContextualMenu() {
  const { onActionClick, commitStatus, contextualAction, isFetchLoading } =
    useContextualMenu();

  return (
    <div className="h-full w-full flex">
      <Button
        className="flex h-full flex-col items-center justify-center px-3 py-1 text-xs"
        isActive={isFetchLoading}
        sound
        disabled={contextualAction !== "REFRESH"}
        onClick={async () =>
          contextualAction === "REFRESH" && (await onActionClick())
        }
      >
        <span className={isFetchLoading ? "rotating" : ""}>
          {isFetchLoading ? (
            <HourglassRetroIcon size={22} color="#000" />
          ) : (
            <RefreshRetroIcon size={22} color="#000" />
          )}
        </span>
        {isFetchLoading ? "Fetching" : "Fetch"}
      </Button>
      <Button
        className="flex h-full flex-col items-center justify-between px-3 py-1 text-xs"
        sound
        disabled={contextualAction !== "PULL"}
        isActive={isFetchLoading}
        onClick={async () =>
          contextualAction === "PULL" && (await onActionClick())
        }
      >
        <ArrowDownRetroIcon size={22} color="#000" />
        Pull{" "}
        {contextualAction === "PULL" && `(${commitStatus?.remoteUnpulled})`}
      </Button>
      <Button
        className="flex h-full flex-col items-center justify-between px-3 py-1 text-xs"
        sound
        disabled={contextualAction !== "PUSH"}
        isActive={isFetchLoading}
        onClick={async () =>
          contextualAction === "PUSH" && (await onActionClick())
        }
      >
        <ArrowUpRetroIcon size={22} color="#000" />
        Push {contextualAction === "PUSH" && `(${commitStatus?.localUnpushed})`}
      </Button>
    </div>
  );
}
