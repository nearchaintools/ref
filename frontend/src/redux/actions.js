export const REQUEST_API_DATA = "REQUEST_API_DATA";
export const RECEIVE_API_DATA = "RECEIVE_API_DATA";
export const CHANGE_THEME = "CHANGE_THEME";
export const STATUS_RECEIVED = "STATUS_RECEIVED";

export const changeTheme = (theme) => ({
  type: CHANGE_THEME,
  payload: theme,
});

export const changeSystemStatus = () => ({
  type: STATUS_RECEIVED,
  payload: new Date(),
});

export const requestApiData = () => ({
  type: REQUEST_API_DATA,
});

export const receiveApiData = (data) => ({
  type: RECEIVE_API_DATA,
  payload: data,
});
