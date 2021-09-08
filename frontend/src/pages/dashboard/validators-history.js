import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
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
import {
  useQuery,
  Datagrid,
  TextField,
  Pagination,
  Loading,
  DateField,
  NumberField,
  Button,
  FunctionField,
  Labeled,
} from "react-admin";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
}));

const getIdentity = ({ identity }) => {
  if (!identity) return;
  let result = identity.display;
  if (identity.displayParent) {
    result = `${identity.displayParent}/${identity.display}`;
  }
  return result;
};

const HistoryRow = (props) => {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        {/* <TableCell>{getIdentity(row.validator)}</TableCell> */}
        <TableCell align="right">{row.eraIndex}</TableCell>
        <TableCell align="right">{row.commission}</TableCell>
        {/* <TableCell align="right">{Math.round(row.ownStake)}</TableCell> */}
        <TableCell>{row.validatorAddress}</TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const ValidatorsHistory = () => {
  const classes = useStyles();

  const { data, total, loading, error } = useQuery({
    type: "getOne",
    resource: "era-commissions",
    payload: {
      id: "lastEraCommissionsStatsQuery",
    },
  });

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <div>ERROR: {error}</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {/* <TableCell>Identity</TableCell> */}
            <TableCell align="right">Era Index</TableCell>
            <TableCell align="right">Commision</TableCell>
            {/* <TableCell align="right">Other Stake</TableCell> */}
            <TableCell>Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.badValidators.map((row, index) => {
            row = {
              eraIndex: data.eraIndex,
              ...row,
            };

            return <HistoryRow key={index} row={row} />;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ValidatorsHistory;
