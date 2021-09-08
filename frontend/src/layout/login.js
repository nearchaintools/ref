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
//import logo from "../../img/hydradx-logo.jpeg";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#143892", //theme.palette.background.paper, //"#143892",
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

const Login = () => {
  const classes = useStyles();
  return <div>This is Login</div>;
};

export default Login;
