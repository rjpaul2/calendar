import { useContext, useCallback } from "react";
import { CanvasContext } from "./Canvas";
import { ChevronRight, ChevronLeft } from "@material-ui/icons";
import { ZoomLevel } from "./useScale";
const Select = () => {
  var { displayed, setDisplayed, zoom } = useContext(CanvasContext);
  const increment = () => {
    switch (zoom) {
      case ZoomLevel.MONTH:
        setDisplayed(new Date(displayed.setMonth(displayed.getMonth() + 1)));
        break;
      case ZoomLevel.DAY:
        setDisplayed(new Date(displayed.setDate(displayed.getDate() + 1)));
        break;
      default:
        console.error("invalid zoom");
    }
  };
  const decrement = () => {
    switch (zoom) {
      case ZoomLevel.MONTH:
        setDisplayed(new Date(displayed.setMonth(displayed.getMonth() - 1)));
        break;
      case ZoomLevel.DAY:
        setDisplayed(new Date(displayed.setDate(displayed.getDate() - 1)));
        break;
      default:
        console.error("invalid zoom");
    }
  };
  return (
    <>
      <ChevronLeft onClick={() => decrement()} />
      {zoom === ZoomLevel.MONTH &&
        `${month[displayed.getMonth()]} ${displayed.getFullYear()}`}
      {zoom === ZoomLevel.DAY &&
        `${week[displayed.getDay()]} ${
          monthAbbr[displayed.getMonth()]
        } ${displayed.getDate()} ${displayed.getFullYear()}`}
      <ChevronRight onClick={() => increment()} />
    </>
  );
};

const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const monthAbbr = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec"
];

const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default Select;
