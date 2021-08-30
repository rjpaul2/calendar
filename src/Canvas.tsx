import {
  useLayoutEffect,
  useRef,
  useState,
  createContext,
  PropsWithChildren,
  Children,
  useEffect
} from "react";

import usePan from "./usePan";
import useScale, { MAX_SCALE, MIN_SCALE, ZoomLevel } from "./useScale";
import useMousePos from "./useMousePos";

type Point = {
  x: number;
  y: number;
};
export type CanvasState = {
  offset: Point;
  scale: number;
  zoom: number;
  buffer: Point;
};

export const MAX_WIDTH = 1400;
export const ROW_HEIGHT = 140;
//const MAX_CELLS = 24; //TODO: make variable for day, month, etc
const ORIGIN = 0;
export const CanvasContext = createContext<CanvasState>({} as any);

export default function CanvasProvider(props: PropsWithChildren<unknown>) {
  const [buffer, setBuffer] = useState(ORIGIN);

  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, startPan] = usePan();
  // scale of the zoom level, zoom level, and cell pointed on wheel event
  const [scale, zoom, pointedCell] = useScale(ref);
  const lastPointedCell = useLast(pointedCell.current);

  // Track the mouse position relative to viewport
  const mousePosRef = useMousePos(ref);

  // Track the last known offset and scale.
  const lastOffset = useLast(offset);
  const lastScale = useLast(scale);

  // Track the day or month that's shown on the screen (default to current)
  const [displayed, setDisplayed] = useState(new Date());

  // Calculate the delta between the current and last offset—how far the user has panned.
  var delta = 0;
  if (lastOffset !== undefined) {
    delta = offset.x - lastOffset.x;
  }

  const adjustedOffset = useRef(offset.x + delta);

  const rightBound = useRef(ORIGIN);
  var maxBound = useRef(0);
  if (rightBound.current > maxBound.current) {
    maxBound.current = rightBound.current;
  }

  // console.log("scale: ", scale);
  // console.log("zoom: ", zoom);
  // console.log("mouse pos: ", mousePosRef.current);
  // // console.log("delta: ", delta);
  // console.log("offset: ", offset);
  // console.log("adjustedOffset: ", adjustedOffset.current);
  // //console.log("lastadjustedOffset: ", lastAdjustedOffset);
  // console.log("rightBound: ", rightBound.current);
  // console.log("pointedCell: ", pointedCell.current);
  // //var lastAdjustedOffset = adjustedOffset.current

  //useEffect(()=>{
  if (lastScale === scale) {
    // No change in scale—just apply the delta between the last and new offset to the adjusted offset.
    if (isNaN(adjustedOffset.current)) adjustedOffset.current = 0; // TODO: might not need
    var res = adjustedOffset.current + fscale(delta, scale);

    // Determine boundaries
    if (res < 0) res = ORIGIN;
    if (res > rightBound.current) res = rightBound.current;
    adjustedOffset.current = res;
  } else {
    // The scale has changed-adjust the offset to compensate for the change in elative position of the pointer to the canvas.
    const lastMouse = fscale(mousePosRef.current.x, lastScale);
    const newMouse = fscale(mousePosRef.current.x, scale);
    const mouseOffset = lastMouse - newMouse;
    adjustedOffset.current = adjustedOffset.current + mouseOffset;

    //Determine max
    const mouseOffsetMax =
      fscale(MAX_WIDTH, lastScale) - fscale(MAX_WIDTH, scale);
    rightBound.current = rightBound.current + mouseOffsetMax;
    //Restart boundary state
    if (scale === MIN_SCALE) rightBound.current = 0;
  }

  useEffect(() => {
    let day, loc, days;
    switch (zoom) {
      case ZoomLevel.DAY:
        day = lastPointedCell + 1;
        let date = new Date(displayed.setDate(day));
        //Change day value on displayed view
        setDisplayed(date);
        break;
      case ZoomLevel.MONTH:
        day = displayed.getDate();
        var daysInMonth = new Date(
          displayed.getFullYear(),
          displayed.getMonth() + 1,
          0
        ).getDate();
        console.log(maxBound);
        var maxWidthCell =
          (maxBound.current + MAX_WIDTH / MAX_SCALE) / daysInMonth;
        // cell * width of cells, centered to the mouse mosition, centered to center of cell
        let newPos =
          (day - 1) * maxWidthCell -
          mousePosRef.current.x / MAX_SCALE +
          maxWidthCell / 2;
        adjustedOffset.current = newPos;
        break;
    }
  }, [zoom]);

  useLayoutEffect(() => {
    // buffer is used for the case of infinite grid. We don't need it if we're using confined ranges
    const height = ref.current?.clientHeight ?? 0;
    const width = ref.current?.clientWidth ?? 0;

    setBuffer({
      x: (width - width / scale) / 2,
      y: (height - height / scale) / 2
    });
  }, [scale, setBuffer]);

  // Functions used by toggles

  return (
    <CanvasContext.Provider
      value={{
        offset: adjustedOffset.current, // offset from left edge
        scale, // scale between each zoom level
        zoom, // zoom level (e.g. month, day)
        buffer, // used for infinite grid (can remove)
        displayed, // current date
        setDisplayed
      }}
    >
      <div
        ref={ref}
        onMouseDown={startPan}
        style={{
          position: "relative",
          height: ROW_HEIGHT * Children.count(props.children),
          width: MAX_WIDTH,
          margin: 40
          //backgroundColor: "rgba(39, 39, 42)"
        }}
      >
        {props.children}
      </div>
    </CanvasContext.Provider>
  );
}

//Helpers
function fscale(point, scale) {
  return point / (2 * scale);
}

function useLast(value) {
  // Get last known value
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
