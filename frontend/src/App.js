// in src/App.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Admin,
  Resource,
  ShowGuesser,
  ListGuesser,
  useDataProvider,
  useVersion,
} from "react-admin";
import restProvider from "ra-data-simple-rest";
import { fetchUtils } from "ra-core";
import { createTheme } from "@material-ui/core/styles";
import indigo from "@material-ui/core/colors/indigo";
import pink from "@material-ui/core/colors/pink";
import dotenv from "dotenv";
import { QueryClientProvider, QueryClient } from "react-query";
import { Layout, Login } from "./layout";
import { Dashboard } from "./pages/dashboard";
import customRoutes from "./routes";
import { apiSaga } from "./redux/sagas";
import { apiReducer } from "./redux/reducers";
import ChainProvider from "./chain/ChainProvider";
import { PoolsList, PoolIcon, PoolShow } from "./resources/pools";
import {
  LiquidityList,
  LiquidityIcon,
  LiquidityShow,
} from "./resources/liquidity";
import { TokensList, TokenIcon, TokenShow } from "./resources/tokens";
import { FarmsList, FarmIcon, FarmShow } from "./resources/farms";

dotenv.config();

const queryClient = new QueryClient();

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  // const { token } = JSON.parse(localStorage.getItem('auth'));
  // options.headers.set('Authorization', `Bearer ${token}`);

  //options.credentials = "include";
  return fetchUtils.fetchJson(url, options);
};

const dataProvider = restProvider(
  `${process.env.REACT_APP_SERVER_URL}`,
  httpClient,
  "X-Total-Count"
);

const theme = createTheme({
  palette: {
    type: "dark", // Switching the dark mode on is a single property value change.
    background: {
      default: "#001220",
      paper: "#006c61",
    },
    primary: {
      light: "#5ac08b",
      main: "#003648",
      dark: "#1a4641",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#ff88d3",
      main: "#f653a2",
      dark: "#bf0e73",
      contrastText: "#000000",
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChainProvider dataProvider={dataProvider}>
        <Admin
          dataProvider={dataProvider}
          //authProvider={authProvider}
          theme={theme}
          disableTelemetry
          title="REF Finance Explorer and statistics"
          layout={Layout}
          dashboard={Dashboard}
          customRoutes={customRoutes}
          customSagas={[apiSaga]}
          customReducers={{ apiReducer: apiReducer }}
        >
          <Resource
            options={{ label: "Tokens" }}
            name="tokens"
            list={TokensList}
            show={TokenShow}
            icon={TokenIcon}
          />
          <Resource
            options={{ label: "Pools" }}
            name="pools"
            list={PoolsList}
            show={PoolShow}
            icon={PoolIcon}
          />

          <Resource name="pool-tokens" />

          <Resource
            options={{ label: "Farms" }}
            name="farms"
            list={FarmsList}
            show={FarmShow}
            icon={FarmIcon}
          />

          <Resource
            options={{ label: "Liquidity" }}
            name="liquidity"
            list={LiquidityList}
            show={LiquidityShow}
            icon={LiquidityIcon}
          />
        </Admin>
      </ChainProvider>
    </QueryClientProvider>
  );
};

export default App;
