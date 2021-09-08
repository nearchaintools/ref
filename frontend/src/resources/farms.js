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
  Link,
} from "@material-ui/core";
import { Charts, Chimp } from "../layout/components";
import RedeemOutlinedIcon from "@material-ui/icons/RedeemOutlined";
import { useChainStatus } from "../chain/ChainProvider";
import { Fragment } from "react";
import { Bar } from "react-chartjs-2";

export const FarmIcon = RedeemOutlinedIcon;

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
  <Pagination rowsPerPageOptions={[100]} {...props} />
);

const FarmTitle = ({ record }) => {
  return (
    <span>{`Farm ${record.tokens[0].symbol / record.tokens[1].symbol}`}</span>
  );
};

// only for Simple Farms contains two tokens
const renderFarmTokens = ({ tokens }) => {
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

const renderPoolLink = (record) => {
  return (
    <Link href={`#/pools/${record.simplePoolId}/show/0`}>
      {record.simplePoolId}
    </Link>
  );
};

const renderStatus = ({ status }) => {
  switch (status) {
    case "RUNNING":
      return "Running";
    case "ENDED":
      return "Ended";
    case "CREATED":
      return "Created";
    default:
      return "Cleared";
  }
};

const renderPoolTokens = ({ simplePool: { tokens } }) => {
  if (!tokens || tokens.length < 2) return;

  return `${tokens[0].symbol}/${tokens[1].symbol}`;
};

export const FarmsList = (props) => {
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
        <NumberField source="id" sortable={true} label="Farm ID" />
        <ShowButton basePath="/farms" label="Detail" />

        <FunctionField render={renderStatus} label="Status" sortable={false} />
        <FunctionField
          render={(record) => new Date(record.startAt * 1000).toLocaleString()}
          label="Started At"
          sortable={true}
        />
        <FunctionField
          render={renderPoolTokens}
          label="Tokens"
          sortable={false}
        />
        <FunctionField
          render={renderPoolLink}
          sortable={true}
          label="Pool ID"
        />
        <TextField
          source="rewardToken.symbol"
          label="Rewards Token"
          sortable={false}
        />

        <FunctionField
          render={(record) => renderLocaleFloat(record.totalReward)}
          label="Total Rewards"
        />
        <FunctionField
          render={(record) => renderLocaleFloat(record.claimedReward)}
          label="Claimed Rewards"
        />
        <FunctionField
          render={(record) => renderLocaleFloat(record.unclaimedReward)}
          label="Unclaimed Rewards"
        />
      </Datagrid>
    </List>
  );
};

export const FarmShow = (props) => (
  <Show title={<FarmTitle />} {...props}>
    <TabbedShowLayout>
      <Tab label="Overview">
        <NumberField source="id" sortable={true} label="Farm ID" />

        <FunctionField render={renderStatus} label="Status" sortable={false} />
        <FunctionField
          render={(record) => new Date(record.startAt).toLocaleString()}
          label="Started At"
          sortable={true}
        />
        <TextField
          source="rewardToken.symbol"
          label="Rewards Token"
          sortable={false}
        />

        <FunctionField
          render={(record) => renderLocaleFloat(record.totalReward)}
          label="Total Rewards"
        />
        <FunctionField
          render={(record) => renderLocaleFloat(record.claimedReward)}
          label="Claimed Rewards"
        />
        <FunctionField
          render={(record) => renderLocaleFloat(record.unclaimedReward)}
          label="Unclaimed Rewards"
        />
      </Tab>
    </TabbedShowLayout>
  </Show>
);
