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
import { getIdentityForPayouts } from "../utils";
import keyBy from "lodash/keyBy";

const PoolsGrid = (props) => {
  const { accountAddress } = props;
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [sort, setSort] = useState({ field: "symbol", order: "ASC" });

  const version = useVersion();
  const dataProvider = useDataProvider();

  const fetchDeposits = useCallback(async () => {
    try {
      if (accountAddress && accountAddress !== "") {
        setLoading(true);
        const { data, total } = await dataProvider.getList("account-pools", {
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

  return (
    <React.Fragment>
      <Datagrid
        data={keyBy(data, "id")}
        ids={data.map(({ id }) => id)}
        currentSort={sort}
        setSort={(field, order) => setSort({ field, order })}
      >
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

export default PoolsGrid;
