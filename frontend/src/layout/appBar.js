// in src/MyAppBar.js
import * as React from "react";
import { AppBar } from "react-admin";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  title: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    fontWeight: 600,
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
});

const MyAppBar = (props) => {
  const classes = useStyles();
  return (
    <AppBar {...props} color="primary">
      <Typography
        variant="h6"
        color="inherit"
        id="react-admin-title"
        className={classes.title}
      />
      {/* <Logo /> */}
      Ref Finance explorer and statistics
      <span className={classes.spacer} />
    </AppBar>
  );
};

export default MyAppBar;
