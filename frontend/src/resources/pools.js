import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  UrlField,
  BooleanField,
  Pagination,
  ShowButton,
  Show,
  TabbedShowLayout,
  Tab,
  ReferenceManyField,
  FunctionField,
  useDataProvider,
  useVersion,
  useRecordContext,
} from "react-admin";
import {
  makeStyles,
  Grid,
  Card,
  CardHeader,
  CardContent,
} from "@material-ui/core";
import { Charts, Chimp } from "../layout/components";
import PlaylistAddCheckOutlinedIcon from "@material-ui/icons/PlaylistAddCheckOutlined";
import { useChainStatus } from "../chain/ChainProvider";
import { Fragment } from "react";
import { Bar } from "react-chartjs-2";
import ReactHighcharts from "react-highcharts/ReactHighstock.src";
import moment from "moment";

export const PoolIcon = PlaylistAddCheckOutlinedIcon;

const useStyles = makeStyles((theme) => ({
  positionRelative: {
    position: "relative",
  },
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

const OwnPagination = (props) => (
  <Pagination rowsPerPageOptions={[100, 200]} {...props} />
);

const PoolTitle = ({ record }) => {
  return (
    <span>{`Pool ${record.tokens[0].symbol / record.tokens[1].symbol}`}</span>
  );
};

// only for Simple Pools contains two tokens
const renderPoolTokens = ({ tokens }) => {
  if (!tokens || tokens.length < 2) return;

  return `${tokens[0].symbol}/${tokens[1].symbol}`;
};

const calcSwapRate1 = ({ tokens }) => {
  if (!tokens || tokens.length < 2) return 0;
  if (tokens[1].amount === 0) return 0;
  const rate = tokens[0].amount / tokens[1].amount;
  return rate.toLocaleString();
};

const calcSwapRate2 = ({ tokens }) => {
  if (!tokens || tokens.length < 2) return 0;
  if (tokens[0].amount === 0) return 0;
  const rate = tokens[1].amount / tokens[0].amount;
  return rate.toLocaleString();
};

const renderLocaleFloat = (numberStr) => {
  const number = parseFloat(numberStr);
  return number.toLocaleString();
};

const drawReactChart = (record) => <Charts.ReactChart record={record} />;

export const PoolsList = (props) => {
  const chartRef = useRef();
  const classes = useStyles(props);
  const { chainStatus } = useChainStatus();
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const version = useVersion();
  const dataProvider = useDataProvider();

  const fetchMetadata = useCallback(async () => {
    try {
      setLoading(true);
      // const { data } = await dataProvider.getOne("session", {
      //   id: "actual",
      // });
      const data = [];
      setLoading(false);
      setState((state) => ({
        ...state,
        metatada: data,
      }));
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  }, [props, dataProvider]);

  useEffect(() => {
    fetchMetadata();
  }, [props, version]);

  const { metadata } = state;

  return (
    <List
      {...props}
      perPage={100}
      pagination={<OwnPagination />}
      exporter={false}
    >
      <Datagrid isRowSelectable={() => false}>
        <NumberField source="id" sortable={true} label="Pool ID" />
        <ShowButton basePath="/pools" label="Detail" />
        <FunctionField
          render={renderPoolTokens}
          label="Tokens"
          sortable={false}
        />
        <FunctionField
          render={calcSwapRate1}
          label="Swap Rate 1/2"
          sortable={false}
        />
        <FunctionField
          render={calcSwapRate2}
          label="Swap Rate 2/1"
          sortable={false}
        />

        <FunctionField
          render={(record) => renderLocaleFloat(record.tokens[0].amount)}
          label="Token 1 Amount"
        />
        <FunctionField
          render={(record) => renderLocaleFloat(record.tokens[1].amount)}
          label="Token 2 Amount"
        />

        <FunctionField
          render={(record) => renderLocaleFloat(record.tvl)}
          label="Total Value Locked"
          sortable={true}
        />

        <FunctionField
          render={(record) => renderLocaleFloat(record.totalShares)}
          label="Total Shares"
        />

        <NumberField source="fee" sortable={false} label="Fee %" />
      </Datagrid>
    </List>
  );
};

const renderDirection = ({ direction }) => {
  return direction === "POOL_IN" ? "Add liquidity" : "Remove liquidity";
};

const TokensCharts = (props) => {
  const classes = useStyles();
  const record = useRecordContext(props);
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const dataProvider = useDataProvider();
  const version = useVersion();

  const fetchChartsData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await dataProvider.getList("pool-tokens", {
        pagination: { page: 1, perPage: 10 },
        sort: {},
        filter: { poolId: record.id },
      });
      setLoading(false);
      setState((state) => ({
        ...state,
        data,
      }));
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  }, [record.id, dataProvider]);

  useEffect(() => {
    fetchChartsData();
  }, [record.id, version]);

  const { data } = state;

  console.log(data);
  if (!data || data.length === 0) return null;

  const labels1 = data[0].token1.prices.map((item) => item.dateTime);
  const data1 = data[0].token1.prices.map((item) => item.price);

  const chart1Data = {
    labels: labels1,
    datasets: [
      {
        type: "line",
        label: `Price for ${data[0].token1.symbol}`,
        borderColor: "#bf0e73",
        borderWidth: 2,
        color: "white",
        fill: false,
        data: data1,
      },
    ],
  };
  const chartOptions = {};

  const options = {};
  const numberFormat = new Intl.NumberFormat("en-US", options);
  const prices1 = data[0].token1.prices.map((item) => [
    item.timestamp,
    item.price,
  ]);
  const prices2 = data[0].token2.prices.map((item) => [
    item.timestamp,
    item.price,
  ]);

  const configPrice1 = {
    yAxis: [
      {
        offset: 20,

        labels: {
          formatter: function () {
            return numberFormat.format(this.value);
          },
          x: -15,
          style: {
            color: "#000",
            position: "absolute",
          },
          align: "left",
        },
      },
    ],
    tooltip: {
      shared: true,
      formatter: function () {
        return (
          numberFormat.format(this.y, 0) +
          "</b><br/>" +
          moment(this.x).format("MMMM Do YYYY, h:mm")
        );
      },
    },
    plotOptions: {
      series: {
        showInNavigator: true,
        gapSize: 6,
      },
    },
    rangeSelector: {
      selected: 1,
    },
    title: {
      text: `Swap Price for 1 ${data[0].token2.symbol} to ${data[0].token1.symbol}`,
    },
    chart: {
      height: 500,
    },

    credits: {
      enabled: false,
    },

    legend: {
      enabled: true,
    },
    xAxis: {
      type: "date",
    },
    rangeSelector: {
      buttons: [
        {
          type: "minutes",
          count: 5,
          text: "5m",
        },
        {
          type: "hour",
          count: 1,
          text: "1h",
        },
        {
          type: "day",
          count: 1,
          text: "1d",
        },
        {
          type: "day",
          count: 7,
          text: "7d",
        },
        {
          type: "all",
          text: "All",
        },
      ],
      selected: 1,
    },
    series: [
      {
        name: "Price",
        type: "spline",

        data: prices1,
        tooltip: {
          valueDecimals: 2,
        },
      },
    ],
  };

  const configPrice2 = {
    yAxis: [
      {
        offset: 20,

        labels: {
          formatter: function () {
            return numberFormat.format(this.value);
          },
          x: -15,
          style: {
            color: "#000",
            position: "absolute",
          },
          align: "left",
        },
      },
    ],
    tooltip: {
      shared: true,
      formatter: function () {
        return (
          numberFormat.format(this.y, 0) +
          "</b><br/>" +
          moment(this.x).format("MMMM Do YYYY, h:mm")
        );
      },
    },
    plotOptions: {
      series: {
        showInNavigator: true,
        gapSize: 6,
      },
    },
    rangeSelector: {
      selected: 1,
    },
    title: {
      text: `Swap Price for 1 ${data[0].token1.symbol} to ${data[0].token2.symbol}`,
    },
    chart: {
      height: 500,
    },

    credits: {
      enabled: false,
    },

    legend: {
      enabled: true,
    },
    xAxis: {
      type: "date",
    },
    rangeSelector: {
      buttons: [
        {
          type: "minutes",
          count: 5,
          text: "5m",
        },
        {
          type: "hour",
          count: 1,
          text: "1h",
        },
        {
          type: "day",
          count: 1,
          text: "1d",
        },
        {
          type: "day",
          count: 7,
          text: "7d",
        },
        {
          type: "all",
          text: "All",
        },
      ],
      selected: 1,
    },
    series: [
      {
        name: "Price",
        type: "spline",

        data: prices2,
        tooltip: {
          valueDecimals: 2,
        },
      },
    ],
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3} direction="row">
        <Grid item xs={6}>
          <Card>
            <CardContent color="white">
              <ReactHighcharts config={configPrice1}></ReactHighcharts>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent color="white">
              <ReactHighcharts config={configPrice2}></ReactHighcharts>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export const PoolShow = (props) => (
  <Show title={<PoolTitle />} {...props}>
    <TabbedShowLayout>
      <Tab label="Overview">
        <NumberField source="id" sortable={true} label="Pool ID" />

        <FunctionField
          render={renderPoolTokens}
          label="Tokens"
          sortable={false}
        />
        <FunctionField
          render={calcSwapRate1}
          label="Swap Rate 1/2"
          sortable={false}
        />
        <FunctionField
          render={calcSwapRate2}
          label="Swap Rate 2/1"
          sortable={false}
        />

        <FunctionField
          render={(record) => renderLocaleFloat(record.tokens[0].amount)}
          label="Token 1 Amount"
        />
        <FunctionField
          render={(record) => renderLocaleFloat(record.tokens[1].amount)}
          label="Token 2 Amount"
        />

        <FunctionField
          render={(record) => renderLocaleFloat(record.tvl)}
          label="Total Value Locked"
        />

        <FunctionField
          render={(record) => renderLocaleFloat(record.totalShares)}
          label="Total Shares"
        />

        <NumberField source="fee" sortable={false} label="Fee %" />
      </Tab>
      <Tab label="Liquidity">
        <ReferenceManyField
          reference="liquidity"
          target="poolId"
          addLabel={false}
          sort={{ field: "timestamp", order: "DESC" }}
        >
          <Datagrid>
            <DateField source="dateTime" showTime />
            <TextField
              source="accountAddress"
              sortable={true}
              label="Account"
            />
            <NumberField source="poolId" sortable={false} label="Pool ID" />
            <FunctionField
              render={renderPoolTokens}
              label="Tokens"
              sortable={false}
            />
            <FunctionField
              render={renderDirection}
              label="Direction"
              sortable={false}
            />

            <FunctionField
              render={(record) => renderLocaleFloat(record.token1Amount)}
              label="Token 1 Amount"
            />
            <FunctionField
              render={(record) => renderLocaleFloat(record.token2Amount)}
              label="Token 2 Amount"
            />
            <FunctionField
              render={(record) =>
                record.removedShares === "0"
                  ? ""
                  : renderLocaleFloat(record.removedShares)
              }
              label="Removed Shares"
            />
            <TextField source="timestamp" sortable={true} label="Timestamp" />
          </Datagrid>
        </ReferenceManyField>
      </Tab>
      <Tab label="Charts">
        <TokensCharts />
      </Tab>
    </TabbedShowLayout>
  </Show>
);
