//http://docs.pulsetile.com/react-admin-redux.html
//https://www.youtube.com/watch?v=jQ4YD7Ip6T4

import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { showNotification } from "react-admin";
import { fetchData } from "./api";
import { STATUS_RECEIVED, REQUEST_API_DATA, receiveApiData } from "./actions";

function* getApiData(action) {
  try {
    const data = yield call(fetchData);
    yield put(receiveApiData(data));
  } catch (e) {
    yield put(showNotification(`${e.message}`));
  }
}

export function* apiSaga() {
  yield takeLatest(REQUEST_API_DATA, getApiData);
}

export function* statusSaga() {
  yield takeEvery("STATUS_RECEIVED", function* () {
    yield put(showNotification("New Status Received"));
  });
}
