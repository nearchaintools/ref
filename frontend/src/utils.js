import moment from "moment";

export const formatDate = (date) => {
  return moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
};

export const dateDiff = (olderDate, newerDate) => {
  return moment(newerDate).diff(olderDate, "seconds");
};
