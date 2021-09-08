import * as React from "react";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

export default () => {
  return (
    <Card>
      <CardHeader title="Change log" />
      <CardContent>
        <Typography variant="h8">
          <ul>
            <li>18.4.2021: Accounts page. Filters. New colors</li>
            <li>
              15.4.2021: Dashboard page: Information about data update time
            </li>
            <li>
              13.4.2021: Nominators page: It is possible to do sorting for
              balance's columns. When sorting ascending by Free Balance column
              it is possible to find stuck Accounts
            </li>
          </ul>
        </Typography>
      </CardContent>
    </Card>
  );
};
