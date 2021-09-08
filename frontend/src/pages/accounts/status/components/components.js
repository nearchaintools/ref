import * as React from "react";
import { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Avatar,
  Box,
  Collapse,
  IconButton,
  Tabs,
  Tab,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import StakingIcon from "@material-ui/icons/AttachMoney";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Paper from "@material-ui/core/Paper";

const ErasRow = (props) => {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.era}</TableCell>
        <TableCell align="right">
          {Math.round(row.totalEraPayout / DECIMAL_PLACES, 3)}
        </TableCell>
        <TableCell align="right">{row.totalEraRewardPoints}</TableCell>
        <TableCell align="right">{row.payouts.length}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Payouts
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Validator</TableCell>
                    <TableCell>Claimed</TableCell>
                    <TableCell align="right">Payout Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.payouts.map((payout) => (
                    <TableRow key={payout.validatorId}>
                      <TableCell>{payout.validatorId}</TableCell>
                      <TableCell>{payout.claimed}</TableCell>
                      <TableCell align="right">
                        {Math.round(
                          payout.nominatorStakingPayout / DECIMAL_PLACES,
                          3
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const ErasGrid = ({ erasPayouts }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Era</TableCell>
            <TableCell>Total Era Payout</TableCell>
            <TableCell align="right">Reward Points</TableCell>
            <TableCell align="right">Payouts</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {erasPayouts.map((row) => (
            <ErasRow key={row.era} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const MyTabs = (props) => {
  console.log(props);
  const { erasPayouts } = props;

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="payout tabs"
      >
        <Tab label="Payouts History"></Tab>
        {/* <Tab label="Eras Payouts"></Tab>
          <Tab label="Validator's Stats" /> */}
      </Tabs>
      <>
        <TabPanel value={value} index={0}>
          <PayoutsGrid payouts={erasPayouts} />
        </TabPanel>
        {/* <TabPanel value={value} index={1}>
            <ErasGrid erasPayouts={erasPayouts} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            Item Three
          </TabPanel> */}
      </>
    </>
  );
};
