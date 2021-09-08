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

const DepositsGrid = (props) => {
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
        const { data, total } = await dataProvider.getList("account-deposits", {
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

  return (
    <React.Fragment>
      <Datagrid
        data={keyBy(data, "id")}
        ids={data.map(({ id }) => id)}
        currentSort={sort}
        setSort={(field, order) => setSort({ field, order })}
      >
        <TextField source="symbol" sortable={true} label="Symbol" showTime />
        <NumberField source="amount" sortable={true} label="Amount" />
        <NumberField source="contractId" label="Contract Id" sortable={true} />
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

export default DepositsGrid;
