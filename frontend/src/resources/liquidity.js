import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
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
  TextInput,
} from "react-admin";
import { makeStyles } from "@material-ui/core";
import { Charts, Chimp } from "../layout/components";
import StorageOutlinedIcon from "@material-ui/icons/StorageOutlined";
import { useChainStatus } from "../chain/ChainProvider";
import { Fragment } from "react";

export const LiquidityIcon = StorageOutlinedIcon;

const useStyles = makeStyles({
  positionRelative: {
    position: "relative",
  },
});

const OwnPagination = (props) => (
  <Pagination rowsPerPageOptions={[100, 200]} {...props} />
);

// only for Simple Pools contains two tokens
const renderPoolTokens = ({ pool: { tokens } }) => {
  if (!tokens || tokens.length < 2) return;

  return `${tokens[0].symbol}/${tokens[1].symbol}`;
};

const renderDirection = ({ direction }) => {
  return direction === "POOL_IN" ? "Add liquidity" : "Remove liquidity";
};

const renderLocaleFloat = (numberStr) => {
  const number = parseFloat(numberStr);
  return number.toLocaleString();
};

const filters = [
  <TextInput label="Account" source="accountAddress" alwaysOn />,
  <TextInput label="Pool ID" source="poolId" alwaysOn />,
];

export const LiquidityList = (props) => {
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
      sort={{ field: "timestamp", order: "DESC" }}
      filters={filters}
    >
      <Datagrid isRowSelectable={() => false}>
        <DateField source="dateTime" showTime />
        <TextField source="accountAddress" sortable={true} label="Account" />
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
    </List>
  );
};

export const LiquidityShow = (props) => (
  <Show title={<div>Liquidity</div>} {...props}>
    <TabbedShowLayout>
      <Tab label="Overview"></Tab>
      <Tab label="Shareholders">
        <ReferenceManyField
          reference="pool-shareholders"
          target="poolId"
          addLabel={false}
        >
          <Datagrid></Datagrid>
        </ReferenceManyField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
