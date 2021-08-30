import { MouseEvent, RefObject, useEffect, useRef, useCallback } from "react";
import useEventListener from "./useEventListener";
const ORIGIN = Object.freeze({ x: 0, y: 0 });

export default function useMousePos(ref: RefObject<HTMLElement | null>) {
  const mousePosRef = useRef(ORIGIN);
  var offsetX = useRef(false);

  useEventListener(ref, "mousemove", (e) => {
    if (offsetX.current === false) {
      // Only runs once
      // Factor in margin and set as a constant offset (NOTE: there might be a bug here, might need to manually set the margin offset)

      var rect = e.target.parentElement.firstChild.getBoundingClientRect();
      offsetX.current = rect.left;
      //offsetY = rect.top;
    }
    mousePosRef.current = { x: e.pageX - offsetX.current, y: e.pageY - 0 };
  });
  return mousePosRef;
}
