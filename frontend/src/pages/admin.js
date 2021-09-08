import * as React from "react";
import { Card, CardContent, CardHeader, Box, Grid } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { requestApiData } from "../redux/actions";
import moment from "moment";
import { useState, useEffect, useCallback } from "react";
import Typography from "@material-ui/core/Typography";
import { VerticalSpacer, Loading } from "../layout/components";
import { fetchData, useGet } from "../redux/api";
import { formatDate } from "../utils";
import { useAuth0 } from "@auth0/auth0-react";

import {
  useNotify,
  useRedirect,
  fetchStart,
  fetchEnd,
  Button,
  TextField,
  NumberField,
  FunctionField,
  Labeled,
  useVersion,
  useDataProvider,
} from "react-admin";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </button>
  );
};

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        {userMetadata ? (
          <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
        ) : (
          "No user metadata defined"
        )}
      </div>
    )
  );
};

export default () => {
  const version = useVersion();
  const dataProvider = useDataProvider();
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: adminData } = await dataProvider.getOne("admin", {
        id: "new-accounts",
      });
      setLoading(false);
      setState((state) => ({
        ...state,
        adminData,
      }));
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  }, [dataProvider]);

  useEffect(() => {
    fetchData();
  }, [version]);

  const { adminData } = state;

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return (
      <div>
        <div>Error: {error.message}</div>
        <div>
          <LoginButton />
          <Profile />
        </div>
        <div>
          <LogoutButton />
        </div>
      </div>
    );
  }

  return (
    <Box display="flex" flexDirection="row">
      <Box m={2} flex="1">
        <Card>
          <CardHeader title="Chain" />
          <CardContent>
            <Typography variant="body1">Vítej v Admin prostředí</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
