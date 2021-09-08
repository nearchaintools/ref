import * as React from "react";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
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

export default () => (
  <Card>
    <CardHeader title="Useful community links" />
    <CardContent>
      <ul>
        <li>
          Simple Ref NearTools project{" "}
          <Link
            href="https://imiroslav.notion.site/NearTools-com-for-Ref-Finance-a0ea6c5e68dd4a88acf1c2203e7bcef4"
            target="_blank"
            color="secondary"
          >
            management page
          </Link>
        </li>
        <li>
          Ref Finance{" "}
          <Link
            href="https://app.ref.finance/"
            target="_blank"
            color="secondary"
          >
            https://app.ref.finance/
          </Link>
        </li>
      </ul>
    </CardContent>
  </Card>
);
