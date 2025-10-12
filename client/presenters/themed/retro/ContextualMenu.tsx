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
  const {
    commitStatus,
    contextualAction,
    isFetchLoading,
    isPullLoading,
    isPushLoading,
    pull,
    push,
    refetch,
  } = useContextualMenu();

  return (
    <div className="h-full w-full flex">
      <Button
        className="flex h-full flex-col items-center justify-center px-3 py-1 text-xs"
        isActive={isFetchLoading}
        sound
        disabled={contextualAction !== "REFRESH"}
        onClick={refetch}
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
        isActive={isPullLoading}
        onClick={pull}
      >
        <span className={isPullLoading ? "rotating" : ""}>
          {isPullLoading ? (
            <HourglassRetroIcon size={22} color="#000" />
          ) : (
            <ArrowDownRetroIcon size={22} color="#000" />
          )}
        </span>
        {isPullLoading
          ? "Pulling"
          : contextualAction === "PULL"
            ? `Pull (${commitStatus?.remoteUnpulled})`
            : "Pull"}
      </Button>
      <Button
        className="flex h-full flex-col items-center justify-between px-3 py-1 text-xs"
        sound
        disabled={contextualAction !== "PUSH"}
        isActive={isPushLoading}
        onClick={push}
      >
        <span className={isPushLoading ? "rotating" : ""}>
          {isPushLoading ? (
            <HourglassRetroIcon size={22} color="#000" />
          ) : (
            <ArrowUpRetroIcon size={22} color="#000" />
          )}
        </span>
        {isPushLoading
          ? "Pushing"
          : contextualAction === "PUSH"
            ? `Push (${commitStatus?.localUnpushed})`
            : "Push"}
      </Button>
    </div>
  );
}
