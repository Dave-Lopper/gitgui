import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";

type UseSplitPaneProps = {
  initialSplitPercentage: number;
  minPercentage: number;
};

export function useSplitPane({
  initialSplitPercentage,
  minPercentage,
}: UseSplitPaneProps) {
  const [splitPercentage, setSplitPercentage] = useState(
    initialSplitPercentage,
  );
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;

      const newPercentage = (mouseX / containerWidth) * 100;
      const clampedPercentage = Math.min(
        Math.max(newPercentage, minPercentage),
        100 - minPercentage,
      );

      setSplitPercentage(clampedPercentage);
    },
    [isDragging, minPercentage],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.userSelect = "";
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    splitPercentage,
    isDragging,
    containerRef,
    handleMouseDown,
    setSplitPercentage,
  };
}
