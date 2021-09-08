import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Grid,
  Paper,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import DollarIcon from "@material-ui/icons/AttachMoney";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import { VerticalSpacer } from "../../layout/components";
import { Bar } from "react-chartjs-2";
import {
  useNotify,
  useRedirect,
  fetchStart,
  fetchEnd,
  Button,
  useDataProvider,
  useQuery,
  useVersion,
  Loading,
} from "react-admin";
import Welcome from "./welcome";
import ValueBar from "./value-bar";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: "white",
    backgroundColor: "blue",
  },
  graph: {
    width: 200,
    height: 200,
  },
}));

const renderLocaleFloat = (numberStr) => {
  const number = parseFloat(numberStr);
  return number.toLocaleString();
};

export default () => {
  const classes = useStyles();
  const version = useVersion();
  const dataProvider = useDataProvider();
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      // const { data: newAccountsData } = await dataProvider.getOne(
      //   "statistics",
      //   {
      //     id: "new-accounts",
      //   }
      // );
      const newAccountsData = { accounts: [] };
      setLoading(false);
      setState((state) => ({
        ...state,
        newAccountsData,
      }));
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  }, [dataProvider]);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const { data: stats } = await dataProvider.getOne("ref-stats", {
        id: "dashboard",
      });

      setLoading(false);
      setState((state) => ({
        ...state,
        stats,
      }));
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  }, [dataProvider]);

  useEffect(() => {
    fetchAccounts();
    fetchStats();
  }, [version]);

  const { newAccountsData, stats } = state;

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <div>ERROR: {error}</div>;
  }

  let chartData = {};
  let chartOptions = {};

  if (newAccountsData) {
    // const labels = newAccountsData.accounts.map((item) => item.date);
    // const newAccounts = newAccountsData.accounts.map((item) => item.count);
    // const newAmount = newAccountsData.accounts.map((item) => item.amount);

    const labels = [
      "01.09.",
      "02.09.",
      "03.09",
      "04.09",
      "05.09.",
      "06.09.",
      "07.09.",
    ];
    const totalValueLocked = [1.2, 1.6, 1.8, 2.3, 3.0, 3.0, 3.1];
    const dailyVolume = [0.8, 0.7, 0.6, 1.1, 1.4, 1.1, 0.9];

    chartData = {
      labels,
      datasets: [
        {
          type: "line",
          label: "Total Value Locked",
          yAxisID: "y2",
          borderColor: "#bf0e73",
          borderWidth: 2,
          color: "white",
          fill: false,
          data: totalValueLocked,
        },
        {
          type: "bar",
          label: "Daily Volume",
          yAxisID: "y1",
          backgroundColor: "rgb(54, 162, 235)",
          color: "white",
          data: dailyVolume,
          // borderColor: "white",
          // borderWidth: 2,
        },
      ],
    };

    chartOptions = {
      responsive: true,
      interaction: {
        mode: "index",
        intersect: false,
      },
      stacked: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#fff",
          },
          title: {
            color: "#fff",
          },
        },
      },
      scales: {
        y1: {
          type: "linear",
          display: true,
          position: "left",
          color: "white",
          title: {
            color: "#fff",
          },
          ticks: {
            color: "#fff",
          },
        },
        y2: {
          type: "linear",
          display: true,
          position: "right",
          color: "#fff",
          // grid line settings
          grid: {
            //color: "#fff",
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
          title: {
            color: "#fff",
          },
          ticks: {
            color: "#fff",
          },
        },
      },
    };
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Welcome />
        </Grid>
        <Grid item xs={12} container direction="row" spacing={3}>
          <Grid item xs={3}>
            <ValueBar
              value={stats && stats.nrOfTokens}
              icon={LocalAtmIcon}
              title="Number of Tokens"
            />
          </Grid>
          <Grid item xs={3}>
            <ValueBar
              value={stats && stats.nrOfPools}
              icon={AccountBalanceIcon}
              title="Number of Pools"
            />
          </Grid>
          <Grid item xs={3}>
            <ValueBar
              value={stats && stats.nrOfFarms}
              icon={AllInclusiveIcon}
              title="Number of Farms"
            />
          </Grid>
          <Grid item xs={3}>
            <ValueBar
              value={stats && renderLocaleFloat(stats.TVL)}
              icon={DollarIcon}
              title="Total Value Locked"
            />
          </Grid>
          {/* <Grid item xs={3}>
            <ValueBar
              value={stats && stats.volume24}
              icon={DollarIcon}
              title="Volume 24 Hours"
            />
          </Grid> */}
        </Grid>
        <Grid item xs={12} container direction="row" spacing={3}>
          <Grid item xs={6}>
            <Card>
              <CardHeader title="Demo Chart" />
              <CardContent color="white">
                <Bar data={chartData} options={chartOptions} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}></Grid>
        </Grid>
        {/* </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>xs=6</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>xs=3</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>xs=3</Paper>
        </Grid>
        <Grid item container direction="column" spacing={3}>
          <Grid item xs={3}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid> */}
      </Grid>
    </div>
  );
};
