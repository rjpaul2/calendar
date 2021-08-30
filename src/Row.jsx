import { useContext, useEffect, useRef, useState } from "react";
import { CanvasContext, ROW_HEIGHT, MAX_WIDTH } from "./Canvas";
//import daygrid from "./img/daygrid.jpg";
import { Grid } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { ZoomLevel } from "./useScale";
import DataPointIcon from "@material-ui/icons/FiberManualRecord";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      overflow: "hidden",
      position: "relative"
    },
    cell: {
      height: ROW_HEIGHT,
      "&:nth-child(odd)": {
        backgroundColor: "#dce4ef"
      },
      "&:nth-child(even)": {
        backgroundColor: "#e2eaf4"
      }
    },
    point: {
      position: "relative",

      gridArea: "1 / 1 / 2 / 2",
      //gridArea: "1 / 1 / 2 / 2",
      fill: "#003ecc",
      height: 15,
      width: 15,
      cursor: "pointer",
      //alignSelf: "center",
      //justifySelf: "center",
      zIndex: 9
    }
  };
});

const Row = ({ data }) => {
  var { offset, scale, zoom, displayed } = useContext(CanvasContext);
  const classes = useStyles();
  const [numCells, setNumCells] = useState(0);
  useEffect(() => {
    switch (zoom) {
      case ZoomLevel.DAY:
        setNumCells(24);
        break;
      // case ZoomLevel.WEEK:
      //   numCells = 7;
      //   break;
      case ZoomLevel.MONTH:
        setNumCells(
          new Date(
            displayed.getFullYear(),
            displayed.getMonth() + 1,
            0
          ).getDate()
        ); //Days in month
        break;
      default:
        console.error("whoa whoa whoa");
    }
  }, [zoom, displayed]);

  //getPerc(ZoomLevel.MONTH);

  return (
    <div className={classes.root}>
      <Grid
        container
        justifyContent="center"
        direction="row"
        style={{
          position: "absolute",
          height: ROW_HEIGHT,
          width: MAX_WIDTH * scale * 2,
          overflow: "hidden",
          left: -offset * scale,
          bottom: 0,
          top: 0,
          borderBottom: "2px solid #d3dce8"
        }}
      >
        {Array.from(Array(numCells).keys()).map((value, index) => (
          <Grid xs item key={index} className={classes.cell}></Grid>
        ))}
      </Grid>
      {/** <div
      style={{
        //backgroundImage: `url("https://jclem.nyc3.cdn.digitaloceanspaces.com/pan-zoom-canvas-react/grid.svg")`,
        //backgroundImage: `url(${daygrid})`,
        transform: `scaleX(${scale})`,
        //backgroundRepeat: "no-repeat",
        //backgroundPosition: `${-offset}px ${index * ROW_HEIGHT + 50}px`, //TODO: fixate 50
        position: "absolute",
        bottom: 0,
        left: buffer.x,
        right: buffer.x,
        top: 0
      }}
    ></div>*/}
      <div
        style={{
          display: "grid",
          height: "140px",
          alignItems: "center",
          position: "relative",
          width: MAX_WIDTH * scale * 2,
          left: -offset * scale,
          bottom: 0,
          top: 0,
          pointerEvents: "none" // Ignore background so we can determine cell
        }}
      >
        {data.map((date, i) => (
          <DataPoint key={i} date={date} />
        ))}
      </div>
    </div>
  );
  //<div className={classes.root}/>
};

export default Row;

const DataPoint = ({ date }) => {
  var { scale, zoom, displayed } = useContext(CanvasContext);
  const classes = useStyles();
  //let perc = getPerc(zoom, date);
  var perc = 0;
  var render = false;
  // Convert date into percentage of maximum zoom
  //let end, start;

  //useEffect(() => {
  //Determine location and if a render is appropriate
  switch (zoom) {
    case ZoomLevel.MONTH:
      //console.log(displayed);

      if (areOnSameMonth(date, displayed)) {
        render = true;
        let start = new Date(
          date.getFullYear(),
          date.getMonth(),
          1,
          0,
          0,
          0,
          0,
          0
        );
        let end = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        ); // last day of month TODO: get speicic month
        perc = (date - start) / (end - start);
      }
      break;
    case ZoomLevel.DAY:
      if (areOnSameDay(date, displayed)) {
        render = true;
        let ms =
          date.getHours() * 3600000 +
          date.getMinutes() * 60000 +
          date.getSeconds() * 1000 +
          date.getMilliseconds();
        let start = new Date();
        start.setUTCHours(0, 0, 0, 0, 0);
        let end = new Date();
        end.setUTCHours(23, 59, 59, 999);
        perc = ms / (end - start);
      }
      break;
    default:
      console.error("invalid zoom");
  }
  // }, [zoom]);
  return (
    <>
      {render && (
        <DataPointIcon
          style={{
            left: MAX_WIDTH * scale * 2 * perc - 7.5,
            pointerEvents: "all"
          }} /**  minus width of icon / 2 */
          className={classes.point}
        />
      )}
    </>
  );
};

// const getPerc = (zoom, date) => {
//   // Convert date into percentage of maximum zoom
//   let end, start;
//   var res = 0;
//   date= new Date();
//   switch (zoom) {
//     case ZoomLevel.MONTH:
//       start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0, 0);
//       end = new Date(
//         date.getFullYear(),
//         date.getMonth() + 1,
//         0,
//         23,
//         59,
//         59,
//         999
//       ); // last day of month TODO: get speicic month
//       res = (date - start) / (end - start);
//       break;
//     case ZoomLevel.DAY:
//       let ms =
//         date.getHours() * 3600000 +
//         date.getMinutes() * 60000 +
//         date.getSeconds() * 1000 +
//         date.getMilliseconds()
//       start = new Date();
//       start.setUTCHours(0, 0, 0, 0, 0);
//       end = new Date();
//       end.setUTCHours(23, 59, 59, 999);
//       res = ms / (end - start);
//       break;
//     default:
//       console.error("invalid zoom");
//   }
//   return res;
// };

const areOnSameMonth = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth();

const areOnSameDay = (first, second) =>
  areOnSameMonth(first, second) && first.getDate() === second.getDate();
