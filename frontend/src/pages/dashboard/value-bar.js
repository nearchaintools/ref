import * as React from "react";
import { createElement } from "react";
import { Card, Box, Typography, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: theme.spacing(4),
    padding: theme.spacing(2),
  },
  icon: {
    padding: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

const ValueBar = (props) => {
  const { title, value, icon } = props;
  const classes = useStyles();

  return (
    <Card>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box className={classes.icon}>
          {createElement(icon, { fontSize: "large" })}
        </Box>
        <Box
          display="flex"
          className={classes.root}
          flexDirection="column"
          justifyContent="space-between"
        >
          <Typography variant="body1">{title}</Typography>
          <Typography variant="h5">{value}</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default ValueBar;
