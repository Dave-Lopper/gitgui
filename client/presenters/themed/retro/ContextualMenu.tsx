import { ThemedContextualMenuProps } from "../../headless/types";
import {
  ArrowDownRetroIcon,
  ArrowUpRetroIcon,
  HourglassRetroIcon,
  RefreshRetroIcon,
} from "../../../icons/retro";
import "./styles/Rotating.css";
import Button from "./Button";

export default function ContextualMenu({
  contextualAction,
  isFetchLoading,
  onActionClick,
  pullCount,
  pushCount,
}: ThemedContextualMenuProps) {
  return (
    <div className="h-full w-full">
      {/* <div
        className={`font-retro flex h-full flex-col items-center text-sm text-black ${isFetchLoading ? "" : "cursor-pointer"}`}
      > */}
      <Button
        className="flex h-full flex-col items-center justify-center px-3 py-1 text-xs"
        isActive={isFetchLoading}
        sound
        disabled={contextualAction !== "REFRESH"}
        onClick={async () => await onActionClick()}
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
      {/* </div> */}
    </div>
  );
}
