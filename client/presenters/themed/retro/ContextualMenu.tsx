import {
  ArrowDownRetroIcon,
  ArrowUpRetroIcon,
  HourglassRetroIcon,
  RefreshRetroIcon,
} from "../../../icons/retro";
import { useRepositorySelection } from "../../headless";
import { useContextualMenu } from "../../headless/hooks/contextual-menu";
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
  const { repositorySelection } = useRepositorySelection();

  if (!repositorySelection) {
    return (
      <div className="h-full w-full flex border-[2px] border-b-white border-l-0 border-r-0"></div>
    );
  }

  return (
    <div className="h-full w-full flex">
      <Button
        className="flex h-full flex-col items-center justify-center px-3 py-1 text-xs w-1/3"
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
        className="flex h-full flex-col items-center justify-between px-3 py-1 text-xs w-1/3"
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
        className="flex h-full flex-col items-center justify-between px-3 py-1 text-xs w-1/3"
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
