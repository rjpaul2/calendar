import { RefObject, useState, useRef } from "react";
import useEventListener from "./useEventListener";

type ScaleOpts = {
  direction: "up" | "down";
  interval: number;
};

export const ZoomLevel = {
  MONTH: 0,
  //WEEK: 1,
  DAY: 1
};
export const MIN_ZOOM = ZoomLevel.MONTH;
export const MAX_ZOOM = ZoomLevel.DAY;

export const MIN_SCALE = 0.5;
export const MAX_SCALE = 3;

/**
 * Listen for `wheel` events on the given element ref and update the reported
 * scale state, accordingly.
 */
export default function useScale(ref: RefObject<HTMLElement | null>) {
  const [obj, setObj] = useState({ scale: MIN_SCALE, zoom: ZoomLevel.MONTH }); // {scale, zoom}
  //const [zoom, setZoom] = useState(ZoomLevel.DAY) // Granularity: "MONTH", "WEEK", "DAY" TODO: put types in struct
  const pointedCell = useRef(0);
  const updateScale = ({ direction, interval }: ScaleOpts) => {
    setObj((curr) => {
      let scale: number;
      let zoom: number;

      // Adjust up to or down to the maximum or minimum scale levels by `interval`.
      if (direction === "down" && curr.scale + interval < MAX_SCALE) {
        scale = curr.scale + interval;
      } else if (direction === "down") {
        scale = MAX_SCALE;
      } else if (direction === "up" && curr.scale - interval > MIN_SCALE) {
        scale = curr.scale - interval;
      } else if (direction === "up") {
        scale = MIN_SCALE;
      } else {
        scale = curr.scale;
      }

      // Set granularity (zoom level)

      //console.log("curr zoom", curr.zoom);
      if (scale === MIN_SCALE && curr.zoom > MIN_ZOOM) {
        zoom = curr.zoom - 1;
        scale = MAX_SCALE;
      } else if (scale === MAX_SCALE && curr.zoom < MAX_ZOOM) {
        zoom = curr.zoom + 1;
        scale = MIN_SCALE;
      } else {
        zoom = curr.zoom;
      }

      return { scale, zoom };
    });
  };

  // Set up an event listener such that on `wheel`, we call `updateScale`.
  useEventListener(ref, "wheel", (e) => {
    e.preventDefault();

    pointedCell.current = Array.prototype.indexOf.call(
      e.target.parentElement.children,
      e.target
    );

    updateScale({
      direction: e.deltaY > 0 ? "up" : "down",
      interval: 0.05
    });
  });

  return [obj.scale, obj.zoom, pointedCell];
}
