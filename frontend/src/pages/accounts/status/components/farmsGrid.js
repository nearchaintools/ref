import React, { useState, useCallback, useEffect } from "react";
import {
  useQuery,
  Datagrid,
  TextField,
  Pagination,
  Loading,
  DateField,
  NumberField,
  FunctionField,
  Labeled,
  useVersion,
  useDataProvider,
} from "react-admin";
import { makeStyles, Link, Grid, Typography } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { getIdentityForPayouts } from "../utils";
import keyBy from "lodash/keyBy";

const FarmsGrid = (props) => {
  const { accountAddress } = props;
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [sort, setSort] = useState({ field: "id", order: "ASC" });

  const version = useVersion();
  const dataProvider = useDataProvider();

  const fetchDeposits = useCallback(async () => {
    try {
      if (accountAddress && accountAddress !== "") {
        setLoading(true);
        const { data, total } = await dataProvider.getList("account-farms", {
          pagination: { page, perPage },
          sort,
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
    fetchDeposits();
  }, [accountAddress, version]);

  const { data, total } = state;

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p>ERROR: {error}</p>;
  }
  if (!data || data.length <= 0) {
    return <p>NO DATA</p>;
  }

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

  const renderLocaleFloat = (numberStr) => {
    const number = parseFloat(numberStr);
    return number.toLocaleString();
  };

  const renderPoolLink = (record) => {
    return (
      <Link href={`#/pools/${record.simplePoolId}/show/0`}>
        {record.simplePoolId}
      </Link>
    );
  };

  return (
    <React.Fragment>
      <Datagrid
        data={keyBy(data, "id")}
        ids={data.map(({ id }) => id)}
        currentSort={sort}
        setSort={(field, order) => setSort({ field, order })}
      >
        <NumberField source="id" sortable={true} label="Farm ID" />

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
        <FunctionField
          render={(record) => renderLocaleFloat(record.accountShares)}
          sortable={true}
          label="Shares"
        />
        <FunctionField
          render={(record) => renderLocaleFloat(record.accountUnclaimedRewards)}
          sortable={true}
          label="Unclaimed Rewards"
        />
        <TextField
          source="rewardToken.symbol"
          label="Rewards Token"
          sortable={false}
        />
      </Datagrid>
      <Pagination
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        total={total}
      />
    </React.Fragment>
  );
};

export default FarmsGrid;
