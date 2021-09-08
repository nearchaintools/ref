import * as React from "react";
import Chip from "@material-ui/core/Chip";
import { FieldProps, getListControllerProps } from "react-admin";
import { green, orange, red, grey } from "@material-ui/core/colors";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  main: {
    display: "flex",
    flexWrap: "nowrap",
  },
  chip: {
    margin: 1,
    border: 2,
  },
});

const ChimpField = (props) => {
  const classes = useStyles();

  const { record, status } = props;

  return record ? (
    <span className={classes.main}>
      {status.map((item, index) => {
        const getChimColor = (color) => {
          switch (color) {
            case "green":
              return green[900];
            case "red":
              return red[500];
            case "grey":
              return grey[600];
            case "orange":
              return orange[600];
          }
        };

        return (
          <Chip
            size="small"
            key={index}
            className={classes.chip}
            label={item.label}
            style={{
              backgroundColor: getChimColor(item.color),
              color: "white",
            }}
          />
        );
      })}
    </span>
  ) : null;
};

export default ChimpField;
