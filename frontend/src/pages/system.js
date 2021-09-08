import * as React from "react";
import { Card, CardContent, CardHeader, Box, Grid } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { requestApiData } from "../redux/actions";
import moment from "moment";
import { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Brightness1SharpIcon from "@material-ui/icons/Brightness1Sharp";
import green from "@material-ui/core/colors/green";
import orange from "@material-ui/core/colors/orange";
import red from "@material-ui/core/colors/red";
import Tooltip from "@material-ui/core/Tooltip";
import { VerticalSpacer, Loading } from "../layout/components";
import { fetchData, useGet } from "../redux/api";
import { formatDate, dateDiff } from "../utils";

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
  useGetOne,
} from "react-admin";

const calcThreshodInDayPart = () => {
  const now = moment();

  // new Era start time
  const newEra = moment({ hour: 14, minute: 39 });
  const isAfterEra = now > newEra;

  if (isAfterEra) {
    // in first 3 hours after new era
    if (newEra.add(3, "hours") > now) return 60 * 30;
    // 30 min
    else if (newEra.add(3, "hours") < now && newEra.add(6, "hours") > now)
      return 60 * 60;
    // 60 min
    else if (newEra.add(6, "hours") < now && newEra.add(12, "hours") > now)
      return 60 * 120; // 60 min
  } else {
    return 60 * 240;
  }
};

const SemaforIcon = (props) => {
  const { difference, threshold } = props;

  // diff ratio in percent
  const diffRatio = (difference / threshold - 1) * 100;

  const finalColor =
    diffRatio < 110 ? green : diffRatio > 111 && diffRatio < 150 ? orange : red;

  return (
    <Tooltip title={`Time difference ${difference} seconds`}>
      <Brightness1SharpIcon style={{ color: finalColor[500] }} />
    </Tooltip>
  );
};

export default () => {
  let record = {};

  const { isLoading, isError, data, error } = useGet("systemStatus", "status");

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <p>ERROR: {error}</p>;
  }

  let blockTimeDiff;
  let highestSavedBlockAtDiff;
  let highestSavedRewardEventAtDiff;
  let highestSavedPayoutBlockAtDiff;

  if (data) {
    record = data;
    blockTimeDiff = dateDiff(record.chainData.now, moment());
    highestSavedBlockAtDiff = dateDiff(
      record.databaseData.highestSavedBlockAt,
      record.chainData.now
    );
    // depends on user interaction in polkadot application, so let allow some space
    highestSavedRewardEventAtDiff = dateDiff(
      record.databaseData.highestSavedBlockAt,
      record.databaseData.highestSavedRewardEventAt
    );

    // should be within 3 minutes after
    highestSavedPayoutBlockAtDiff = dateDiff(
      record.databaseData.highestSavedPayoutBlockAt,
      record.databaseData.highestSavedRewardEventAt
    );
  }

  return (
    <React.Fragment>
      <Box display="flex" flexDirection="row">
        <Box m={2} flex="1">
          <Card>
            <CardHeader title="Chain" />
            <CardContent>
              <>
                <p>Name: {record.chainData.nodeName}</p>
                <p>Node Version: {record.chainData.nodeVersion}</p>
                <p>
                  Last Block: {record.chainData.headerNumber} at{" "}
                  {formatDate(record.chainData.now)}{" "}
                  <SemaforIcon difference={blockTimeDiff} threshold={10} />
                </p>
              </>
            </CardContent>
          </Card>
        </Box>

        <Box m={2} flex="1">
          <Card>
            <CardHeader title="Database" />
            <CardContent>
              <>
                <p>
                  <b>Highest Saved Block:</b>
                  {` ${record.databaseData.highestSavedBlock} at ${formatDate(
                    record.databaseData.highestSavedBlockAt
                  )}`}
                  <SemaforIcon
                    difference={highestSavedBlockAtDiff}
                    threshold={80}
                  />
                </p>
                <p>
                  <b>Highest Saved Reward Event At Block:</b>

                  {` ${
                    record.databaseData.highestSavedRewardEvent
                  } at ${formatDate(
                    record.databaseData.highestSavedRewardEventAt
                  )}`}
                  <SemaforIcon
                    difference={highestSavedRewardEventAtDiff}
                    threshold={calcThreshodInDayPart()}
                  />
                </p>
                <p>
                  <b>Highest Saved Payout At Block:</b>
                  {` ${
                    record.databaseData.highestSavedPayoutBlock
                  } at ${formatDate(
                    record.databaseData.highestSavedPayoutBlockAt
                  )}`}
                  <SemaforIcon
                    difference={highestSavedPayoutBlockAtDiff}
                    threshold={200}
                  />
                </p>
              </>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box m={2}>
        <Card>
          <CardHeader title="Data Updates" />
          <CardContent>
            <React.Fragment>
              {record.updateStatus.map((status) => {
                const getStatusInfo = () => {
                  let info;
                  if (!status.finishedAt) {
                    info = `in PROGRESS, started at ${formatDate(
                      status.startedAt
                    )}`;
                  } else {
                    info = `last updated at ${formatDate(status.finishedAt)}`;
                  }
                  return info;
                };

                const Semafor = () => {
                  if (!status.finishedAt) return <React.Fragment />;

                  const diff = dateDiff(status.finishedAt, moment());
                  return (
                    <SemaforIcon difference={diff} threshold={60 * 60 * 24} />
                  );
                };

                return (
                  <p>
                    <b>{`${status.job.toLowerCase()}`}</b>{" "}
                    {`: ${getStatusInfo()}`}
                    <Semafor />
                  </p>
                );
              })}
            </React.Fragment>
          </CardContent>
        </Card>
      </Box>
    </React.Fragment>
  );
};
