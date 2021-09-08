import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Grid,
  Paper,
  Divider,
  Typography,
  CardMedia,
  Avatar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import logo from "../../img/hydradx-logo.jpeg";

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper, //"#143892",
    color: theme.primary,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    marginRight: theme.spacing(1),
  },
}));

const Welcome = () => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <Box display="flex">
        <Box flex="1">
          <Box display="flex" alignItems="center">
            {/* <Avatar className={classes.avatar} /> */}
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              color="primary"
            >
              Welcome to the Ref Finance explorer and statistics website
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" component="div" gutterBottom>
              <p>
                Ref Finance is the starting point to the NEAR Ecosystem with a
                leading AMM and a synchronous DeFi Shard. 🚀
              </p>
              <p>
                This site should help users to better understand what kind of
                data and information are written to the chain and how to
                interpret them. Feel free to explore.
              </p>
              <p>Thanks for support!</p>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default Welcome;
