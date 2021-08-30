import { useContext, useEffect, useRef, useState } from "react";
import { MAX_WIDTH, CanvasContext } from "./Canvas";
import { ZoomLevel } from "./useScale";
import { Grid } from "@material-ui/core/";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((offset, buffer, scale) => {
  return {
    root: {
      maxWidth: MAX_WIDTH,
      overflow: "hidden",
      backgroundColor: "#ebf3fb"
    },
    cell: {},
    cellcontent: {
      //alignSelf:"center",
    }
  };
});
const week = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const Header = () => {
  var { offset, scale, zoom, displayed } = useContext(CanvasContext);
  //const classes = useStyles((offset-130)*scale, (1400*scale)/24);
  const classes = useStyles();
  const [header, setHeader] = useState([]);
  useEffect(() => {
    switch (zoom) {
      case ZoomLevel.DAY:
        setHeader([
          "12 AM",
          "1 AM",
          "2 AM",
          "3 AM",
          "4 AM",
          "5 AM",
          "6 AM",
          "7 AM",
          "8 AM",
          "9 AM",
          "10 AM",
          "11 AM",
          "12 PM",
          "1 PM",
          "2 PM",
          "3 PM",
          "4 PM",
          "5 PM",
          "6 PM",
          "7 PM",
          "8 PM",
          "9 PM",
          "10 PM",
          "11 PM"
        ]);
        break;
      // case ZoomLevel.WEEK:
      //   header.current = week;
      //   break; // TODO: figure out associated dates
      case ZoomLevel.MONTH: //TODO: make work in context of selected month
        let _header = [],
          y = displayed.getFullYear(),
          m = displayed.getMonth();
        var daysInMonth = new Date(y, m + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          let d = new Date(y, m, i);
          _header.push([d.getDate(), week[d.getDay()]]);
        }
        setHeader(_header);
        break;
      default:
        console.error("whoa whoa whoa");
    }
  }, [zoom, displayed]);

  return (
    <div className={classes.root}>
      <Grid
        container
        justifyContent="center"
        alignContent="center"
        direction="row"
        style={{
          position: "relative",
          height: 50,
          width: MAX_WIDTH * scale * 2,
          left: -offset * scale,
          cursor: "default",
          borderBottom: "2px solid #d3dce8",
          gridAutoColumns: "1fr",
          gridAutoFLow: "column"
        }}
      >
        {header.map((value, index) => (
          <Grid xs item key={index}>
            {zoom !== ZoomLevel.MONTH && <div>{value}</div>}
            {zoom === ZoomLevel.MONTH && (
              <div className={classes.cell}>
                <div className={classes.top}>{value[0]}</div>
                <div className={classes.bottom}>{value[1]}</div>
              </div>
            )}
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Header;
