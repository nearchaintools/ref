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

const LiquidityGrid = (props) => {
  const { accountAddress } = props;
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [sort, setSort] = useState({ field: "timestamp", order: "DESC" });

  const version = useVersion();
  const dataProvider = useDataProvider();

  const fetchDeposits = useCallback(async () => {
    try {
      if (accountAddress && accountAddress !== "") {
        setLoading(true);
        const { data, total } = await dataProvider.getList("liquidity", {
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

  return (
    <React.Fragment>
      <Datagrid
        data={keyBy(data, "id")}
        ids={data.map(({ id }) => id)}
        currentSort={sort}
        setSort={(field, order) => setSort({ field, order })}
      >
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

export default LiquidityGrid;
