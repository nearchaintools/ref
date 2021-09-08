import { Reducer } from "redux";
import { CHANGE_THEME, changeTheme, RECEIVE_API_DATA } from "./actions";

export const themeReducer = (previousState = "light", action) => {
  if (action.type === CHANGE_THEME) {
    return action.payload;
  }

  return previousState;
};

export const apiReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case RECEIVE_API_DATA:
      return payload;
    default:
      return state;
  }
};
