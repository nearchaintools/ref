import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Tabs,
  Tab,
  Grid,
  Button,
  Typography,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { VerticalSpacer, Spacer, NoData } from "../../../layout/components";
import { useVersion, useDataProvider } from "react-admin";
import MuiTextField from "@material-ui/core/TextField";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import DepositsGrid from "./components/depositsGrid";
import PoolsGrid from "./components/poolsGrid";
import FarmsGrid from "./components/farmsGrid";
import LiquidityGrid from "./components/liquidityGrid";
import { useDebounce } from "../../../hooks/useDebounce";

const useStyles = makeStyles((theme) => ({
  paragraph: {
    paddingTop: theme.spacing(2),
  },
  button: {
    paddingTop: theme.spacing(4),
  },
  account: {
    width: "90%",
  },
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
}));

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
  const {
    state: { accountsState, setAccountsState },
    accountAddress,
  } = props;

  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [value, setValue] = React.useState(0);
  const version = useVersion();
  const dataProvider = useDataProvider();

  const fetchRewards = useCallback(async () => {
    try {
      if (accountAddress && accountAddress !== "") {
        setLoading(true);
        const { data, total } = await dataProvider.getList("account-rewards", {
          pagination: { page: 1, perPage: 50 },
          sort: {},
          filter: { accountAddress },
        });
        setLoading(false);
        setState((state) => ({
          ...state,
          data,
          total,
        }));
      }
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  }, [accountAddress, dataProvider]);

  useEffect(() => {
    fetchRewards();
  }, [accountAddress, version]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let alerts = [];

  const { data: rewards, total } = state;

  return (
    <>
      {rewards && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info" variant="outlined" style={{ border: "0px" }}>
              <AlertTitle>Your Farms Rewards</AlertTitle>
              <Typography variant="caption" display="block" gutterBottom>
                {rewards.map((item) => (
                  <p>{`${item.symbol}: ${item.amount.toLocaleString()}`}</p>
                ))}
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      )}

      {alerts.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Alert severity="error" variant="filled">
              <AlertTitle>{alerts[0].title}</AlertTitle>
              {alerts[0].text}
            </Alert>
          </Grid>
        </Grid>
      )}

      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="account tabs"
      >
        <Tab label="Deposits"></Tab>
        <Tab label="Pools"></Tab>
        <Tab label="Farms"></Tab>
        <Tab label="Liquidity"></Tab>
        <Tab label="Wallet"></Tab>
      </Tabs>
      <>
        <TabPanel value={value} index={0}>
          <DepositsGrid
            accountAddress={accountAddress}
            state={{ accountsState, setAccountsState }}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <PoolsGrid
            accountAddress={accountAddress}
            state={{ accountsState, setAccountsState }}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <FarmsGrid
            accountAddress={accountAddress}
            state={{ accountsState, setAccountsState }}
          />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <LiquidityGrid
            accountAddress={accountAddress}
            state={{ accountsState, setAccountsState }}
          />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <div>TODO...</div>
        </TabPanel>
      </>
    </>
  );
};

export default () => {
  const classes = useStyles();
  const { search } = useLocation();
  const searchParams = queryString.parse(search);
  const { address } = searchParams;
  const [accountAddress, setAccountId] = useState(address);
  const [clicked, setClicked] = useState(Boolean(address));
  const [accountsState, setAccountsState] = useState();
  const debouncedAccountAddress = useDebounce(accountAddress, 1200);

  const onChange = (e) => setAccountId(e.target.value);
  const onClick = (e) => setClicked(true);

  React.useEffect(() => {
    if (address) {
      setClicked(true);
    } else {
      if (debouncedAccountAddress) {
        setClicked(true);
      } else {
        setClicked(false);
      }
    }
  }, [search, debouncedAccountAddress]);

  return (
    <Box display="flex" flexDirection="column">
      <Box flex="1">
        <Card>
          <CardHeader title="Account status and statistics" />
          <CardContent>
            <Grid container alignItems="center" direction="row">
              <Grid item xs={6}>
                <MuiTextField
                  label="Enter Account Address"
                  name="accountAddress"
                  value={accountAddress}
                  onChange={onChange}
                  className={classes.account}
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  color="primary"
                  onClick={onClick}
                  label="Send"
                  className={classes.button}
                  disabled={!debouncedAccountAddress}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </CardContent>
          <CardContent>
            {clicked && (
              <MyTabs
                accountAddress={accountAddress}
                state={{ accountsState, setAccountsState }}
              />
            )}
          </CardContent>
        </Card>
      </Box>

      <VerticalSpacer />
    </Box>
  );
};
