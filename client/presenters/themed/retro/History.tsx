import { NextRetroIcon, PrevRetroIcon } from "../../../icons/retro";
import { useHistoryPagination } from "../../headless/hooks/history-pagination";
import { truncateString } from "../../utils";
import Button from "./Button";

export default function History() {
  const {
    currentPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    history,
    totalPages,
  } = useHistoryPagination(30);

  return (
    <div className="flex flex-col min-h-0">
      <div className="flex flex-col w-full bg-white overflow-auto retro-scrollbar min-h-0">
        {history?.map((commit, index) => (
          <div
            className={`cursor-pointer flex justify-between font-retro text-black text-md border-black w-full px-2 py-1 ${index < history.length - 1 && "border-b-1"} hover:bg-retro-active hover:text-white`}
            key={commit.shortHash}
          >
            <div className="flex flex-col items-start ">
              {commit.shortHash}: {truncateString(commit.subject, 30)}
            </div>
            <div>{commit.authorEmail}</div>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-between h-[28px] items-center bg-retro text-black font-retro retro-borders border-t-[2px] py-1">
        <Button
          isActive={false}
          disabled={!hasPreviousPage}
          onClick={fetchPreviousPage}
        >
          <PrevRetroIcon size={26} color="#000" />
        </Button>
        Page {currentPage} / {totalPages}
        <Button
          isActive={false}
          onClick={fetchNextPage}
          disabled={!hasNextPage}
        >
          <NextRetroIcon size={26} color="#000" />
        </Button>
      </div>
    </div>
  );
}
