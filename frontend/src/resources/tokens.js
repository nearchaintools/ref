import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  List,
  Datagrid,
  TextField,
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
import ExtensionOutlinedIcon from "@material-ui/icons/ExtensionOutlined";
import { useChainStatus } from "../chain/ChainProvider";
import { Fragment } from "react";

export const TokenIcon = ExtensionOutlinedIcon;

const useStyles = makeStyles({
  positionRelative: {
    position: "relative",
  },
});

const OwnPagination = (props) => (
  <Pagination rowsPerPageOptions={[100]} {...props} />
);

const TokenTitle = ({ record }) => {
  return <span>{`Token ${record && record.symbol}`}</span>;
};

const renderLocaleFloat = (numberStr) => {
  const number = parseFloat(numberStr);
  return number.toLocaleString();
};

const filters = [
  <TextInput label="Symbol" source="symbol" alwaysOn />,
  <TextInput label="Name" source="name" alwaysOn />,
];

export const TokensList = (props) => {
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
      // const { data } = await dataProvider.getOne("xxxx", {
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
      filters={filters}
    >
      <Datagrid isRowSelectable={() => false}>
        <NumberField source="symbol" sortable={true} label="Symbol" />
        {/* <ShowButton basePath="/pools" label="Detail" /> */}
        <TextField source="name" sortable={false} label="Name" />
        <TextField source="contractId" sortable={false} label="Contract ID" />
        <NumberField source="decimals" sortable={false} label="Decimals" />
      </Datagrid>
    </List>
  );
};

export const TokenShow = (props) => (
  <Show title={<TokenTitle />} {...props}>
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
