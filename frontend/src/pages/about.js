import * as React from "react";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paragraph: {
    paddingTop: theme.spacing(2),
  },
}));

export default () => {
  const classes = useStyles();
  return (
    <Card>
      <CardHeader title="About us and about this website" />
      <CardContent>
        <Typography variant="body1">
          Support our work by NEAR donation: imiroslav.near
        </Typography>
      </CardContent>
    </Card>
  );
};
